
import api from '../axios';

export interface CreatePaymentIntentRequest {
  amount: number; // Amount in cents 
  currency: string; // Currency code 
}

export interface CreatePaymentIntentResponse {
  clientSecret: string;
}

export interface StripeErrorResponse {
  error: string;
}

/**
 * Creates a payment intent with Stripe
 * @param amount - Amount in cents 
 * @param currency - Currency code 
 * @returns Promise with client secret for frontend payment processing
 */
export const createPaymentIntent = async (
  amount: number,
  currency: string = 'usd'
): Promise<CreatePaymentIntentResponse> => {
  try {
    const response = await api.post<CreatePaymentIntentResponse>(
      '/stripe/create-payment-intent',
      {
        amount,
        currency: currency.toLowerCase(),
      }
    );

    return response.data;
  } catch (error: any) {
    // Handle axios error response
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    
    // Handle network or other errors
    throw new Error(error.message || 'Failed to create payment intent');
  }
};

/**
 * Helper function to convert dollar amount to cents
 * @param dollars - Amount in dollars 
 * @returns Amount in cents 
 */
export const dollarsToCents = (dollars: number): number => {
  return Math.round(dollars * 100);
};

/**
 * Helper function to convert cents to dollars
 * @param cents - Amount in cents 
 * @returns Amount in dollars 
 */
export const centsToDollars = (cents: number): number => {
  return cents / 100;
};