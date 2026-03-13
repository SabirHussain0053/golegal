'use client';

// SoftBreakPlugin has been removed in v49.
// - shift+enter soft break behavior is built into Plate by default.
// - For enter rules in specific blocks (like code blocks), use:
//   plugin.configure({ rules: { break: { default: 'lineBreak' } } })
// to insert a line break instead of a hard break on Enter keydown.
export const softBreakPlugin = [] as const;
