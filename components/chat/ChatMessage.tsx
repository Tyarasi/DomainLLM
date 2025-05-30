"use client";

import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex items-start gap-4 max-w-4xl",
        isUser ? "ml-auto" : "mr-auto"
      )}
    >
      <div
        className={cn(
          "rounded-lg px-4 py-2 max-w-[85%]",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        )}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
      </div>
    </div>
  );
}
