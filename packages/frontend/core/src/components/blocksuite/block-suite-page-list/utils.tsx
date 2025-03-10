import { toast } from '@affine/component';
import { useAsyncCallback } from '@affine/core/hooks/affine-async-hooks';
import { usePageMetaHelper } from '@affine/core/hooks/use-block-suite-page-meta';
import { useBlockSuiteWorkspaceHelper } from '@affine/core/hooks/use-block-suite-workspace-helper';
import { WorkspaceSubPath } from '@affine/core/shared';
import { initEmptyPage } from '@toeverything/infra/blocksuite';
import { useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useMemo } from 'react';

import { pageSettingsAtom, setPageModeAtom } from '../../../atoms';
import { useNavigateHelper } from '../../../hooks/use-navigate-helper';
import type { BlockSuiteWorkspace } from '../../../shared';

export const usePageHelper = (blockSuiteWorkspace: BlockSuiteWorkspace) => {
  const { openPage, jumpToSubPath } = useNavigateHelper();
  const { createPage } = useBlockSuiteWorkspaceHelper(blockSuiteWorkspace);
  const pageSettings = useAtomValue(pageSettingsAtom);
  const { setPageMeta } = usePageMetaHelper(blockSuiteWorkspace);

  const isPreferredEdgeless = useCallback(
    (pageId: string) => pageSettings[pageId]?.mode === 'edgeless',
    [pageSettings]
  );

  const setPageMode = useSetAtom(setPageModeAtom);

  const createPageAndOpen = useCallback(
    (mode?: 'page' | 'edgeless') => {
      const page = createPage();
      initEmptyPage(page);
      setPageMode(page.id, mode || 'page');
      openPage(blockSuiteWorkspace.id, page.id);
      return page;
    },
    [blockSuiteWorkspace.id, createPage, openPage, setPageMode]
  );

  const createEdgelessAndOpen = useCallback(() => {
    return createPageAndOpen('edgeless');
  }, [createPageAndOpen]);

  const importFileAndOpen = useAsyncCallback(async () => {
    const { showImportModal } = await import('@blocksuite/blocks');
    const onSuccess = (pageIds: string[], isWorkspaceFile: boolean) => {
      toast(
        `Successfully imported ${pageIds.length} Page${
          pageIds.length > 1 ? 's' : ''
        }.`
      );
      if (isWorkspaceFile) {
        jumpToSubPath(blockSuiteWorkspace.id, WorkspaceSubPath.ALL);
        return;
      }

      if (pageIds.length === 0) {
        return;
      }
      const pageId = pageIds[0];
      openPage(blockSuiteWorkspace.id, pageId);
    };
    showImportModal({ workspace: blockSuiteWorkspace, onSuccess });
  }, [blockSuiteWorkspace, openPage, jumpToSubPath]);

  const createLinkedPageAndOpen = useAsyncCallback(
    async (pageId: string) => {
      const page = createPageAndOpen();
      page.load();
      const parentPage = blockSuiteWorkspace.getPage(pageId);
      if (parentPage) {
        parentPage.load();
        const text = parentPage.Text.fromDelta([
          {
            insert: ' ',
            attributes: {
              reference: {
                type: 'LinkedPage',
                pageId: page.id,
              },
            },
          },
        ]);
        const [frame] = parentPage.getBlockByFlavour('affine:note');
        frame && parentPage.addBlock('affine:paragraph', { text }, frame.id);
        setPageMeta(page.id, {});
      }
    },
    [blockSuiteWorkspace, createPageAndOpen, setPageMeta]
  );

  return useMemo(() => {
    return {
      createPage: createPageAndOpen,
      createEdgeless: createEdgelessAndOpen,
      importFile: importFileAndOpen,
      isPreferredEdgeless: isPreferredEdgeless,
      createLinkedPage: createLinkedPageAndOpen,
    };
  }, [
    createEdgelessAndOpen,
    createLinkedPageAndOpen,
    createPageAndOpen,
    importFileAndOpen,
    isPreferredEdgeless,
  ]);
};
