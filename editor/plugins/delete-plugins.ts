'use client';

// SelectOnBackspacePlugin and DeletePlugin have been removed in platejs v49.
// Their behavior is now built into Plate by default:
// - delete (backward/forward) at the start of a block will select the previous/next void block
// - delete (backward/forward) from an empty block will remove it instead of merging
export const deletePlugins = [] as const;
