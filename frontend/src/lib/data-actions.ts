'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { TOOL_METADATA, type ToolKey, type ToolMetadataEntries } from './meta';
import type { QueryType } from './schema';

export type DataActionType = QueryType | 'text';

export type DataAction =
  | {
      kind: 'copy';
      label: 'Copy';
      value: string;
    }
  | {
      kind: 'open';
      label: 'Open';
      url: string;
      value: string;
    }
  | {
      kind: 'lookup';
      label: 'Lookup';
      query: string;
      tool: ToolKey;
      value: string;
    };

type ExecutableDataAction = Exclude<DataAction, { kind: 'lookup' }>;

export interface DataActionEffects {
  copy: (value: string) => Promise<void> | void;
  open: (url: string) => void;
}

interface CreateDataActionPlanOptions {
  effects: DataActionEffects;
  type: DataActionType;
  value: string;
}

function getOpenUrl(type: DataActionType, value: string) {
  if (type === 'domain') {
    return value.startsWith('http') ? value : `https://${value}`;
  }

  if (type === 'ip') {
    if (value.startsWith('http')) {
      return value;
    }

    return value.includes(':') ? `http://[${value}]` : `http://${value}`;
  }
}

function getLookupTool(type: DataActionType) {
  return (Object.entries(TOOL_METADATA) as ToolMetadataEntries).find(
    ([, tool]) => tool.queryType === type
  )?.[0];
}

export function createDataActionPlan({
  effects,
  type,
  value
}: CreateDataActionPlanOptions) {
  const actions: Array<DataAction> = [{ kind: 'copy', label: 'Copy', value }];
  const openUrl = getOpenUrl(type, value);
  const lookupTool = getLookupTool(type);

  if (openUrl) {
    actions.push({ kind: 'open', label: 'Open', url: openUrl, value });
  }

  if (lookupTool) {
    actions.push({
      kind: 'lookup',
      label: 'Lookup',
      query: value,
      tool: lookupTool,
      value
    });
  }

  return {
    actions,
    async perform(action: ExecutableDataAction) {
      if (action.kind === 'copy') {
        await effects.copy(action.value);
        return;
      }

      effects.open(action.url);
    }
  };
}

export function useDataActions(
  type: DataActionType,
  value: string,
  timeoutDuration = 1500
) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const resetTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(
    () => () => {
      if (resetTimeout.current) {
        clearTimeout(resetTimeout.current);
      }
    },
    []
  );

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setStatus('copied');

        if (resetTimeout.current) {
          clearTimeout(resetTimeout.current);
        }

        resetTimeout.current = setTimeout(
          () => setStatus('idle'),
          timeoutDuration
        );
      } catch {
        setStatus('error');
      }
    },
    [timeoutDuration]
  );

  const plan = createDataActionPlan({
    effects: {
      copy,
      open: (url) => window.open(url, '_blank', 'noopener,noreferrer')
    },
    type,
    value
  });

  const statusMessage =
    status === 'copied'
      ? `Copied ${value}`
      : status === 'error'
        ? `Couldn't copy ${value}`
        : '';

  return { ...plan, status, statusMessage };
}
