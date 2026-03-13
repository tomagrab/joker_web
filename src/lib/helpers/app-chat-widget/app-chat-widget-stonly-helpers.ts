export const APP_CHAT_WIDGET_LOADING_MESSAGES = [
  "Considering your message carefully...",
  "Reviewing the details you shared...",
  "Crafting the clearest response...",
  "Preparing a thoughtful answer...",
  "Checking the best way to explain this...",
  "Working through the request step by step...",
  "Pulling together the most relevant guidance...",
  "Refining the response for accuracy...",
  "Looking for the most helpful next step...",
  "Organizing the answer into something useful...",
  "Turning your question into a precise response...",
  "Checking the context before replying...",
  "Building a response tailored to your request...",
  "Searching for the most relevant information...",
  "Connecting the right details now...",
  "Preparing a practical recommendation...",
  "Making sure the response is on point...",
  "Putting together a concise answer...",
  "Shaping the response for clarity...",
  "Working on the best possible explanation...",
  "Examining the request from all angles...",
  "Composing a polished reply...",
  "Gathering the most useful details...",
  "Translating the result into a clear answer...",
  "Finalizing the response for you...",
] as const;

export function createAppChatWidgetMessageId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function getAppChatWidgetLoadingMessage(index: number) {
  return APP_CHAT_WIDGET_LOADING_MESSAGES[
    index % APP_CHAT_WIDGET_LOADING_MESSAGES.length
  ];
}

export function getRandomAppChatWidgetLoadingMessage() {
  return getAppChatWidgetLoadingMessage(
    Math.floor(Math.random() * APP_CHAT_WIDGET_LOADING_MESSAGES.length),
  );
}

export function focusAppChatWidgetInput(input: HTMLTextAreaElement | null) {
  requestAnimationFrame(() => {
    if (!input) {
      return;
    }

    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  });
}
