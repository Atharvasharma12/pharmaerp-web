// src/hooks/useIsMobile.js

import useBreakpoint from "./useBreakpoint";

const useIsMobile = () => {
  const { isMobile } = useBreakpoint();

  return isMobile;
};

export default useIsMobile;
