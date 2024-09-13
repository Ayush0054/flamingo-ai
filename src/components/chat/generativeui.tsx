import React, { useState, useEffect } from "react";
import { useChat } from "ai/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { SendIcon, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const componentTypes = {
  input: Input,
  textarea: Textarea,
  select: Select,
  checkbox: Checkbox,
  button: Button,
};

function GenerativeUIChat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } =
    useChat();
  const [generatedComponents, setGeneratedComponents] = useState([]);

  const interpretPrompt = (prompt) => {
    const words = prompt.toLowerCase().split(" ");
    const type =
      words.find((word) => Object.keys(componentTypes).includes(word)) ||
      "input";
    const label = words.join(" ");
    return { type, label };
  };

  const generateComponent = (component) => {
    const Component = componentTypes[component.type];
    switch (component.type) {
      case "input":
      case "textarea":
        return (
          <div key={component.id} className="mb-4">
            <Label>{component.label}</Label>
            <Component placeholder={component.label} />
          </div>
        );
      case "select":
        return (
          <div key={component.id} className="mb-4">
            <Label>{component.label}</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder={component.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
                <SelectItem value="option3">Option 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      case "checkbox":
        return (
          <div key={component.id} className="flex items-center space-x-2 mb-4">
            <Checkbox id={`checkbox-${component.id}`} />
            <Label htmlFor={`checkbox-${component.id}`}>
              {component.label}
            </Label>
          </div>
        );
      case "button":
        return (
          <Button key={component.id} className="mb-4">
            {component.label}
          </Button>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (
        lastMessage.role === "assistant" &&
        lastMessage.content.includes("Certainly! I've generated")
      ) {
        const newComponent = interpretPrompt(lastMessage.content);
        setGeneratedComponents((prev) => [
          ...prev,
          { ...newComponent, id: Date.now() },
        ]);
      }
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen w-full">
      <div className="flex-1 overflow-auto p-4">
        <div className="grid gap-4">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
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
                  {message.content}
                </motion.div>
              </div>
              {message.role === "user" && (
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>{message.role[0]}</AvatarFallback>
                </Avatar>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {generatedComponents.length > 0 && (
        <Card className="m-4">
          <CardHeader>
            <CardTitle>Generated UI Components</CardTitle>
          </CardHeader>
          <CardContent>
            {generatedComponents.map(generateComponent)}
          </CardContent>
        </Card>
      )}

      <div className="border-t px-4 py-2">
        <form
          onSubmit={handleSubmit}
          className="relative flex items-center gap-2"
        >
          <Input
            placeholder="Describe the UI component you want..."
            className="min-h-[48px] w-full rounded-2xl resize-none p-4 pr-16 text-sm"
            value={input}
            onChange={handleInputChange}
          />
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
              <SendIcon className="h-4 w-4" />
            )}
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
      {error && (
        <div className="text-red-500 p-2">
          An error occurred: {error.message}
        </div>
      )}
    </div>
  );
}

export default GenerativeUIChat;
