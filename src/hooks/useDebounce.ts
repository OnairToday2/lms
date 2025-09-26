import { useState, useEffect } from "react";

const useDebounce = (value: any, delay = 3000) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
      clearTimeout(timeoutId);
    }, delay);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
