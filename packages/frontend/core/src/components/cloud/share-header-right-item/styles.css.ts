import { cssVar } from '@toeverything/theme';
import { globalStyle, style } from '@vanilla-extract/css';

export const iconWrapper = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '24px',
  cursor: 'pointer',
  color: cssVar('textPrimaryColor'),
  selectors: {
    '&:visited': {
      color: cssVar('textPrimaryColor'),
    },
  },
});
export const rightItemContainer = style({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '0 8px',
});

export const headerDivider = style({
  width: '1px',
  height: '20px',
  background: cssVar('borderColor'),
});

export const presentButton = style({
  gap: '4px',
  background: cssVar('black'),
  color: cssVar('white'),
  borderColor: cssVar('pureBlack10'),
  boxShadow: cssVar('buttonInnerShadow'),

  '@media': {
    'screen and (max-width: 640px)': {
      display: 'none',
    },
  },
});

globalStyle(`${presentButton} svg`, {
  color: cssVar('white'),
});

export const editButton = style({
  padding: '4px 8px',
});
