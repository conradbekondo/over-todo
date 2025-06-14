import { H3Event } from "h3";
import { RecaptchaVerificationResponse } from "~/models";

export async function validateRecaptcha(event: H3Event) {
  const secret = useRuntimeConfig(event).recaptchaSecret;
  const token = getHeader(event, "x-recaptcha-token");
  const response = await $fetch<RecaptchaVerificationResponse>(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret,
        response: token ?? "",
      }).toString(),
    }
  );

  if (!response.success) {
    const logger = useLogger(event);
    logger.warn(
      "recaptcha verification failed",
      "errors",
      response["error-codes"]
    );
    throw createError({
      statusCode: 403,
      message: "Forbidden access",
      statusMessage: "Client Error",
    });
  }
}
