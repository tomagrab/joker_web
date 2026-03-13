"use client";

import AppChatWidgetContext from "@/components/contexts/app-chat-widget/app-chat-widget-context";
import AppChatWidget from "@/components/modules/app-chat-widget/app-chat-widget";
import type { UniqueIdentifier } from "@dnd-kit/abstract";
import { closestCorners } from "@dnd-kit/collision";
import { RestrictToWindow } from "@dnd-kit/dom/modifiers";
import { DragDropProvider, useDraggable, useDroppable } from "@dnd-kit/react";
import { ReactNode, useContext, useState } from "react";

type ChatDnDProviderProps = {
  children: ReactNode;
  initialPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
};

export default function AppChatWidgetDnDProvider({
  children,
  initialPosition = "bottom-right",
}: ChatDnDProviderProps) {
  const [dropTarget, setDefaultDropTarget] = useState<UniqueIdentifier | null>(
    `${initialPosition}-corner`,
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
          // Set the position cookie based on the drop target's ID
          if (target) {
            const position = String(target.id).replace("-corner", "");
            document.cookie = `chat_widget_position=${position}; path=/; max-age=${60 * 60 * 24 * 30}`;
          }
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
  const { state } = useContext(AppChatWidgetContext);
  const { ref, handleRef } = useDraggable({
    id: "chat-widget",
    modifiers: [RestrictToWindow],
    disabled: state === "fullscreen",
  });

  return <AppChatWidget ref={ref} handleRef={handleRef} />;
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

  // Align items so the widget grows inward (toward viewport center)
  const alignmentClasses = {
    "top-left": "items-start justify-start",
    "top-right": "items-end justify-start",
    "bottom-left": "items-start justify-end",
    "bottom-right": "items-end justify-end",
  };

  // Origin for the drop target indicator circle
  const originClasses = {
    "top-left": "top-0 left-0 translate-x-0 translate-y-0",
    "top-right": "top-0 right-0 translate-x-0 translate-y-0",
    "bottom-left": "bottom-0 left-0 translate-x-0 translate-y-0",
    "bottom-right": "bottom-0 right-0 translate-x-0 translate-y-0",
  };

  const { ref, isDropTarget } = useDroppable({
    id,
    collisionDetector: closestCorners,
  });

  return (
    <div
      ref={ref}
      className={`fixed ${positionClasses[position]} z-100 flex max-h-screen max-w-full flex-col p-2 ${alignmentClasses[position]}`}
    >
      <div
        className={`pointer-events-none absolute ${originClasses[position]} z-0 m-1 h-14 w-14 rounded-full bg-gray-600 transition-opacity duration-300 ${
          isDropTarget ? "opacity-60" : "opacity-0"
        }`}
      />
      <div className="z-10 max-h-[calc(100vh-1rem)] max-w-[calc(100vw-1rem)] overflow-auto">
        {children}
      </div>
    </div>
  );
}
