'use client';

import { Marker, Map as PigeonMap } from 'pigeon-maps';

import type { IPSuccessResult } from '@/lib/ip';

interface MapProps {
  location: IPSuccessResult['location'];
}

export function Map({ location }: MapProps) {
  const position: [number, number] = [location.latitude, location.longitude];
  return (
    <PigeonMap defaultCenter={position} defaultZoom={10}>
      <Marker width={48} anchor={position} />
    </PigeonMap>
  );
}
