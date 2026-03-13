'use client';

import { MentionPlugin } from '@platejs/mention/react';

export const mentionPlugin = MentionPlugin.configure({
  options: { triggerPreviousCharPattern: /^$|^[\s"']$/ },
});
