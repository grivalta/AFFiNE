import type { PrimitiveAtom } from 'jotai';
import { atom } from 'jotai';
import { atomFamily, atomWithStorage } from 'jotai/utils';
import type { AtomFamily } from 'jotai/vanilla/utils/atomFamily';

import type { AuthProps } from '../components/affine/auth';
import type { CreateWorkspaceMode } from '../components/affine/create-workspace-modal';
import type { SettingProps } from '../components/affine/setting-modal';
// modal atoms
export const openWorkspacesModalAtom = atom(false);
export const openCreateWorkspaceModalAtom = atom<CreateWorkspaceMode>(false);
export const openQuickSearchModalAtom = atom(false);
export const openSignOutModalAtom = atom(false);
export const openPaymentDisableAtom = atom(false);
export const openQuotaModalAtom = atom(false);
export const openStarAFFiNEModalAtom = atom(false);
export const openIssueFeedbackModalAtom = atom(false);
export const openHistoryTipsModalAtom = atom(false);

export type SettingAtom = Pick<
  SettingProps,
  'activeTab' | 'workspaceMetadata'
> & {
  open: boolean;
};

export const openSettingModalAtom = atom<SettingAtom>({
  activeTab: 'appearance',
  open: false,
});

export type AuthAtom = {
  openModal: boolean;
  state: AuthProps['state'];
  email?: string;
  emailType?: AuthProps['emailType'];
};

export const authAtom = atom<AuthAtom>({
  openModal: false,
  state: 'signIn',
  email: '',
  emailType: 'changeEmail',
});

export const openDisableCloudAlertModalAtom = atom(false);

export type PageMode = 'page' | 'edgeless';
type PageLocalSetting = {
  mode: PageMode;
};

const pageSettingsBaseAtom = atomWithStorage(
  'pageSettings',
  {} as Record<string, PageLocalSetting>
);

// readonly atom by design
export const pageSettingsAtom = atom(get => get(pageSettingsBaseAtom));

export const recentPageIdsBaseAtom = atomWithStorage<string[]>(
  'recentPageSettings',
  []
);

const defaultPageSetting = {
  mode: 'page',
} satisfies PageLocalSetting;

export const pageSettingFamily: AtomFamily<
  string,
  PrimitiveAtom<PageLocalSetting>
> = atomFamily((pageId: string) =>
  atom(
    get =>
      get(pageSettingsBaseAtom)[pageId] ?? {
        ...defaultPageSetting,
      },
    (get, set, patch) => {
      // fixme: this does not work when page reload,
      // since atomWithStorage is async
      set(recentPageIdsBaseAtom, ids => {
        // pick 3 recent page ids
        return [...new Set([pageId, ...ids]).values()].slice(0, 3);
      });
      const prevSetting = {
        ...defaultPageSetting,
        ...get(pageSettingsBaseAtom)[pageId],
      };
      set(pageSettingsBaseAtom, settings => ({
        ...settings,
        [pageId]: {
          ...prevSetting,
          ...(typeof patch === 'function' ? patch(prevSetting) : patch),
        },
      }));
    }
  )
);

export const setPageModeAtom = atom(
  void 0,
  (_, set, pageId: string, mode: PageMode) => {
    set(pageSettingFamily(pageId), { mode });
  }
);

export type PageModeOption = 'all' | 'page' | 'edgeless';
export const allPageModeSelectAtom = atom<PageModeOption>('all');

export type AllPageFilterOption = 'docs' | 'collections' | 'tags';
export const allPageFilterSelectAtom = atom<AllPageFilterOption>('docs');

export const openWorkspaceListModalAtom = atom(false);
