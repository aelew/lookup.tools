'use client';

import { Marker, Map as PigeonMap } from 'pigeon-maps';

interface MapProps {
  location: {
    latitude: number;
    longitude: number;
  };
}

export function Map({ location }: MapProps) {
  const position: [number, number] = [location.latitude, location.longitude];

  return (
    <PigeonMap
      boxClassname="dark:brightness-95"
      defaultCenter={position}
      defaultZoom={10}
    >
      <Marker width={48} anchor={position} />
    </PigeonMap>
  );
}
