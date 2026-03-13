export type ChatWidgetState = "closed" | "open" | "fullscreen";

export type AppChatWidgetMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  status: "complete" | "pending" | "error";
  format: "text" | "html";
};
