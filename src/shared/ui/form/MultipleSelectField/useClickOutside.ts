"use client";
import { RefObject } from "react";
import { useEffect } from "react";

const useClickOutSide = (ref: RefObject<HTMLElement | null>, cb?: Function) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleClickOutSide = (e: MouseEvent) => {
      if (!element.contains(e.target as Node)) {
        cb && cb();
      }
    };
    window.addEventListener("click", handleClickOutSide);

    return () => {
      window.removeEventListener("click", handleClickOutSide);
    };
  }, [ref]);
};
export default useClickOutSide;
