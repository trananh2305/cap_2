import { Middleware } from "@reduxjs/toolkit";
import { logout } from "./slices/authSlice";
import { persistor } from "./store";

export const logOutMiddleware: Middleware = () => (next) => (action) => {
  // Type assertion for action as it is passed into the function
  if ((action as { type: string }).type === logout.type) {
    persistor.purge();
  }
  return next(action);
};
