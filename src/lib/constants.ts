import type { MotionProps } from 'framer-motion';

export const EASE_TRANSITION = {
  transition: { ease: [0.6, 0.05, 0, 0.75], duration: 0.5 },
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 }
} satisfies MotionProps;

export const EPP_STATUS_CODES = [
  'addPeriod',
  'autoRenewPeriod',
  'inactive',
  'ok',
  'pendingCreate',
  'pendingDelete',
  'pendingRenew',
  'pendingRestore',
  'pendingTransfer',
  'pendingUpdate',
  'redemptionPeriod',
  'renewPeriod',
  'serverDeleteProhibited',
  'serverHold',
  'serverRenewProhibited',
  'serverTransferProhibited',
  'serverUpdateProhibited',
  'transferPeriod',
  'clientDeleteProhibited',
  'clientHold',
  'clientRenewProhibited',
  'clientTransferProhibited',
  'clientUpdateProhibited'
];
