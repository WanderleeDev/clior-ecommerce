// Regular expressions for validating email and password formats
// Object containing validation patterns
export const { emailRgx, passwordRgx } = {
  // Validates email format:
  // - Must contain alphanumeric characters before @ symbol
  // - Must have @ symbol followed by domain name
  // - Domain must end with period and 2+ letter TLD
  emailRgx: /^[a-zA-Z0-9]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

  // Validates password format:
  // - Must be 7-20 characters long
  // - Must contain at least one lowercase letter
  // - Must contain at least one uppercase letter
  // - Must contain at least one number
  passwordRgx: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{7,20}$/,
};
