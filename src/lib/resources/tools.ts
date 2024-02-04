import { MailIcon, MapPinIcon, PhoneIncomingIcon } from 'lucide-react';

import { GlobeIcon } from '@/components/icons/globe';
import { MobilePhoneWithArrowIcon } from '@/components/icons/mobile-phone-with-arrow';

export const TOOLS = [
  {
    icon: GlobeIcon,
    name: 'DNS Lookup',
    slug: 'dns',
    description:
      "Discover a domain's DNS records, including IP address, name servers, A records, and more."
  },
  {
    icon: MobilePhoneWithArrowIcon,
    name: 'WHOIS Lookup',
    slug: 'whois',
    description:
      'Look up information on domain owners, registration dates, nameservers, and more.'
  },
  {
    icon: MapPinIcon,
    name: 'IP Address Lookup',
    slug: 'ip',
    description: 'Coming soon!'
  },
  {
    icon: MailIcon,
    name: 'Email Address Lookup',
    slug: 'email',
    description: 'Coming soon!'
  },
  {
    icon: PhoneIncomingIcon,
    name: 'Phone Number Lookup',
    slug: 'phone-number',
    description: 'Coming soon!'
  }
] as const;

export type Tool = (typeof TOOLS)[number];
