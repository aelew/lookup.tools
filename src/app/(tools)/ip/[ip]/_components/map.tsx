'use client';

import { Marker, Map as PigeonMap } from 'pigeon-maps';

import type { IPResult } from '@/lib/ip';

interface MapProps {
  location: IPResult['location'];
}

export function Map({ location }: MapProps) {
  const position: [number, number] = location
    ? [location.latitude, location.longitude]
    : [0, 0];
  return (
    <PigeonMap defaultCenter={position} defaultZoom={10}>
      <Marker width={48} anchor={position} />
    </PigeonMap>
  );
}
