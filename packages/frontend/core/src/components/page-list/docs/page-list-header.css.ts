import { cssVar } from '@toeverything/theme';
import { style } from '@vanilla-extract/css';
export const docListHeader = style({
  height: 100,
  alignItems: 'center',
  padding: '48px 16px 20px 24px',
  overflow: 'hidden',
  display: 'flex',
  justifyContent: 'space-between',
  background: cssVar('backgroundPrimaryColor'),
});
export const docListHeaderTitle = style({
  fontSize: cssVar('fontH5'),
  fontWeight: 500,
  color: cssVar('textSecondaryColor'),
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  height: '28px',
});
export const titleIcon = style({
  color: cssVar('iconColor'),
  display: 'inline-flex',
  alignItems: 'center',
});
export const titleCollectionName = style({
  color: cssVar('textPrimaryColor'),
});
export const addPageButton = style({
  padding: '6px 10px',
  borderRadius: '8px',
  background: cssVar('backgroundPrimaryColor'),
  fontSize: cssVar('fontSm'),
  fontWeight: 600,
  height: '32px',
});
export const tagSticky = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '1px 8px',
  color: cssVar('textPrimaryColor'),
  fontSize: cssVar('fontXs'),
  borderRadius: '10px',
  columnGap: '4px',
  border: `1px solid ${cssVar('borderColor')}`,
  background: cssVar('backgroundPrimaryColor'),
  maxWidth: '30vw',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  height: '22px',
  lineHeight: '1.67em',
});
export const tagIndicator = style({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  flexShrink: 0,
});
export const tagLabel = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});
