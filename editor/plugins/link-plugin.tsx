'use client';

import { LinkPlugin } from '@platejs/link/react';

import { LinkFloatingToolbar } from '@/components/plate-ui/link-floating-toolbar';

export const linkPlugin = LinkPlugin.extend({
  render: { afterEditable: () => <LinkFloatingToolbar /> },
});
