"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SearchIcon, SendIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useChat } from "ai/react";
import { Input } from "../ui/input";
export default function ChatScreen() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="flex flex-col h-screen w-full">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <div className="text-lg font-semibold">Chat with Acme Inc</div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <img
                src="/placeholder.svg"
                width="32"
                height="32"
                className="rounded-full"
                alt="Avatar"
              />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <div className="grid gap-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-4 ${
                message.role === "user" ? "justify-end" : ""
              }`}
            >
              {message.role !== "user" && (
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>{message.role[0]}</AvatarFallback>
                </Avatar>
              )}
              <div className="grid gap-1.5">
                <div
                  className={`rounded-lg ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  } p-3 text-sm`}
                >
                  <ReactMarkdown className="markdown ">
                    {message.content}
                  </ReactMarkdown>
                </div>
                <div className="text-xs text-muted-foreground"></div>
              </div>
              {message.role === "user" && (
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>{message.role[0]}</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="border-t px-4 py-2">
        <form onSubmit={handleSubmit} className="relative">
          {/* <input
            className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
          /> */}

          <Input
            placeholder="Type your message..."
            className="min-h-[48px] w-full rounded-2xl resize-none p-4 pr-16 text-sm"
            value={input}
            onChange={handleInputChange}
          />
          <Button
            type="button"
            size="icon"
            className="absolute right-3 top-3"
            onClick={handleSubmit}
          >
            <SendIcon className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
