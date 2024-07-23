"use client";
import ChatScreen from "@/components/chat/chat-screen";
import Sidebar from "@/components/chat/sidebar";
import React from "react";

function Page() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <ChatScreen />
    </div>
  );
}

export default Page;
