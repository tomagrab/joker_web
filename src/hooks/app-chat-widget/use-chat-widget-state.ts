import AppChatWidgetContext from "@/components/contexts/app-chat-widget/app-chat-widget-context";
import type { ChatWidgetState } from "@/lib/types/chat-widget/chat-widget-types";
import { useCallback, useContext, useRef, useState } from "react";

/**
 * Manages chat widget state transitions and the fullscreen enter/exit animation.
 *
 * - Captures the widget's bounding rect before entering fullscreen so the
 *   animation can expand from the widget's current position.
 * - Tracks the "exiting fullscreen" phase so the container stays `fixed`
 *   while the spring animates back to the saved position.
 * - Exposes `handleAnimationComplete` to release fixed positioning once
 *   the spring settles.
 */
export function useChatWidgetState() {
  const { state, setState } = useContext(AppChatWidgetContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const [originRect, setOriginRect] = useState<DOMRect | null>(null);
  const [isExitingFullscreen, setIsExitingFullscreen] = useState(false);

  const isFullscreen = state === "fullscreen";
  const isClosed = state === "closed";
  const needsFixed = isFullscreen || isExitingFullscreen;

  const handleStateChange = useCallback(
    (newState: ChatWidgetState) => {
      if (newState === "fullscreen" && containerRef.current) {
        setOriginRect(containerRef.current.getBoundingClientRect());
      }
      if (state === "fullscreen" && newState !== "fullscreen") {
        setIsExitingFullscreen(true);
      }
      setState(newState);
    },
    [state, setState],
  );

  const handleAnimationComplete = useCallback(() => {
    if (isExitingFullscreen) {
      setIsExitingFullscreen(false);
      setOriginRect(null);
    }
  }, [isExitingFullscreen]);

  return {
    state,
    containerRef,
    originRect,
    isFullscreen,
    isClosed,
    needsFixed,
    isExitingFullscreen,
    handleStateChange,
    handleAnimationComplete,
  };
}
