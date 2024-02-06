import type { Workspace } from '@toeverything/infra';
import { useService } from '@toeverything/infra/di';
import { useDebouncedState } from 'foxact/use-debounced-state';
import { useEffect, useMemo } from 'react';

import { WorkspacePropertiesAdapter } from '../modules/workspace/properties';
import { useBlockSuitePageMeta } from './use-block-suite-page-meta';

function getProxy<T extends object>(obj: T) {
  return new Proxy(obj, {});
}

const useReactiveAdapter = (adapter: WorkspacePropertiesAdapter) => {
  // hack: delay proxy creation to avoid unnecessary re-render + render in another component issue
  const [proxy, setProxy] = useDebouncedState(adapter, 0);
  // fixme: this is a hack to force re-render when default meta changed
  useBlockSuitePageMeta(adapter.workspace.blockSuiteWorkspace);
  useEffect(() => {
    // todo: track which properties are used and then filter by property path change
    // using Y.YEvent.path
    function observe() {
      setProxy(getProxy(adapter));
    }
    adapter.properties.observeDeep(observe);
    return () => {
      adapter.properties.unobserveDeep(observe);
    };
  }, [adapter, setProxy]);

  return proxy;
};

export function useCurrentWorkspacePropertiesAdapter() {
  const adapter = useService(WorkspacePropertiesAdapter);
  return useReactiveAdapter(adapter);
}

export function useWorkspacePropertiesAdapter(workspace: Workspace) {
  const adapter = useMemo(
    () => new WorkspacePropertiesAdapter(workspace),
    [workspace]
  );
  return useReactiveAdapter(adapter);
}
