export type ChatWidgetState = "closed" | "open" | "fullscreen";

export type ChatWidgetPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export type AppChatWidgetMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  status: "complete" | "pending" | "error";
  format: "text" | "html";
};
