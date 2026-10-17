import { useEffect, useState } from 'react';

/**
 * Hook to track real mobile visual viewport dimensions.
 * Fixes mobile browser bars covering content by setting CSS custom properties
 * and notifying React when the visible area changes.
 */
export function useVisualViewport() {
  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? (window.visualViewport?.width || window.innerWidth) : 800,
    height: typeof window !== 'undefined' ? (window.visualViewport?.height || window.innerHeight) : 600,
  });

  useEffect(() => {
    const update = () => {
      const vv = window.visualViewport;
      const height = vv ? Math.round(vv.height) : window.innerHeight;
      const width = vv ? Math.round(vv.width) : window.innerWidth;

      document.documentElement.style.setProperty('--app-height', `${height}px`);
      document.documentElement.style.setProperty('--app-width', `${width}px`);

      setViewport({ width, height });
    };

    update();

    const vv = window.visualViewport;
    if (vv) {
      vv.addEventListener('resize', update);
      vv.addEventListener('scroll', update);
    }
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);

    return () => {
      if (vv) {
        vv.removeEventListener('resize', update);
        vv.removeEventListener('scroll', update);
      }
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  return viewport;
}
