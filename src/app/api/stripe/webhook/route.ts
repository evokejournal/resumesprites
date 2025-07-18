import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminDb } from '@/lib/firebase-admin';
import { sendSubscriptionEmail } from '@/lib/email-service';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const sig = request.headers.get('stripe-signature');
  const rawBody = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: 'Webhook signature verification failed.' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const userEmail = session.customer_email || session.metadata?.userEmail;
    
    if (userId) {
      await adminDb.collection('users').doc(userId).update({ subscription: 'lifetime' });
      
      // Send subscription confirmation email (non-blocking)
      if (userEmail) {
        try {
          await sendSubscriptionEmail({
            name: session.metadata?.userName || 'User',
            email: userEmail,
            plan: 'Lifetime Access',
            amount: `$${(session.amount_total! / 100).toFixed(2)}`,
            transactionId: session.payment_intent as string,
          });
        } catch (emailError) {
          console.error('Failed to send subscription email:', emailError);
          // Don't fail the webhook if email fails
        }
      }
    }
  }

  return NextResponse.json({ received: true });
} 