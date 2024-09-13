"use client";
import React, { useState, useEffect, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  SendIcon,
  X,
  Sparkles,
  Mic,
  Image,
  Code,
  Video,
  Music,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useChat } from "ai/react";
import { Input } from "../ui/input";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import FileUpload from "./file-upload";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

export default function ChatScreen() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedTab, setSelectedTab] = useState("chat");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "assistant") {
        setSuggestions([
          "Tell me more about that",
          "How does this relate to [topic]?",
          "Can you provide an example?",
        ]);
      }
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    // Implement voice recording logic here
  };

  const renderContent = (content: string) => {
    if (content.startsWith("![](")) {
      // Render image
      const src = content.match(/\!\[\]\((.*?)\)/)?.[1];
      return (
        <img src={src} alt="AI-generated" className="max-w-full rounded-lg" />
      );
    } else if (content.startsWith("```")) {
      // Render code block
      const code = content.match(/```(?:\w+)?\n([\s\S]*?)```/)?.[1];
      return (
        <pre className="bg-gray-100 p-2 rounded-lg overflow-x-auto">
          <code>{code}</code>
        </pre>
      );
    } else {
      // Render regular markdown
      return <ReactMarkdown className="markdown">{content}</ReactMarkdown>;
    }
  };

  return (
    <div className="flex flex-col h-screen w-full">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <div className="text-lg font-semibold">AI Assistant</div>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="image">Image</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="video">Video</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
          </TabsList>
        </Tabs>
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
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className={`flex items-start gap-4 mb-4 ${
                message.role === "user" ? "justify-end" : ""
              }`}
            >
              {message.role !== "user" && (
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src="/placeholder-ai.jpg" />
                  <AvatarFallback>{message.role[0]}</AvatarFallback>
                </Avatar>
              )}
              <div className="grid gap-1.5 max-w-[70%]">
                <motion.div
                  className={`rounded-lg ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  } p-3 text-sm`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                  {renderContent(message.content)}
                </motion.div>
                {message.role === "assistant" &&
                  index === messages.length - 1 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {suggestions.map((suggestion, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleInputChange({ target: { value: suggestion } })
                          }
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}
              </div>
              {message.role === "user" && (
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>{message.role[0]}</AvatarFallback>
                </Avatar>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t px-4 py-2">
        <form
          onSubmit={handleSubmit}
          className="relative flex items-center gap-2"
        >
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Upload Context</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <div className="grid justify-items-end">
                <AlertDialogCancel className="p-0 m-0 border-none">
                  <X />
                </AlertDialogCancel>
              </div>
              <FileUpload username="ayush" />
            </AlertDialogContent>
          </AlertDialog>
          <Input
            placeholder={`Type your ${selectedTab} prompt...`}
            className="min-h-[48px] w-full rounded-2xl resize-none p-4 pr-16 text-sm"
            value={input}
            onChange={handleInputChange}
          />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="absolute right-14 top-1"
            onClick={handleVoiceInput}
          >
            <Mic className={`h-4 w-4 ${isRecording ? "text-red-500" : ""}`} />
            <span className="sr-only">Voice Input</span>
          </Button>
          <Button
            type="submit"
            size="icon"
            className="absolute right-3 top-1"
            disabled={isLoading}
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-4 w-4" />
              </motion.div>
            ) : (
              {
                chat: <SendIcon className="h-4 w-4" />,
                image: <Image className="h-4 w-4" />,
                code: <Code className="h-4 w-4" />,
                video: <Video className="h-4 w-4" />,
                audio: <Music className="h-4 w-4" />,
              }[selectedTab]
            )}
            <span className="sr-only">Send</span>
          </Button>
        </form>
        {isLoading && (
          <div className="mt-2">
            <Progress value={33} className="w-full" />
            <p className="text-xs text-center mt-1">Generating response...</p>
          </div>
        )}
      </div>
    </div>
  );
}
