"use client";

import { ClientSideSuspense } from "@liveblocks/react";

import { CommentsOverlay } from "@/components/comments/CommentsOverlay";

export const Comments = () => (
  <ClientSideSuspense fallback={null}>
    {() => <CommentsOverlay />}
  </ClientSideSuspense>
);


// ClientSideSuspense -> this allowed rander comments to clientside