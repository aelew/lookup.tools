'use client';

import { useEffect, useState } from 'react';

type Dimensions = { width: number; height: number };
type Device = 'mobile' | 'tablet' | 'desktop';

export default function useMediaQuery() {
  const [dimensions, setDimensions] = useState<Dimensions>();
  const [device, setDevice] = useState<Device>();

  useEffect(() => {
    const checkDevice = () => {
      if (window.matchMedia('(max-width: 640px)').matches) {
        setDevice('mobile');
      } else if (
        window.matchMedia('(min-width: 641px) and (max-width: 1024px)').matches
      ) {
        setDevice('tablet');
      } else {
        setDevice('desktop');
      }
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    checkDevice();

    window.addEventListener('resize', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  return {
    device,
    width: dimensions?.width,
    height: dimensions?.height,
    isMobile: device === 'mobile',
    isTablet: device === 'tablet',
    isDesktop: device === 'desktop'
  };
}
