"use client";
import React, { useState } from "react";
import { Search, FileText, ChevronLeft, PlusCircle } from "lucide-react";
import flamingo from "@/assets/flamingo.png";
import Image from "next/image";
const Sidebar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHistory] = useState([
    "what are the biggest risk in plan?",
    "Write a LinkedIn post about this...",
    "who will approve the final budget...",
    "Scan & Pay Shopping",
    "who is Michael L. Green and what...",
    "what is SPOTIFY's main focus as a...",
    "Write summary of this documents...",
    "What is main focus as a commerc...",
    "write description for this docum...",
    "what are the biggest risk in plan?",
  ]);

  return (
    <div className="w-60 bg-red-400 text-white h-screen p-4 flex flex-col">
      <div className="flex items-center mb-6 gap-3">
        <Image src={flamingo} height={40} width={40} alt="img" />
        <span className="text-2xl text-gray-950 font-bold  ">Flamingo</span>
      </div>

      <button className="bg-blue-500 text-white py-2 px-4 rounded-md mb-4 flex items-center justify-center">
        <PlusCircle className="mr-2" size={18} />
        New Document
      </button>

      <div className="relative mb-4">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-gray-800 rounded-md py-2 pl-10 pr-4 text-white placeholder-gray-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="mb-4 flex items-center text-gray-700">
        <ChevronLeft size={18} />
        <FileText size={18} className="mx-2" />
        <span className="text-sm">Product Requir...</span>
      </div>

      <div className="flex-grow overflow-y-auto">
        <h3 className="text-gray-700 text-sm mb-2">Search History</h3>
        <h4 className="text-gray-800 text-xs mb-2">Today</h4>
        <ul>
          {searchHistory.map((query, index) => (
            <li key={index} className="mb-2 flex items-center text-sm">
              <Search size={14} className="mr-2 text-gray-700" />
              {query}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
