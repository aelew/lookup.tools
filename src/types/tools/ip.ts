export type IPSuccessResult = {
  success: true;
  ip: string;
  hostname: string;
  asn: {
    asn: string;
    name: string;
    domain: string;
    route: string;
    type: string;
  };
  abuse: {
    address: string;
    country: string;
    email: string;
    name: string;
    network: string;
    phone: string | null;
  };
  company: {
    name: string;
    domain: string;
    type: string;
  };
  organization: string;
  service: string | null;
  location: {
    city: string;
    region: string;
    postal: string;
    country: string;
    timezone: string;
    latitude: number;
    longitude: number;
  };
  properties: {
    tor: boolean;
    vpn: boolean;
    bogon: boolean;
    relay: boolean;
    proxy: boolean;
    hosting: boolean;
  };
};

export type IPErrorResult = { success: false; error: string };

export type IPResult = IPSuccessResult | IPErrorResult;
