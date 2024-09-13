import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";
import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const pinecone = new Pinecone({
  apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY as string,
});

export async function processImage(imageUrl: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "Describe this image in detail." },
          { type: "image_url", image_url: { url: imageUrl } },
        ],
      },
    ],
  });
  return response.choices[0].message.content;
}

export async function createEmbedding(text: string) {
  console.log(
    "Input for embedding (first 100 characters):",
    text.substring(0, 100)
  );

  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });

    console.log("Embedding created successfully");
    return response.data[0].embedding;
  } catch (error) {
    console.error("Error creating embedding:", error);
    throw error;
  }
}
export const truncateStringByBytes = (str: string, bytes: number) => {
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};

export function prepareDocument(documents: Document[]) {
  // Combine all pageContent into a single string
  const combinedContent = documents
    .map((doc) => doc.pageContent.replace(/\n/g, " "))
    .join(" ");

  // Truncate the combined content if needed
  return truncateStringByBytes(combinedContent, 36000);
}
