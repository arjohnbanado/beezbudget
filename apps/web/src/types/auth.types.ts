export interface SignUpResponse {
  id: string;
}

export interface LoginResponse {
  isOnboarded: boolean;
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  preferred_currency_code: string | null;
  is_onboarded: boolean;
}

export interface CompleteOnboardingPayload {
  name: string;
  preferred_currency_code: string;
}
