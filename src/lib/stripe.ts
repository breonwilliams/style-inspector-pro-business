import { loadStripe } from '@stripe/stripe-js';
import type { Stripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  throw new Error('Missing Stripe publishable key');
}

export const stripePromise = loadStripe(stripePublishableKey);

// Price ID constants
export const STRIPE_PRICE_IDS = {
  PRO: import.meta.env.VITE_STRIPE_PRICE_ID_PRO,
  TEAM: import.meta.env.VITE_STRIPE_PRICE_ID_TEAM,
} as const;

// Plan mapping
export const PRICE_ID_TO_PLAN: Record<string, 'pro' | 'team'> = {
  [STRIPE_PRICE_IDS.PRO]: 'pro',
  [STRIPE_PRICE_IDS.TEAM]: 'team',
};

export const PLAN_TO_PRICE_ID: Record<'pro' | 'team', string> = {
  pro: STRIPE_PRICE_IDS.PRO,
  team: STRIPE_PRICE_IDS.TEAM,
};

// Types
export interface CreateCheckoutSessionParams {
  priceId: string;
  userId: string;
  userEmail: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CreatePortalSessionParams {
  customerId: string;
  returnUrl?: string;
}

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export interface PortalSessionResponse {
  url: string;
}

// Create checkout session
export async function createCheckoutSession(params: CreateCheckoutSessionParams): Promise<CheckoutSessionResponse> {
  const response = await fetch('/api/stripe/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create checkout session: ${error}`);
  }

  return response.json();
}

// Create customer portal session
export async function createCustomerPortalSession(params: CreatePortalSessionParams): Promise<PortalSessionResponse> {
  const response = await fetch('/api/stripe/create-portal-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create portal session: ${error}`);
  }

  return response.json();
}

// Redirect to Stripe Checkout
export async function redirectToCheckout(params: CreateCheckoutSessionParams): Promise<void> {
  const stripe = await stripePromise;
  
  if (!stripe) {
    throw new Error('Stripe failed to load');
  }

  try {
    const { sessionId } = await createCheckoutSession(params);
    
    const { error } = await stripe.redirectToCheckout({
      sessionId,
    });

    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Error redirecting to checkout:', error);
    throw error;
  }
}

// Redirect to customer portal
export async function redirectToCustomerPortal(params: CreatePortalSessionParams): Promise<void> {
  try {
    const { url } = await createCustomerPortalSession(params);
    window.location.href = url;
  } catch (error) {
    console.error('Error redirecting to customer portal:', error);
    throw error;
  }
}

// Utility functions
export function getPlanDisplayName(plan: string): string {
  switch (plan) {
    case 'free':
      return 'Developer';
    case 'pro':
      return 'Pro';
    case 'team':
      return 'Team';
    default:
      return 'Unknown';
  }
}

export function getPlanPrice(plan: string): number {
  switch (plan) {
    case 'free':
      return 0;
    case 'pro':
      return 9;
    case 'team':
      return 29;
    default:
      return 0;
  }
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}
