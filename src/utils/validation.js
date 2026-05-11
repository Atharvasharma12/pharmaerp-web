// src/utils/validation.js

export const isValidEmail = (email = "") => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidPassword = (password = "") => {
  return password.length >= 6 && password.length <= 128;
};

export const isValidPhone = (phone = "") => {
  return /^[6-9][0-9]{9}$/.test(phone);
};

export const validateLoginForm = ({ email, password }) => {
  const errors = {};

  if (!email?.trim()) {
    errors.email = "Email is required";
  } else if (!isValidEmail(email)) {
    errors.email = "Invalid email address";
  }

  if (!password) {
    errors.password = "Password is required";
  }

  return errors;
};

export const validateRegisterForm = ({ email, password, fullName, phone }) => {
  const errors = {};

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
