export type ChatWidgetState =
  | "closed"
  | "open"
  | "fullscreen"
  | null
  | undefined;

export type AppChatWidgetMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  status: "complete" | "pending" | "error";
  format: "text" | "html";
};
