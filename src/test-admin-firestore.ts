import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

const db = getFirestore(app);

async function listUsers() {
  try {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.get();
    const userIds = snapshot.docs.map(doc => doc.id);
    console.log('User IDs found:', userIds);
  } catch (err) {
    console.error('Error fetching users:', err);
  }
}

listUsers(); 