import {
  Si1password,
  SiAdobe,
  SiAirtable,
  SiAkamai,
  SiAmazonaws,
  SiApple,
  SiAtlassian,
  SiBox,
  SiBrave,
  SiBrevo,
  SiCalendly,
  SiCanva,
  SiDocker,
  SiDocusign,
  SiDropbox,
  SiFacebook,
  SiFastly,
  SiFirebase,
  SiGhost,
  SiGitbook,
  SiHackerone,
  SiHaveibeenpwned,
  SiHetzner,
  SiHubspot,
  SiIcloud,
  SiImprovmx,
  SiKeybase,
  SiLinear,
  SiLogmein,
  SiLoom,
  SiMailgun,
  SiMicrosoft,
  SiMicrosoftazure,
  SiMicrosoftoutlook,
  SiMiro,
  SiMixpanel,
  SiMongodb,
  SiNamecheap,
  SiNetlify,
  SiNotion,
  SiOpenai,
  SiOvh,
  SiPaddle,
  SiPostman,
  SiProtonmail,
  SiSimplelogin,
  SiSlack,
  SiSparkpost,
  SiStripe,
  SiTutanota,
  SiTwilio,
  SiTwitter,
  SiVercel,
  SiWix,
  SiWordpress,
  SiX,
  SiZendesk,
  SiZoho,
  SiZoom
} from '@icons-pack/react-simple-icons';

import { CloudflareIcon } from '@/components/icons/cloudflare';
import { GoogleIcon } from '@/components/icons/google';
import { SkiffIcon } from '@/components/icons/skiff';

export const SERVICES = [
  {
    icon: GoogleIcon,
    matches: [
      '.google.com',
      '.googlemail.com',
      '.googlehosted.com',
      '.googledomains.com',
      'google-site-verification='
    ]
  },
  {
    icon: CloudflareIcon,
    matches: ['.cloudflare.com', '.cloudflare.net', '.pacloudflare.com']
  },
  {
    icon: SiFirebase,
    matches: ['.firebasemail.com', 'firebase=']
  },
  {
    icon: SiAkamai,
    matches: ['akadns.net', '.edgesuite.net']
  },
  {
    icon: SiAmazonaws,
    matches: ['.amazon.com', '.awsdns-', '.amazonaws.com', '.cloudfront.net']
  },
  {
    icon: SiWix,
    matches: ['.wix.com', '.wixdns.net']
  },
  {
    icon: SiNamecheap,
    matches: ['.registrar-servers.com']
  },
  {
    icon: SiAmazonaws,
    matches: ['amazonses:']
  },
  {
    icon: SiBrevo,
    matches: ['brevo-code:', 'sendinblue-code:']
  },
  {
    icon: SiHetzner,
    matches: ['.hetzner.com']
  },
  {
    icon: SiFastly,
    matches: ['.fastly.net']
  },
  {
    icon: SiVercel,
    matches: ['vercel-dns.com', '76.76.21.']
  },
  {
    icon: SiZoom,
    matches: ['.zoom.us', 'zoom_verify_']
  },
  {
    icon: SiWordpress,
    matches: ['.wpenginepowered.com']
  },
  {
    icon: SiBox,
    matches: ['box-domain-verification=']
  },
  {
    icon: SiLogmein,
    matches: ['logmein-verification-code=']
  },
  {
    icon: SiBrave,
    matches: ['brave-ledger-verification=']
  },
  {
    icon: Si1password,
    matches: ['1password-site-verification=']
  },
  {
    icon: SiDropbox,
    matches: ['dropbox-domain-verification=']
  },
  {
    icon: SiMongodb,
    matches: ['mongodb-site-verification=']
  },
  {
    icon: SiKeybase,
    matches: ['keybase-site-verification=']
  },
  {
    icon: SiStripe,
    matches: ['stripe-verification=']
  },
  {
    icon: SiLoom,
    matches: ['loom-verification=', 'loom-site-verification=']
  },
  {
    icon: SiMiro,
    matches: ['miro-verification=']
  },
  {
    icon: SiCanva,
    matches: ['canva-site-verification=']
  },
  {
    icon: SiAdobe,
    matches: ['.mktoweb.com', 'adobe-idp-site-verification=']
  },
  {
    icon: SiNotion,
    matches: ['notion_verify_', 'notion-domain-verification=']
  },
  {
    icon: SiLinear,
    matches: ['linear-domain-verification=']
  },
  {
    icon: SiAirtable,
    matches: ['airtable-verification=']
  },
  {
    icon: SiDocker,
    matches: ['docker-verification=']
  },
  {
    icon: SiTwilio,
    matches: ['twilio-domain-verification=']
  },
  {
    icon: SiCalendly,
    matches: ['calendly-site-verification=']
  },
  {
    icon: SiPaddle,
    matches: ['paddle-verification=']
  },
  {
    icon: SiPostman,
    matches: ['postman-domain-verification=']
  },
  {
    icon: SiSlack,
    matches: ['slack-domain-verification=']
  },
  {
    icon: SiSparkpost,
    matches: ['sparkpostmail.com']
  },
  {
    icon: SiGhost,
    matches: ['.ghost.io']
  },
  {
    icon: SiGitbook,
    matches: ['.gitbook.io']
  },
  {
    icon: SiMailgun,
    matches: ['mailgun.org', 'mgverify=']
  },
  {
    icon: SiDocusign,
    matches: ['docusign=']
  },
  {
    icon: SiMicrosoftazure,
    matches: [
      '.azure-dns.',
      '.azureedge.net',
      '.azurewebsites.net',
      '.azure-dns.com'
    ]
  },
  {
    icon: SiTutanota,
    matches: ['.tutanota.de', 't-verify=']
  },
  {
    icon: SiProtonmail,
    matches: ['.protonmail.ch', 'protonmail-verification=']
  },
  {
    icon: SiSimplelogin,
    matches: ['simplelogin.co', 'sl-verification=']
  },
  {
    icon: SiZoho,
    matches: ['zoho.']
  },
  {
    icon: SiZendesk,
    matches: ['.zendesk.com']
  },
  {
    icon: SiNetlify,
    matches: ['.netlify.com', '.netlify.app']
  },
  {
    icon: SiIcloud,
    matches: ['.icloud.com', ':icloud.com']
  },
  {
    icon: SiMicrosoft,
    matches: ['.microsoft.com']
  },
  {
    icon: SiMicrosoftoutlook,
    matches: ['.outlook.com']
  },
  {
    icon: SiTwitter,
    matches: ['.twitter.com', '.twtrdns.net']
  },
  {
    icon: SkiffIcon,
    matches: ['.skiff.com']
  },
  {
    icon: SiImprovmx,
    matches: ['.improvmx.com']
  },
  {
    icon: SiOvh,
    matches: ['.ovh.net']
  },
  {
    icon: SiX,
    matches: ['.x.com']
  },
  {
    icon: SiApple,
    matches: ['.apple.com', 'apple-domain=', 'apple-domain-verification=']
  },
  {
    icon: SiFacebook,
    matches: ['facebook-domain-verification=']
  },
  {
    icon: SiOpenai,
    matches: ['.openai.com', 'openai-domain-verification=']
  },
  {
    icon: SiMixpanel,
    matches: ['mixpanel-domain-verify=']
  },
  {
    icon: SiHubspot,
    matches: ['hubspot-domain-verification=', 'hubspot-developer-verification=']
  },
  {
    icon: SiAtlassian,
    matches: [
      'atlassian-domain-verification=',
      'atlassian-sending-domain-verification='
    ]
  },
  {
    icon: SiHackerone,
    matches: ['h1-domain-verification=']
  },
  {
    icon: SiHaveibeenpwned,
    matches: ['have-i-been-pwned-verification=']
  }
];
