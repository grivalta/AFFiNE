import type { Collection, Filter, VariableMap } from '@affine/env/filter';
import type { PageMeta } from '@blocksuite/store';

import { evalFilterList } from './filter';

export const createEmptyCollection = (
  id: string,
  data?: Partial<Omit<Collection, 'id'>>
): Collection => {
  return {
    id,
    name: '',
    filterList: [],
    allowList: [],
    ...data,
  };
};

export const filterByFilterList = (filterList: Filter[], varMap: VariableMap) =>
  evalFilterList(filterList, varMap);

export const filterPage = (collection: Collection, page: PageMeta) => {
  if (collection.filterList.length === 0) {
    return collection.allowList.includes(page.id);
  }
  return filterPageByRules(collection.filterList, collection.allowList, page);
};
export const filterPageByRules = (
  rules: Filter[],
  allowList: string[],
  page: PageMeta
) => {
  if (allowList?.includes(page.id)) {
    return true;
  }
  return filterByFilterList(rules, {
    'Is Favourited': !!page.favorite,
    Created: page.createDate,
    Updated: page.updatedDate ?? page.createDate,
    Tags: page.tags,
  });
};
