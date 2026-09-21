export abstract class EmailSenderPort {
  abstract sendVerification(input: { email: string; name: string; token: string }): Promise<void>;
  abstract sendPasswordReset(input: { email: string; name: string; token: string }): Promise<void>;
}
