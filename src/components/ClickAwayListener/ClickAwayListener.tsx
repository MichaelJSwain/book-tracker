import { useEffect, useRef } from "react";
import type { ClickAwayListenerProps } from "../../types";

export const ClickAwayListener: React.FC<ClickAwayListenerProps> = ({ children, onClickAway }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Handle click away
    const handleClickAway = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        console.log(event.target);
        onClickAway();
      }
    };

    document.addEventListener('mousedown', handleClickAway);
    return () => {
      document.removeEventListener('mousedown', handleClickAway);
    };
  }, [onClickAway]);

  return <div ref={containerRef}>{children}</div>;
};
