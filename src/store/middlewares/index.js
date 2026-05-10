// src/store/middlewares/index.js

export const loggerMiddleware = (store) => (next) => (action) => {
  if (import.meta.env.DEV) {
    console.log("dispatching", action);
  }

  return next(action);
};

export const middlewares = [loggerMiddleware];
