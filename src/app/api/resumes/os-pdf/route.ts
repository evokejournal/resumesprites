import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// Win95 color palette matching the password screen
const WIN95_BG = rgb(0, 0.5, 0.5); // #008080 - teal background
const WIN95_WINDOW = rgb(1, 1, 1); // white window background
const WIN95_TITLEBAR = rgb(0, 0, 0.5); // #000080 - blue title bar
const WIN95_TITLEBAR_TEXT = rgb(1, 1, 1); // white text
const WIN95_BORDER = rgb(0.53, 0.53, 0.53); // #888 - gray border
const WIN95_TEXT = rgb(0, 0, 0); // black text
const WIN95_ACCENT = rgb(0, 0, 0.5); // #000080 - blue accent
const WIN95_GRAY = rgb(0.75, 0.75, 0.75); // #C0C0C0 - light gray

export async function POST(req: NextRequest) {
  const { resumeData, resumeUrl, password } = await req.json();
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const PAGE_WIDTH = 595;
  const PAGE_HEIGHT = 842;
  const MARGIN = 50;
  
  // Dialog box dimensions
  const DIALOG_WIDTH = 400;
  const DIALOG_HEIGHT = 280;
  const DIALOG_X = (PAGE_WIDTH - DIALOG_WIDTH) / 2;
  const DIALOG_Y = (PAGE_HEIGHT - DIALOG_HEIGHT) / 2;
  
  // Title bar dimensions
  const TITLEBAR_HEIGHT = 24;
  const TITLEBAR_Y = DIALOG_Y + DIALOG_HEIGHT - TITLEBAR_HEIGHT;
  
  // Content padding
  const CONTENT_PADDING = 24;
  const CONTENT_WIDTH = DIALOG_WIDTH - CONTENT_PADDING * 2;

  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  // Draw teal background
  page.drawRectangle({
    x: 0, y: 0, width: PAGE_WIDTH, height: PAGE_HEIGHT,
    color: WIN95_BG,
  });

  // Draw main dialog window (white background)
  page.drawRectangle({
    x: DIALOG_X, y: DIALOG_Y, width: DIALOG_WIDTH, height: DIALOG_HEIGHT,
    color: WIN95_WINDOW,
    borderColor: WIN95_BORDER,
    borderWidth: 3,
  });

  // Draw title bar (blue)
  page.drawRectangle({
    x: DIALOG_X, y: TITLEBAR_Y, width: DIALOG_WIDTH, height: TITLEBAR_HEIGHT,
    color: WIN95_TITLEBAR,
  });

  // Draw title bar text
  page.drawText('Password Required', {
    x: DIALOG_X + 12, y: TITLEBAR_Y + 6,
    size: 12,
    font: fontBold,
    color: WIN95_TITLEBAR_TEXT,
  });

  // Draw window control buttons (minimize, maximize, close)
  const buttonSize = 16;
  const buttonY = TITLEBAR_Y + 4;
  const buttonSpacing = 4;
  
  // Close button (X)
  page.drawRectangle({
    x: DIALOG_X + DIALOG_WIDTH - 20, y: buttonY, width: buttonSize, height: buttonSize,
    color: WIN95_GRAY,
    borderColor: WIN95_BORDER,
    borderWidth: 1,
  });
  page.drawText('×', {
    x: DIALOG_X + DIALOG_WIDTH - 16, y: buttonY + 2,
    size: 10,
    font: fontBold,
    color: WIN95_TEXT,
  });

  // Maximize button (□)
  page.drawRectangle({
    x: DIALOG_X + DIALOG_WIDTH - 20 - buttonSize - buttonSpacing, y: buttonY, width: buttonSize, height: buttonSize,
    color: WIN95_GRAY,
    borderColor: WIN95_BORDER,
    borderWidth: 1,
  });
  page.drawText('□', {
    x: DIALOG_X + DIALOG_WIDTH - 16 - buttonSize - buttonSpacing, y: buttonY + 2,
    size: 10,
    font: fontBold,
    color: WIN95_TEXT,
  });

  // Minimize button (_)
  page.drawRectangle({
    x: DIALOG_X + DIALOG_WIDTH - 20 - (buttonSize + buttonSpacing) * 2, y: buttonY, width: buttonSize, height: buttonSize,
    color: WIN95_GRAY,
    borderColor: WIN95_BORDER,
    borderWidth: 1,
  });
  page.drawText('_', {
    x: DIALOG_X + DIALOG_WIDTH - 16 - (buttonSize + buttonSpacing) * 2, y: buttonY + 2,
    size: 10,
    font: fontBold,
    color: WIN95_TEXT,
  });

  // Content area
  const contentY = TITLEBAR_Y - CONTENT_PADDING;
  
  // Draw lock icon area (gray box)
  const iconSize = 64;
  const iconX = DIALOG_X + CONTENT_PADDING;
  const iconY = contentY - iconSize;
  
  page.drawRectangle({
    x: iconX, y: iconY, width: iconSize, height: iconSize,
    color: WIN95_GRAY,
    borderColor: WIN95_BORDER,
    borderWidth: 2,
  });

  // Draw lock icon (simplified as a rectangle with a circle)
  const lockColor = WIN95_ACCENT;
  // Lock body
  page.drawRectangle({
    x: iconX + 16, y: iconY + 24, width: 32, height: 24,
    color: lockColor,
  });
  // Lock shackle
  page.drawRectangle({
    x: iconX + 20, y: iconY + 32, width: 24, height: 8,
    color: lockColor,
  });
  page.drawRectangle({
    x: iconX + 24, y: iconY + 40, width: 4, height: 8,
    color: lockColor,
  });
  page.drawRectangle({
    x: iconX + 36, y: iconY + 40, width: 4, height: 8,
    color: lockColor,
  });

  // Draw text content
  const textX = iconX + iconSize + 16;
  const textStartY = contentY - 20;
  
  // "Authentication Required" heading
  page.drawText('Authentication Required', {
    x: textX, y: textStartY,
    size: 16,
    font: fontBold,
    color: WIN95_ACCENT,
  });

  // "Please enter the password to view this resume." subtitle
  page.drawText('Please enter the password to view this resume.', {
    x: textX, y: textStartY - 20,
    size: 10,
    font: font,
    color: rgb(0.4, 0.4, 0.4),
  });

  // "Password:" label
  page.drawText('Password:', {
    x: textX, y: textStartY - 50,
    size: 12,
    font: fontBold,
    color: WIN95_TEXT,
  });

  // Password input field (gray border)
  const inputY = textStartY - 70;
  const inputHeight = 24;
  page.drawRectangle({
    x: textX, y: inputY, width: 200, height: inputHeight,
    color: WIN95_WINDOW,
    borderColor: WIN95_BORDER,
    borderWidth: 2,
  });

  // Password text (masked with dots)
  const passwordDots = '•'.repeat(password.length || 8);
  page.drawText(passwordDots, {
    x: textX + 8, y: inputY + 6,
    size: 12,
    font: font,
    color: rgb(0.6, 0.6, 0.6),
  });

  // Eye icon (simplified as a circle)
  page.drawCircle({
    x: textX + 190, y: inputY + inputHeight / 2, size: 6,
    color: rgb(0.5, 0.5, 0.5),
  });

  // Button area
  const buttonAreaY = inputY - 40;
  const buttonWidth = 60;
  const buttonHeight = 24;
  const buttonSpacingButtons = 8;

  // Cancel button
  page.drawRectangle({
    x: textX + 120, y: buttonAreaY, width: buttonWidth, height: buttonHeight,
    color: WIN95_GRAY,
    borderColor: WIN95_BORDER,
    borderWidth: 2,
  });
  page.drawText('Cancel', {
    x: textX + 135, y: buttonAreaY + 6,
    size: 10,
    font: fontBold,
    color: WIN95_TEXT,
  });

  // OK button
  page.drawRectangle({
    x: textX + 120 + buttonWidth + buttonSpacingButtons, y: buttonAreaY, width: buttonWidth, height: buttonHeight,
    color: WIN95_GRAY,
    borderColor: WIN95_BORDER,
    borderWidth: 2,
  });
  page.drawText('OK', {
    x: textX + 120 + buttonWidth + buttonSpacingButtons + 20, y: buttonAreaY + 6,
    size: 10,
    font: fontBold,
    color: WIN95_TEXT,
  });

  // Draw resume link and password info below the dialog
  const infoY = DIALOG_Y - 40;
  
  // Resume URL
  page.drawText('Resume URL:', {
    x: MARGIN, y: infoY,
    size: 12,
    font: fontBold,
    color: WIN95_TEXT,
  });
  
  page.drawText(resumeUrl || 'https://resumesprites.com/resume/[shortId]', {
    x: MARGIN, y: infoY - 18,
    size: 10,
    font: font,
    color: WIN95_ACCENT,
  });

  // Password
  page.drawText('Password:', {
    x: MARGIN, y: infoY - 40,
    size: 12,
    font: fontBold,
    color: WIN95_TEXT,
  });
  
  page.drawText(password || 'Enter the password provided', {
    x: MARGIN, y: infoY - 58,
    size: 10,
    font: font,
    color: WIN95_TEXT,
  });

  // Draw taskbar at bottom
  const taskbarHeight = 36;
  const taskbarY = 0;
  
  page.drawRectangle({
    x: 0, y: taskbarY, width: PAGE_WIDTH, height: taskbarHeight,
    color: WIN95_GRAY,
    borderColor: WIN95_TITLEBAR_TEXT,
    borderWidth: 2,
  });

  // Start button
  page.drawRectangle({
    x: 4, y: taskbarY + 4, width: 60, height: 28,
    color: WIN95_GRAY,
    borderColor: WIN95_BORDER,
    borderWidth: 2,
  });
  
  // Windows flag icon (simplified)
  page.drawRectangle({
    x: 8, y: taskbarY + 8, width: 16, height: 16,
    color: WIN95_BG,
  });
  page.drawRectangle({
    x: 10, y: taskbarY + 10, width: 12, height: 12,
    color: WIN95_WINDOW,
  });
  
  page.drawText('Start', {
    x: 30, y: taskbarY + 12,
    size: 10,
    font: fontBold,
    color: WIN95_TEXT,
  });

  // Clock
  const clockText = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const clockWidth = font.widthOfTextAtSize(clockText, 10);
  page.drawRectangle({
    x: PAGE_WIDTH - clockWidth - 16, y: taskbarY + 4, width: clockWidth + 12, height: 28,
    color: WIN95_GRAY,
    borderColor: WIN95_BORDER,
    borderWidth: 2,
  });
  page.drawText(clockText, {
    x: PAGE_WIDTH - clockWidth - 12, y: taskbarY + 12,
    size: 10,
    font: font,
    color: WIN95_TEXT,
  });

  const pdfBytes = await pdfDoc.save();
  return new NextResponse(pdfBytes, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="operating-system-password.pdf"',
    },
  });
} 