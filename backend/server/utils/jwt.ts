import { H3Event } from "h3";
import jwt from "jsonwebtoken";
import parse from "parse-duration";

export function verifyJwt(event: H3Event, token: string) {
  const secret = useRuntimeConfig(event).jwtSecret;
  return jwt.verify(token, secret);
}

export function signJwt(
  event: H3Event,
  id: string,
  payload: Record<string, unknown>,
  lifetime?: string
) {
  const secret = useRuntimeConfig(event).jwtSecret;
  lifetime = lifetime ?? useRuntimeConfig(event).jwtLife;
  const duration = parse(lifetime);

  return jwt.sign(payload, secret, {
    expiresIn: duration,
    algorithm: "HS256",
    jwtid: id,
    encoding: "utf8",
  });
}
