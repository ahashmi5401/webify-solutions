import { ValidationError } from './errors';

interface TurnstileVerifyResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
}

export async function verifyTurnstileToken(token: string): Promise<void> {
  if (!token) {
    throw new ValidationError('Turnstile token is required');
  }

  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    throw new Error('TURNSTILE_SECRET_KEY is not configured');
  }

  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    }
  );

  const data: TurnstileVerifyResponse = await response.json();

  if (!data.success) {
    throw new ValidationError(
      'Turnstile verification failed. Please try again.'
    );
  }
}
