"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;
    
    onSend(message);
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Type your message..."
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <Button type="submit" disabled={isLoading || !message.trim()}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Thinking...
          </>
        ) : (
          "Send"
        )}
      </Button>
    </form>
  );
}
