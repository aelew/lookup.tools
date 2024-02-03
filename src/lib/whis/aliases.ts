import type { ModifierFn } from './parser';

const dateModifier: ModifierFn = (input) =>
  isNaN(+new Date(input)) ? input : new Date(input);

const lowerCaseModifier: ModifierFn = (input) => input.toLowerCase();

export const aliasKeys: {
  from: string[];
  to: string;
  modifier?: ModifierFn;
}[] = [
  {
    from: ['domain name', 'domain'],
    to: 'domain',
    modifier: lowerCaseModifier
  },
  {
    from: [
      'expiry date',
      'registry expiry date',
      'domain expires',
      'expiration time'
    ],
    to: 'expiration',
    modifier: dateModifier
  },
  {
    from: [
      'created',
      'creation date',
      'domain record activated',
      'registered on',
      'registration time'
    ],
    to: 'created',
    modifier: dateModifier
  },
  {
    from: [
      'updated date',
      'last-update',
      'domain record last updated',
      'last updated'
    ],
    to: 'updated',
    modifier: dateModifier
  },
  {
    from: ['status', 'domain status', 'registration status'],
    to: 'status'
  },
  {
    from: ['registrar', 'sponsoring registrar'],
    to: 'registrar'
  },
  {
    from: ['registry domain id'],
    to: 'registryDomainId'
  },
  {
    from: ['registrar whois server'],
    to: 'registrarWhoisServer'
  },
  {
    from: ['registrar url', 'registrar url:'],
    to: 'registrarUrl'
  },
  {
    from: ['registry registrant id'],
    to: 'registryRegistrantId'
  },
  {
    from: ['registry registrant id'],
    to: 'registryRegistrantId'
  },
  {
    from: ['registrar iana id'],
    to: 'registrarIanaId'
  },
  {
    from: ['registrar abuse contact email', 'registrar abuse contact email:'],
    to: 'registrarAbuseContactEmail'
  },
  {
    from: ['registrar abuse contact phone', 'registrar abuse contact phone:'],
    to: 'registrarAbuseContactPhone'
  },
  {
    from: ['name server', 'nserver', 'name servers'],
    to: 'nameservers',
    modifier: lowerCaseModifier
  },
  {
    from: ['dnssec'],
    to: 'dnssec'
  },
  {
    from: ['notice', 'terms of use', 'to'],
    to: 'notice'
  },
  {
    from: ['registrant name', 'registrant'],
    to: 'registrantName'
  },
  {
    from: ['registrant organization'],
    to: 'registrantOrganization'
  },
  {
    from: ['registrant street'],
    to: 'registrantStreet'
  },
  {
    from: ['registrant city'],
    to: 'registrantCity'
  },
  {
    from: ['registrant state/province'],
    to: 'registrantStateProvince'
  },
  {
    from: ['registrant postal code'],
    to: 'registrantPostalCode'
  },
  {
    from: ['registrant country'],
    to: 'registrantCountry'
  },
  {
    from: ['registrant phone'],
    to: 'registrantPhone'
  },
  {
    from: ['registrant phone ext'],
    to: 'registrantPhoneExt'
  },
  {
    from: ['registrant fax'],
    to: 'registrantFax'
  },
  {
    from: ['registrant fax ext'],
    to: 'registrantFaxExt'
  },
  {
    from: ['registrant email', 'registrant contact email'],
    to: 'registrantEmail'
  },
  {
    from: ['registry admin id'],
    to: 'registryAdminId'
  },
  {
    from: ['admin name', 'admin contact', 'administrative contact'],
    to: 'adminName'
  },
  {
    from: ['admin organization'],
    to: 'adminOrganization'
  },
  {
    from: ['admin street'],
    to: 'adminStreet'
  },
  {
    from: ['admin city'],
    to: 'adminCity'
  },
  {
    from: ['admin state/province'],
    to: 'adminStateProvince'
  },
  {
    from: ['admin postal code'],
    to: 'adminPostalCode'
  },
  {
    from: ['admin country'],
    to: 'adminCountry'
  },
  {
    from: ['admin phone'],
    to: 'adminPhone'
  },
  {
    from: ['admin phone ext'],
    to: 'adminPhoneExt'
  },
  {
    from: ['admin fax'],
    to: 'adminFax'
  },
  {
    from: ['admin fax ext'],
    to: 'adminFaxExt'
  },
  {
    from: ['admin email'],
    to: 'adminEmail'
  },
  {
    from: ['registry tech id'],
    to: 'registryTechId'
  },
  {
    from: ['tech name', 'technical contact'],
    to: 'techName'
  },
  {
    from: ['tech organization'],
    to: 'techOrganization'
  },
  {
    from: ['tech street'],
    to: 'techStreet'
  },
  {
    from: ['tech city'],
    to: 'techCity'
  },
  {
    from: ['tech state/province'],
    to: 'techStateProvince'
  },
  {
    from: ['tech postal code'],
    to: 'techPostalCode'
  },
  {
    from: ['tech country'],
    to: 'techCountry'
  },
  {
    from: ['tech phone'],
    to: 'techPhone'
  },
  {
    from: ['tech phone ext'],
    to: 'techPhoneExt'
  },
  {
    from: ['tech fax'],
    to: 'techFax'
  },
  {
    from: ['tech fax ext'],
    to: 'techFaxExt'
  },
  {
    from: ['tech email'],
    to: 'techEmail'
  },
  {
    from: ['registry security id'],
    to: 'registrySecurityId'
  },
  {
    from: ['security name'],
    to: 'securityName'
  },
  {
    from: ['security organization'],
    to: 'securityOrganization'
  },
  {
    from: ['security street'],
    to: 'securityStreet'
  },
  {
    from: ['security city'],
    to: 'securityCity'
  },
  {
    from: ['security state/province'],
    to: 'securityStateProvince'
  },
  {
    from: ['security postal code'],
    to: 'securityPostalCode'
  },
  {
    from: ['security country'],
    to: 'securityCountry'
  },
  {
    from: ['security phone'],
    to: 'securityPhone'
  },
  {
    from: ['security email'],
    to: 'securityEmail'
  },
  {
    from: ['billing name'],
    to: 'billingName'
  },
  {
    from: ['billing organization'],
    to: 'billingOrganization'
  },
  {
    from: ['billing street'],
    to: 'billingStreet'
  },
  {
    from: ['billing city'],
    to: 'billingCity'
  },
  {
    from: ['billing state/province'],
    to: 'billingStateProvince'
  },
  {
    from: ['billing postal code'],
    to: 'billingPostalCode'
  },
  {
    from: ['billing country'],
    to: 'billingCountry'
  },
  {
    from: ['billing phone'],
    to: 'billingPhone'
  },
  {
    from: ['billing email'],
    to: 'billingEmail'
  }
];
