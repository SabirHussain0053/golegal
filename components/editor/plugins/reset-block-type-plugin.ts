'use client';

// ResetNodePlugin has been deprecated in v49.
// Reset behaviors are now configured using `rules.break` and `rules.delete` on individual plugins.
// The default behaviors are built into Plate, so we just export an empty array.
// Individual plugins like BlockquotePlugin, CodeBlockPlugin etc should be configured
// with rules if custom reset behavior is needed:
//
// BlockquotePlugin.configure({
//   rules: {
//     break: { empty: 'reset' },
//     delete: { start: 'reset' },
//   },
// })

export const resetBlockTypePlugin = [] as const;
