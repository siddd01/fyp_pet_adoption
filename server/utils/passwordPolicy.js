export const PASSWORD_REQUIREMENTS_MESSAGE =
  "Password must be 8-64 characters long and include uppercase, lowercase, number, and special character, with no spaces.";

export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{8,64}$/;

export const getPasswordValidationError = (password) => {
  const value = String(password ?? "");

  if (!value) {
    return "Password is required.";
  }

  if (!PASSWORD_REGEX.test(value)) {
    return PASSWORD_REQUIREMENTS_MESSAGE;
  }

  return null;
};
