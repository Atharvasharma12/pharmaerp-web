// src/utils/validation.js

export const isValidEmail = (email = "") => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidPassword = (password = "") => {
  return password.length >= 6 && password.length <= 128;
};

export const isValidUsername = (username = "") => {
  return /^[a-z0-9._-]{3,40}$/.test(username);
};

export const isValidPhone = (phone = "") => {
  return /^[6-9][0-9]{9}$/.test(phone);
};

export const validateLoginForm = ({ identifier, password }) => {
  const errors = {};

  if (!identifier?.trim()) {
    errors.identifier = "Email or username is required";
  }

  if (!password) {
    errors.password = "Password is required";
  }

  return errors;
};

export const validateRegisterForm = ({
  username,
  email,
  password,
  fullName,
  phone,
}) => {
  const errors = {};

  if (!isValidUsername(username)) {
    errors.username =
      "Username must be 3-40 characters and contain only letters, numbers, dot, underscore and hyphen";
  }

  if (!isValidEmail(email)) {
    errors.email = "Invalid email address";
  }

  if (!isValidPassword(password)) {
    errors.password = "Password must be between 6 and 128 characters";
  }

  if (!fullName?.trim() || fullName.trim().length < 3) {
    errors.fullName = "Full name must be at least 3 characters";
  }

  if (phone && !isValidPhone(phone)) {
    errors.phone = "Invalid phone number";
  }

  return errors;
};
