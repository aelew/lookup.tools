interface ASN {
  asn: string;
  name: string;
  domain: string;
  route: string;
  type: string;
}

interface Carrier {
  name: string;
  mcc: string;
  mnc: string;
}

interface Language {
  name: string;
  native: string;
  code: string;
}

interface Currency {
  name: string;
  code: string;
  symbol: string;
  native: string;
  plural: string;
}

interface TimeZone {
  name: string;
  abbr: string;
  offset: string;
  is_dst: boolean;
  current_time: string;
}

interface Blocklist {
  name: string;
  site: string;
  type: string;
}

interface Threat {
  is_tor: boolean;
  is_icloud_relay: boolean;
  is_proxy: boolean;
  is_datacenter: boolean;
  is_anonymous: boolean;
  is_known_attacker: boolean;
  is_known_abuser: boolean;
  is_threat: boolean;
  is_bogon: boolean;
  blocklists: Array<Blocklist>;
}

export interface IPAddressLookupResponse {
  q: string;
  data: {
    is_eu?: boolean;

    // Location
    city?: string;
    region?: string;
    region_code?: string;
    region_type?: string;
    country_name?: string;
    country_code?: string;
    continent_name?: string;
    continent_code?: string;
    latitude?: number;
    longitude?: number;
    postal?: string;

    // Contact
    calling_code?: string;

    // Display
    flag?: string;
    emoji_flag?: string;
    emoji_unicode?: string;

    // Network
    asn: ASN;
    carrier?: Carrier;

    // Localization
    languages?: Array<Language>;
    currency: Partial<Currency>;
    time_zone: Partial<TimeZone>;

    // Security
    threat?: Threat;
  };
}
