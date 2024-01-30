import type { PageMode } from '@affine/core/atoms';
import { useCurrentLoginStatus } from '@affine/core/hooks/affine/use-current-login-status';
import { useState } from 'react';

import { AuthenticatedItem } from './authenticated-item';
import { PresentButton } from './present';
import * as styles from './styles.css';
import { PublishPageUserAvatar } from './user-avatar';

export type ShareHeaderRightItemProps = {
  workspaceId: string;
  pageId: string;
  publishMode: PageMode;
};

const ShareHeaderRightItem = ({ ...props }: ShareHeaderRightItemProps) => {
  const loginStatus = useCurrentLoginStatus();

  const { publishMode } = props;
  const [showDivider, setShowDivider] = useState(false);

  // TODO: Add TOC
  return (
    <div className={styles.rightItemContainer}>
      {loginStatus === 'authenticated' ? (
        <AuthenticatedItem setShowDivider={setShowDivider} {...props} />
      ) : null}
      {publishMode === 'edgeless' ? <PresentButton /> : null}
      {showDivider ? <div className={styles.headerDivider} /> : null}
      {loginStatus === 'authenticated' ? <PublishPageUserAvatar /> : null}
    </div>
  );
};

export default ShareHeaderRightItem;
