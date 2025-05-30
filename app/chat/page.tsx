"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { DocumentSelector } from "@/components/chat/DocumentSelector";

export default function ChatPage() {
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link href="/">
              <h1 className="text-2xl font-bold">DomainLLM</h1>
            </Link>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/chat">
              <Button variant="ghost" className="font-bold">Chat</Button>
            </Link>
            <Link href="/documents">
              <Button variant="ghost">Documents</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 container py-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-4">
          <div className="rounded-lg border bg-card p-4">
            <h2 className="text-lg font-semibold mb-4">Selected Documents</h2>
            <DocumentSelector 
              selectedDocuments={selectedDocuments}
              setSelectedDocuments={setSelectedDocuments}
            />
          </div>
        </div>
        <div className="md:col-span-3">
          <ChatInterface selectedDocuments={selectedDocuments} />
        </div>
      </main>
    </div>
  );
}
