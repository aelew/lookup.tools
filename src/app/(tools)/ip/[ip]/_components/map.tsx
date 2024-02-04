'use client';

import type { CityResponse } from 'maxmind';
import { Marker, Map as PigeonMap } from 'pigeon-maps';

interface MapProps {
  location: CityResponse['location'];
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
