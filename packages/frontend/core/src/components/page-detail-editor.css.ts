import { globalStyle, style } from '@vanilla-extract/css';
export const editor = style({
  flex: 1,
  selectors: {
    '&.full-screen': {
      vars: {
        '--affine-editor-width': '100%',
        '--affine-editor-side-padding': '15px',
      },
    },
  },
});
globalStyle(`${editor} .affine-doc-viewport`, {
  paddingBottom: '150px',
});
globalStyle('.is-public-page page-meta-tags', {
  display: 'none',
});
