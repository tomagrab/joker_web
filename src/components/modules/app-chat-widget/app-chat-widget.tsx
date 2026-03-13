"use client";

import { ChatWidgetClosed } from "@/components/modules/app-chat-widget/app-chat-widget-closed";
import { ChatWidgetPanel } from "@/components/modules/app-chat-widget/app-chat-widget-panel";
import { useChatWidgetConversation } from "@/hooks/app-chat-widget/use-chat-widget-conversation";
import { useChatWidgetState } from "@/hooks/app-chat-widget/use-chat-widget-state";
import {
  getAnimateProps,
  getContainerClassName,
} from "@/lib/helpers/app-chat-widget/app-chat-widget-helpers";
import { AnimatePresence, motion } from "motion/react";
import { memo, useCallback } from "react";

type AppChatWidgetProps = {
  dragRef?: (element: Element | null) => void;
  handleRef?: (element: Element | null) => void;
};

const CONTAINER_TRANSITION = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30,
};

const AppChatWidget = memo(function AppChatWidget({
  dragRef,
  handleRef,
}: AppChatWidgetProps) {
  const {
    state,
    containerRef,
    originRect,
    isFullscreen,
    isClosed,
    needsFixed,
    isExitingFullscreen,
    handleStateChange,
    handleAnimationComplete,
  } = useChatWidgetState();
  const {
    inputRef,
    inputValue,
    setInputValue,
    messages,
    isSubmitting,
    isConfigured,
    isConfigLoading,
    handleSubmit,
  } = useChatWidgetConversation();

  const setContainerRef = useCallback(
    (element: HTMLDivElement | null) => {
      if (dragRef) {
        dragRef(element);
      }

      containerRef.current = element;
    },
    [dragRef, containerRef],
  );

  return (
    <motion.div
      ref={setContainerRef}
      className={getContainerClassName(state, needsFixed)}
      style={
        isFullscreen && originRect
          ? { top: originRect.top, left: originRect.left }
          : undefined
      }
      initial={false}
      animate={getAnimateProps(state, isExitingFullscreen, originRect)}
      transition={CONTAINER_TRANSITION}
      onAnimationComplete={handleAnimationComplete}
      onClick={() => isClosed && handleStateChange("open")}
    >
      <AnimatePresence mode="popLayout">
        {isClosed ? (
          <ChatWidgetClosed />
        ) : (
          <ChatWidgetPanel
            isFullscreen={isFullscreen}
            onStateChange={handleStateChange}
            handleRef={handleRef}
            inputRef={inputRef}
            inputValue={inputValue}
            onInputValueChange={setInputValue}
            onSubmit={handleSubmit}
            messages={messages}
            isLoading={isSubmitting}
            isConfigured={isConfigured}
            isConfigurationLoading={isConfigLoading}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
});

export default AppChatWidget;
