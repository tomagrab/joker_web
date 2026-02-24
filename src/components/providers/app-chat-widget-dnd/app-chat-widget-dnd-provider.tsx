"use client";

import AppChatWidget from "@/components/modules/app-chat-widget/app-chat-widget";
import type { UniqueIdentifier } from "@dnd-kit/abstract";
import { closestCenter } from "@dnd-kit/collision";
import { RestrictToElement } from "@dnd-kit/dom/modifiers";
import { DragDropProvider, useDraggable, useDroppable } from "@dnd-kit/react";
import { ReactNode, useState } from "react";

type ChatDnDProviderProps = {
  children: ReactNode;
};

export default function AppChatWidgetDnDProvider({
  children,
}: ChatDnDProviderProps) {
  const [dropTarget, setDefaultDropTarget] = useState<UniqueIdentifier | null>(
    "bottom-right-corner",
  );
  return (
    <div className="">
      <DragDropProvider
        onDragStart={(event) => {
          console.log("Drag started:", event);
        }}
        onDragEnd={(event) => {
          if (event.canceled) return;

          const { target } = event.operation;
          setDefaultDropTarget(target?.id || null);
        }}
      >
        {children}

        {!dropTarget && <DraggableChatWidget />}

        <DroppableCorner id={`top-left-corner`} position="top-left">
          {dropTarget === "top-left-corner" && <DraggableChatWidget />}
        </DroppableCorner>
        <DroppableCorner id={`bottom-left-corner`} position="bottom-left">
          {dropTarget === "bottom-left-corner" && <DraggableChatWidget />}
        </DroppableCorner>
        <DroppableCorner id={`top-right-corner`} position="top-right">
          {dropTarget === "top-right-corner" && <DraggableChatWidget />}
        </DroppableCorner>
        <DroppableCorner id={`bottom-right-corner`} position="bottom-right">
          {dropTarget === "bottom-right-corner" && <DraggableChatWidget />}
        </DroppableCorner>
      </DragDropProvider>
    </div>
  );
}

function DraggableChatWidget() {
  const { ref } = useDraggable({
    id: "chat-widget",
    modifiers: [RestrictToElement.configure({ element: () => document.body })],
  });

  return <AppChatWidget ref={ref} />;
}

type DroppableCornerProps = {
  id: UniqueIdentifier;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  children: ReactNode;
};

function DroppableCorner({ id, position, children }: DroppableCornerProps) {
  const positionClasses = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0",
    "bottom-left": "bottom-0 left-0",
    "bottom-right": "bottom-0 right-0",
  };

  const { ref, isDropTarget } = useDroppable({
    id,
    collisionDetector: closestCenter,
  });

  return (
    <div
      ref={ref}
      className={`absolute ${positionClasses[position]} z-100 flex h-20 w-20 flex-col items-center justify-center`}
    >
      <div
        className={`absolute top-[50%] left-[50%] z-0 h-14 w-14 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-gray-600 transition-opacity duration-300 ${
          isDropTarget ? "opacity-60" : "opacity-0"
        }`}
      />
      <div className="z-10">{children}</div>
    </div>
  );
}
