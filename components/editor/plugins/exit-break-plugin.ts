'use client';

import { ExitBreakPlugin, KEYS } from 'platejs';

// In v49+, ExitBreakPlugin uses shortcuts instead of complex rule-based configuration
// The plugin now exits to the nearest exitable ancestor with isStrictSiblings: false
export const exitBreakPlugin = ExitBreakPlugin.configure({
  shortcuts: {
    insert: { keys: 'mod+enter' },
    insertBefore: { keys: 'mod+shift+enter' },
  },
});
