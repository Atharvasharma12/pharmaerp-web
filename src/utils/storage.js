// src/utils/storage.js

export const storage = {
  get(key) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore storage errors
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore storage errors
    }
  },

  clear() {
    try {
      localStorage.clear();
    } catch {
      // ignore storage errors
    }
  },
};
