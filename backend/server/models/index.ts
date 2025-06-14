export type RecaptchaVerificationResponse = {
  success: boolean;
  challenge_ts: string;
  hostname: string;
  "error-codes": any[];
};
