export type ContactInfo = {
  id?: string;
  name?: string;
  organization?: string;
  street?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  country?: string;
  phone?: string;
  phone_ext?: string;
  fax?: string;
  fax_ext?: string;
  email?: string;
};

export type WhoisSuccessResult = {
  success: true;
  domain: {
    id: string;
    domain: string;
    punycode: string;
    name: string;
    extension: string;
    whois_server?: string;
    status?: string[];
    name_servers: string[];
    created_date?: string;
    created_date_in_time?: string;
    updated_date?: string;
    updated_date_in_time?: string;
    expiration_date?: string;
    expiration_date_in_time?: string;
  };
  registrar?: {
    id?: string;
    name?: string;
    phone?: string;
    email?: string;
    referral_url?: string;
  };
  registrant?: ContactInfo;
  administrative?: ContactInfo;
  technical?: ContactInfo;
  billing?: ContactInfo;
};

export type WhoisErrorResult = { success: false; error: string };

export type WhoisResult = WhoisSuccessResult | WhoisErrorResult;
