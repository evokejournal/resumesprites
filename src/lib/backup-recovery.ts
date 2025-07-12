import { adminDb } from './firebase-admin';
import { collection, getDocs, doc, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from './firebase';
import { getEncryptionService } from './encryption';

// Backup types
export interface BackupMetadata {
  id: string;
  timestamp: string;
  type: 'full' | 'incremental';
  size: number;
  recordCount: number;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  error?: string;
}

export interface BackupData {
  metadata: BackupMetadata;
  data: {
    users: any[];
    resumes: any[];
    links: any[];
  };
}

// Backup service class
export class BackupService {
  private encryptionService = getEncryptionService();

  // Create a full backup of all data
  async createFullBackup(): Promise<BackupMetadata> {
    const backupId = `backup_${Date.now()}`;
    const metadata: BackupMetadata = {
      id: backupId,
      timestamp: new Date().toISOString(),
      type: 'full',
      size: 0,
      recordCount: 0,
      status: 'in_progress',
    };

    try {
      // Save metadata
      await this.saveBackupMetadata(metadata);

      // Collect all data
      const backupData: BackupData = {
        metadata,
        data: {
          users: [],
          resumes: [],
          links: [],
        },
      };

      // Backup users
      const usersSnapshot = await adminDb.collection('users').get();
      backupData.data.users = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Backup resumes
      const resumesSnapshot = await adminDb.collection('resumes').get();
      backupData.data.resumes = resumesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Backup links
      const linksSnapshot = await adminDb.collection('links').get();
      backupData.data.links = linksSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Update metadata
      metadata.recordCount = 
        backupData.data.users.length + 
        backupData.data.resumes.length + 
        backupData.data.links.length;
      metadata.size = JSON.stringify(backupData).length;
      metadata.status = 'completed';

      // Encrypt and save backup
      await this.saveBackupData(backupId, backupData);

      // Update metadata
      await this.saveBackupMetadata(metadata);

      return metadata;
    } catch (error) {
      metadata.status = 'failed';
      metadata.error = error instanceof Error ? error.message : 'Unknown error';
      await this.saveBackupMetadata(metadata);
      throw error;
    }
  }

  // Restore data from backup
  async restoreFromBackup(backupId: string): Promise<void> {
    try {
      // Load backup data
      const backupData = await this.loadBackupData(backupId);
      
      if (!backupData) {
        throw new Error('Backup not found');
      }

      // Validate backup
      if (backupData.metadata.status !== 'completed') {
        throw new Error('Backup is not in completed status');
      }

      // Create a batch for atomic operations
      const batch = writeBatch(db);

      // Restore users
      for (const user of backupData.data.users) {
        const { id, ...userData } = user;
        const userRef = doc(db, 'users', id);
        batch.set(userRef, userData);
      }

      // Restore resumes
      for (const resume of backupData.data.resumes) {
        const { id, ...resumeData } = resume;
        const resumeRef = doc(db, 'resumes', id);
        batch.set(resumeRef, resumeData);
      }

      // Restore links
      for (const link of backupData.data.links) {
        const { id, ...linkData } = link;
        const linkRef = doc(db, 'links', id);
        batch.set(linkRef, linkData);
      }

      // Commit the batch
      await batch.commit();

      console.log(`Successfully restored backup ${backupId}`);
    } catch (error) {
      console.error('Failed to restore backup:', error);
      throw error;
    }
  }

  // List all backups
  async listBackups(): Promise<BackupMetadata[]> {
    try {
      const backupsSnapshot = await adminDb.collection('backups').get();
      return backupsSnapshot.docs.map(doc => doc.data() as BackupMetadata);
    } catch (error) {
      console.error('Failed to list backups:', error);
      return [];
    }
  }

  // Delete a backup
  async deleteBackup(backupId: string): Promise<void> {
    try {
      // Delete backup data
      await adminDb.collection('backupData').doc(backupId).delete();
      
      // Delete metadata
      await adminDb.collection('backups').doc(backupId).delete();
      
      console.log(`Successfully deleted backup ${backupId}`);
    } catch (error) {
      console.error('Failed to delete backup:', error);
      throw error;
    }
  }

  // Save backup metadata
  private async saveBackupMetadata(metadata: BackupMetadata): Promise<void> {
    await adminDb.collection('backups').doc(metadata.id).set(metadata);
  }

  // Save encrypted backup data
  private async saveBackupData(backupId: string, data: BackupData): Promise<void> {
    const jsonData = JSON.stringify(data);
    const encrypted = await this.encryptionService.encrypt(jsonData);
    
    await adminDb.collection('backupData').doc(backupId).set({
      encrypted: encrypted.encrypted,
      iv: encrypted.iv,
      tag: encrypted.tag,
      timestamp: new Date().toISOString(),
    });
  }

  // Load and decrypt backup data
  private async loadBackupData(backupId: string): Promise<BackupData | null> {
    try {
      const backupDoc = await adminDb.collection('backupData').doc(backupId).get();
      
      if (!backupDoc.exists) {
        return null;
      }

      const data = backupDoc.data()!;
      const encrypted = {
        encrypted: data.encrypted,
        iv: data.iv,
        tag: data.tag,
      };

      const decrypted = await this.encryptionService.decrypt(encrypted);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Failed to load backup data:', error);
      return null;
    }
  }

  // Create incremental backup (only changed data since last backup)
  async createIncrementalBackup(lastBackupId: string): Promise<BackupMetadata> {
    const backupId = `backup_${Date.now()}`;
    const metadata: BackupMetadata = {
      id: backupId,
      timestamp: new Date().toISOString(),
      type: 'incremental',
      size: 0,
      recordCount: 0,
      status: 'in_progress',
    };

    try {
      // Get last backup timestamp
      const lastBackup = await adminDb.collection('backups').doc(lastBackupId).get();
      if (!lastBackup.exists) {
        throw new Error('Last backup not found');
      }

      const lastBackupTime = lastBackup.data()!.timestamp;

      // Save metadata
      await this.saveBackupMetadata(metadata);

      // Collect only changed data
      const backupData: BackupData = {
        metadata,
        data: {
          users: [],
          resumes: [],
          links: [],
        },
      };

      // Get changed data since last backup
      const changedUsers = await adminDb
        .collection('users')
        .where('updatedAt', '>', lastBackupTime)
        .get();
      
      backupData.data.users = changedUsers.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const changedResumes = await adminDb
        .collection('resumes')
        .where('updatedAt', '>', lastBackupTime)
        .get();
      
      backupData.data.resumes = changedResumes.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const changedLinks = await adminDb
        .collection('links')
        .where('updatedAt', '>', lastBackupTime)
        .get();
      
      backupData.data.links = changedLinks.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Update metadata
      metadata.recordCount = 
        backupData.data.users.length + 
        backupData.data.resumes.length + 
        backupData.data.links.length;
      metadata.size = JSON.stringify(backupData).length;
      metadata.status = 'completed';

      // Save backup
      await this.saveBackupData(backupId, backupData);
      await this.saveBackupMetadata(metadata);

      return metadata;
    } catch (error) {
      metadata.status = 'failed';
      metadata.error = error instanceof Error ? error.message : 'Unknown error';
      await this.saveBackupMetadata(metadata);
      throw error;
    }
  }
}

// Global backup service instance
let backupService: BackupService | null = null;

export function getBackupService(): BackupService {
  if (!backupService) {
    backupService = new BackupService();
  }
  return backupService;
}

// Utility functions for automated backups
export async function scheduleBackup(): Promise<void> {
  const service = getBackupService();
  
  try {
    console.log('Starting scheduled backup...');
    const metadata = await service.createFullBackup();
    console.log(`Backup completed: ${metadata.id}`);
  } catch (error) {
    console.error('Scheduled backup failed:', error);
  }
}

// Data export for compliance (GDPR, CCPA)
export async function exportUserData(userId: string): Promise<any> {
  try {
    const userData: any = {};

    // Get user data
    const userDoc = await adminDb.collection('users').doc(userId).get();
    if (userDoc.exists) {
      userData.user = { id: userDoc.id, ...userDoc.data() };
    }

    // Get user's resumes
    const resumesSnapshot = await adminDb
      .collection('resumes')
      .where('userId', '==', userId)
      .get();
    
    userData.resumes = resumesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Get user's links
    const linksSnapshot = await adminDb
      .collection('links')
      .where('userId', '==', userId)
      .get();
    
    userData.links = linksSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return userData;
  } catch (error) {
    console.error('Failed to export user data:', error);
    throw error;
  }
}

// Data deletion for compliance (GDPR right to be forgotten)
export async function deleteUserData(userId: string): Promise<void> {
  try {
    const batch = writeBatch(db);

    // Delete user's resumes
    const resumesSnapshot = await adminDb
      .collection('resumes')
      .where('userId', '==', userId)
      .get();
    
    resumesSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref as any);
    });

    // Delete user's links
    const linksSnapshot = await adminDb
      .collection('links')
      .where('userId', '==', userId)
      .get();
    
    linksSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref as any);
    });

    // Delete user document
    const userRef = doc(db, 'users', userId);
    batch.delete(userRef);

    // Commit the batch
    await batch.commit();

    console.log(`Successfully deleted all data for user ${userId}`);
  } catch (error) {
    console.error('Failed to delete user data:', error);
    throw error;
  }
} 