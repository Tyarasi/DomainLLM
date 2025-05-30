"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DocumentManager } from "@/components/documents/DocumentManager";

export default function DocumentsPage() {
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
              <Button variant="ghost">Chat</Button>
            </Link>
            <Link href="/documents">
              <Button variant="ghost" className="font-bold">Documents</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 container py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Document Management</h1>
          <p className="text-muted-foreground mt-2">
            Upload and manage your documents for domain-specific consultation.
          </p>
        </div>
        <DocumentManager />
      </main>
    </div>
  );
}
