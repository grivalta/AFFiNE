import type { Collection, Filter } from '@affine/env/filter';
import type { PageMeta } from '@blocksuite/store';
import { useMemo } from 'react';

import { filterPage, filterPageByRules } from './use-collection-manager';

export const useFilteredPageMetas = (
  pageMetas: PageMeta[],
  options: {
    trash?: boolean;
    filters?: Filter[];
    collection?: Collection;
  } = {}
) => {
  const filteredPageMetas = useMemo(
    () =>
      pageMetas.filter(pageMeta => {
        if (options.trash) {
          if (!pageMeta.trash) {
            return false;
          }
        } else if (pageMeta.trash) {
          return false;
        }
        if (
          options.filters &&
          !filterPageByRules(options.filters, [], pageMeta)
        ) {
          return false;
        }

        if (options.collection && !filterPage(options.collection, pageMeta)) {
          return false;
        }

        return true;
      }),
    [options.trash, options.filters, options.collection, pageMetas]
  );

  return filteredPageMetas;
};
