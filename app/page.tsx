import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">DomainLLM</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/chat">
              <Button variant="ghost">Chat</Button>
            </Link>
            <Link href="/documents">
              <Button variant="ghost">Documents</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Offline AI Chatbot for Domain-Specific Consultation
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Chat with your documents privately, with no internet or API keys required.
            </p>
            <div className="flex gap-4">
              <Link href="/chat">
                <Button size="lg">Start Chatting</Button>
              </Link>
              <Link href="/documents">
                <Button size="lg" variant="outline">Manage Documents</Button>
              </Link>
            </div>
          </div>
        </section>
        <section className="container py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>100% Offline</CardTitle>
              </CardHeader>
              <CardContent>
                <p>All processing happens locally on your machine with no external API calls.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Domain-Specific</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Upload and chat with documents from any domain - legal, health, education, and more.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Powerful AI</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Leverages local LLM models like Llama3, Mistral, and Phi3 for intelligent responses.</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} DomainLLM. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
