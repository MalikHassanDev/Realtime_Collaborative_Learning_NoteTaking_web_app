"use client";

import { ReactNode } from "react";
import { RoomProvider } from "../liveblocks.config";
import { ClientSideSuspense } from "@liveblocks/react";
import { Loader, LoaderPinwheel } from "lucide-react";
import Cursor from "@/components/Cursor/Cursor";
import { LiveMap } from "@liveblocks/client";

export function Room({ children }: { children: ReactNode }) {
  return (
    <RoomProvider id="my-room" 
    initialPresence={{
       cursor: null, curserColor: null, editingText: null
    }}
    initialStorage={{
        canvasObjects: new LiveMap()
    }}
    >
      <ClientSideSuspense fallback={<div className="h-[100vh] w-full flex justify-center items-center text-center">
        <h1 className="font-2xl text-white "><LoaderPinwheel/></h1></div>}>
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  );
}