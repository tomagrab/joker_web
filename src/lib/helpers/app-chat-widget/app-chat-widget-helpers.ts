import type { ChatWidgetState } from "@/lib/types/chat-widget/chat-widget-types";

const CLOSED_SIZE = 56;
const OPEN_WIDTH = 400;
const OPEN_HEIGHT = 600;

/**
 * Returns the Tailwind className string for the chat widget container
 * based on the current state and whether fixed positioning is needed.
 */
export function getContainerClassName(
  state: ChatWidgetState,
  needsFixed: boolean,
): string {
  const base = "flex flex-col overflow-hidden bg-gold";
  const stateClass =
    state === "closed" ? "cursor-pointer items-center justify-center" : "";
  const fixedClass = needsFixed ? "fixed z-50" : "";

  return `${base} ${stateClass} ${fixedClass}`;
}

/**
 * Returns the Framer Motion animate props for the chat widget container.
 * Handles closed, open, fullscreen, and the fullscreen-exit transition.
 */
export function getAnimateProps(
  state: ChatWidgetState,
  isExitingFullscreen: boolean,
  originRect: DOMRect | null,
) {
  if (state === "closed") {
    if (isExitingFullscreen && originRect) {
      return {
        top: originRect.top,
        left: originRect.left,
        right: window.innerWidth - originRect.left - CLOSED_SIZE,
        bottom: window.innerHeight - originRect.top - CLOSED_SIZE,
        width: CLOSED_SIZE,
        height: CLOSED_SIZE,
        borderRadius: CLOSED_SIZE / 2,
      };
    }
    return {
      width: CLOSED_SIZE,
      height: CLOSED_SIZE,
      borderRadius: CLOSED_SIZE / 2,
    };
  }

  if (state === "fullscreen") {
    return {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: "100%",
      height: "100%",
      borderRadius: 0,
    };
  }

  // Open state
  if (isExitingFullscreen && originRect) {
    return {
      top: originRect.top,
      left: originRect.left,
      right: window.innerWidth - originRect.left - OPEN_WIDTH,
      bottom: window.innerHeight - originRect.top - OPEN_HEIGHT,
      width: OPEN_WIDTH,
      height: OPEN_HEIGHT,
      borderRadius: 8,
    };
  }

  return {
    width: OPEN_WIDTH,
    height: OPEN_HEIGHT,
    borderRadius: 8,
  };
}
