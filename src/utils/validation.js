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

export const validateLoginForm = ({ email, password, identifier }) => {
  const errors = {};
  const inputVal = (identifier || email || "").trim();

  if (!inputVal) {
    errors.email = "Email or 10-digit mobile number is required";
  } else if (!isValidEmail(inputVal) && !isValidPhone(inputVal)) {
    errors.email = "Enter a valid email address or 10-digit mobile number";
  }

  if (!password) {
    errors.password = "Password is required";
  }

  return errors;
};

export const validateRegisterForm = ({ email, password, fullName, phone, workspaceName }) => {
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

  if (!workspaceName?.trim() || workspaceName.trim().length < 2 || workspaceName.trim().length > 100) {
    errors.workspaceName = "Workspace name must be between 2 and 100 characters";
  }

  return errors;
};
