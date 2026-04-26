export const PASSWORD_REQUIREMENTS =
  "Use 8-64 characters with uppercase, lowercase, number, and special character. Spaces are not allowed.";

export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{8,64}$/;

export const getPasswordValidationMessage = (password) => {
  const value = String(password ?? "");

  if (!value) {
    return "Password is required.";
  }

  if (!PASSWORD_REGEX.test(value)) {
    return "Password must be 8-64 characters long and include uppercase, lowercase, number, and special character, with no spaces.";
  }

  return "";
};

export const validatePassword = (password) => {
  const message = getPasswordValidationMessage(password);

  return {
    valid: !message,
    message,
  };
};
