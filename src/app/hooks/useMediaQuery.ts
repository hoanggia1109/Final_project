'use client';

import { useState, useEffect } from 'react';

/**
 * Custom hook để detect screen size
 * @param query - Media query string (ví dụ: '(max-width: 768px)')
 * @returns boolean - true nếu match query
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Kiểm tra nếu đang ở client side
    if (typeof window === 'undefined') return;

    const media = window.matchMedia(query);
    
    // Set initial value
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    // Listener để update khi thay đổi
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Modern browsers
    if (media.addEventListener) {
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    } else {
      // Fallback cho older browsers
      media.addListener(listener);
      return () => media.removeListener(listener);
    }
  }, [matches, query]);

  return matches;
}

/**
 * Hook để detect mobile (≤768px)
 */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 768px)');
}

/**
 * Hook để detect tablet (769px - 991px)
 */
export function useIsTablet(): boolean {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isDesktop = useMediaQuery('(min-width: 992px)');
  return !isMobile && !isDesktop;
}

/**
 * Hook để detect desktop (≥992px)
 */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 992px)');
}

/**
 * Hook để lấy window size
 */
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Set initial size
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

