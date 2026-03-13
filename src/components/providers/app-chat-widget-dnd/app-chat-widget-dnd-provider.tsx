"use client";

import AppChatWidgetContext from "@/components/contexts/app-chat-widget/app-chat-widget-context";
import AppChatWidget from "@/components/modules/app-chat-widget/app-chat-widget";
import type { UniqueIdentifier } from "@dnd-kit/abstract";
import { closestCorners } from "@dnd-kit/collision";
import { RestrictToWindow } from "@dnd-kit/dom/modifiers";
import { DragDropProvider, useDraggable, useDroppable } from "@dnd-kit/react";
import { ReactNode, useContext, useState } from "react";

type ChatWidgetPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

type ChatDnDProviderProps = {
  children: ReactNode;
  initialPosition?: ChatWidgetPosition;
};

const CORNER_ID_BY_POSITION: Record<ChatWidgetPosition, UniqueIdentifier> = {
  "top-left": "top-left-corner",
  "top-right": "top-right-corner",
  "bottom-left": "bottom-left-corner",
  "bottom-right": "bottom-right-corner",
};

const POSITION_BY_CORNER_ID = Object.fromEntries(
  Object.entries(CORNER_ID_BY_POSITION).map(([position, id]) => [id, position]),
) as Record<UniqueIdentifier, ChatWidgetPosition>;

const POSITION_CLASSES: Record<ChatWidgetPosition, string> = {
  "top-left": "top-0 left-0",
  "top-right": "top-0 right-0",
  "bottom-left": "bottom-0 left-0",
  "bottom-right": "bottom-0 right-0",
};

const ALIGNMENT_CLASSES: Record<ChatWidgetPosition, string> = {
  "top-left": "items-start justify-start",
  "top-right": "items-end justify-start",
  "bottom-left": "items-start justify-end",
  "bottom-right": "items-end justify-end",
};

const ORIGIN_CLASSES: Record<ChatWidgetPosition, string> = {
  "top-left": "top-0 left-0 translate-x-0 translate-y-0",
  "top-right": "top-0 right-0 translate-x-0 translate-y-0",
  "bottom-left": "bottom-0 left-0 translate-x-0 translate-y-0",
  "bottom-right": "bottom-0 right-0 translate-x-0 translate-y-0",
};

export default function AppChatWidgetDnDProvider({
  children,
  initialPosition = "bottom-right",
}: ChatDnDProviderProps) {
  const [position, setPosition] = useState<ChatWidgetPosition>(initialPosition);

  return (
    <div>
      <DragDropProvider
        onDragEnd={(event) => {
          if (event.canceled) {
            return;
          }

          const targetId = event.operation.target?.id;

          if (!targetId) {
            return;
          }

          const nextPosition = POSITION_BY_CORNER_ID[targetId];

          if (!nextPosition) {
            return;
          }

          document.cookie = `chat_widget_position=${nextPosition}; path=/; max-age=${60 * 60 * 24 * 30}`;
          setPosition(nextPosition);
        }}
      >
        {children}

        <DraggableChatWidget position={position} />

        <DroppableCorner
          id={CORNER_ID_BY_POSITION["top-left"]}
          position="top-left"
        />
        <DroppableCorner
          id={CORNER_ID_BY_POSITION["bottom-left"]}
          position="bottom-left"
        />
        <DroppableCorner
          id={CORNER_ID_BY_POSITION["top-right"]}
          position="top-right"
        />
        <DroppableCorner
          id={CORNER_ID_BY_POSITION["bottom-right"]}
          position="bottom-right"
        />
      </DragDropProvider>
    </div>
  );
}

type DraggableChatWidgetProps = {
  position: ChatWidgetPosition;
};

function DraggableChatWidget({ position }: DraggableChatWidgetProps) {
  const { state } = useContext(AppChatWidgetContext);
  const { ref, handleRef } = useDraggable({
    id: "chat-widget",
    feedback: "move",
    modifiers: [RestrictToWindow],
    disabled: state === "fullscreen",
  });

  return (
    <div
      className={`fixed ${POSITION_CLASSES[position]} z-100 flex max-h-screen max-w-full flex-col p-2 ${ALIGNMENT_CLASSES[position]}`}
    >
      <div className="z-10 max-h-[calc(100vh-1rem)] max-w-[calc(100vw-1rem)] overflow-auto">
        <AppChatWidget dragRef={ref} handleRef={handleRef} />
      </div>
    </div>
  );
}

type DroppableCornerProps = {
  id: UniqueIdentifier;
  position: ChatWidgetPosition;
};

function DroppableCorner({ id, position }: DroppableCornerProps) {
  const { ref, isDropTarget } = useDroppable({
    id,
    collisionDetector: closestCorners,
  });

  return (
    <div
      ref={ref}
      className={`pointer-events-none fixed ${POSITION_CLASSES[position]} z-110 h-40 w-40 p-2`}
    >
      <div
        className={`pointer-events-none absolute ${ORIGIN_CLASSES[position]} z-0 m-1 h-14 w-14 rounded-full bg-gray-600 transition-opacity duration-300 ${
          isDropTarget ? "opacity-60" : "opacity-0"
        }`}
      />
    </div>
  );
}
