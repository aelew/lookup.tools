export type CertificateInfo = {
  issuer_ca_id: number;
  issuer_name: string;
  common_name: string;
  name_value: string;
  id: number;
  entry_timestamp: string;
  not_before: string;
  not_after: string;
  serial_number: string;
  result_count: number;
};

export type PingResult =
  | { success: true; input: string; ip: string | null; alive: boolean }
  | { success: false; error: string };
