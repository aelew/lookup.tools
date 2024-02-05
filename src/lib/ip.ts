import ky from 'ky';

export type IPResult = {
  ip: string;
  rir: string;
  is_bogon: boolean;
  is_mobile: boolean;
  is_crawler: boolean;
  is_datacenter: boolean;
  is_tor: boolean;
  is_proxy: boolean;
  is_vpn: boolean;
  is_abuser: boolean;
  company: {
    name: string;
    abuser_score: string;
    domain?: string;
    type: string;
    network: string;
  };
  datacenter?: {
    datacenter: string;
    network: string;
    region: string;
    service: string;
    network_border_group: string;
  };
  asn?: {
    asn: number;
    abuser_score: string;
    route: string;
    descr: string;
    country: string;
    active: boolean;
    org: string;
    domain?: string;
    abuse: string;
    type: string;
    created: string;
    updated: string;
    rir: string;
    whois: string;
  };
  location: {
    continent: string;
    country: string;
    country_code: string;
    state: string;
    city: string;
    latitude: number;
    longitude: number;
    zip: string;
    timezone: string;
    local_time: string;
    local_time_unix: number;
    is_dst: boolean;
  };
};

export async function getIPData(query: string) {
  let result;
  try {
    result = await ky
      .get(`https://api.incolumitas.com/?q=${encodeURIComponent(query)}`)
      .json<IPResult | { error: string }>();
    if ('error' in result) {
      result = null;
    }
  } catch (err) {
    result = null;
  }
  return result;
}
