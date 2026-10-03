import { ReduxProvider } from "./ReduxProvider";
import { ThemeProvider } from "./ThemeProvider";
import { ToastProvider } from "./ToastProvider";

export const AppProvider = ({ children }) => {
  return (
    <ThemeProvider>
      <ReduxProvider>
        <ToastProvider>{children}</ToastProvider>
      </ReduxProvider>
    </ThemeProvider>
  );
};
