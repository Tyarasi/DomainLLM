"use client";

import { useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface ChatInterfaceProps {
  selectedDocuments: string[];
}

export function ChatInterface({ selectedDocuments }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // Generate a unique ID for the message
    const messageId = Date.now().toString();
    
    // Add user message to the chat
    const userMessage: Message = {
      id: messageId,
      role: "user",
      content,
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Check if documents are selected
      if (selectedDocuments.length === 0) {
        toast({
          title: "No documents selected",
          description: "Please select at least one document to chat with.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Call the backend API with the chat message and selected documents
      const { chatApi } = await import("@/lib/api/client");
      const response = await chatApi.sendMessage(content, selectedDocuments);
      
      // Add the assistant's response to the chat
      const assistantMessage: Message = {
        id: response.id,
        role: "assistant",
        content: response.content,
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-[calc(100vh-10rem)]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium">Start a conversation</h3>
              <p className="text-sm text-muted-foreground">
                Select documents and ask questions about them.
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
      </div>
      <div className="border-t p-4">
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </div>
    </Card>
  );
}
