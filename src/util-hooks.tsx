import { useRef, useCallback, useEffect } from "react";

export function useMountedState() {
  const ref = useRef(false);
  const isMounted = useCallback(() => ref.current, []);
  useEffect(() => {
    ref.current = true;
    return () => {
      ref.current = false;
    };
  }, []);
  return isMounted;
}
