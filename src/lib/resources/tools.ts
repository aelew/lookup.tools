import { EmailIcon } from '@/components/icons/email';
import { GlobeIcon } from '@/components/icons/globe';
import { MobilePhoneWithArrowIcon } from '@/components/icons/mobile-phone-with-arrow';
import { PushpinIcon } from '@/components/icons/pushpin';
import { TelephoneIcon } from '@/components/icons/telephone';

export const TOOLS = [
  {
    icon: GlobeIcon,
    name: 'DNS Lookup',
    slug: 'dns',
    description:
      "Discover a domain's DNS records, including IP address, name servers, and MX records."
  },
  {
    icon: MobilePhoneWithArrowIcon,
    name: 'WHOIS Lookup',
    slug: 'whois',
    description:
      'Look up information on domain owners, registration dates, nameservers, and more.'
  },
  {
    icon: PushpinIcon,
    name: 'IP Address Lookup',
    slug: 'ip',
    description:
      'Find information about an IP address including the type, ISP, city, and country.'
  },
  {
    icon: EmailIcon,
    name: 'Email Address Lookup',
    slug: 'email',
    description: 'Coming soon!'
  },
  {
    icon: TelephoneIcon,
    name: 'Phone Number Lookup',
    slug: 'phone-number',
    description: 'Coming soon!'
  }
] as const;

export type Tool = (typeof TOOLS)[number];
