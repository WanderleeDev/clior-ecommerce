export abstract class OpaqueTokenPort {
  abstract generate(): string;
  abstract hash(token: string): string;
}
