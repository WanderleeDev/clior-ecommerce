export class InvalidOneTimeTokenError extends Error {
  constructor() {
    super('Invalid or expired token');
    this.name = 'InvalidOneTimeTokenError';
  }
}

export class AccountLockedError extends Error {
  constructor() {
    super('Account is temporarily locked');
    this.name = 'AccountLockedError';
  }
}

export class EmailNotVerifiedError extends Error {
  constructor() {
    super('Email address must be verified before login');
    this.name = 'EmailNotVerifiedError';
  }
}
