import { createEmbedding } from "@/utils/pinecone";
import { openai } from "@ai-sdk/openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;
const pinecone = new Pinecone({
  apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY as string,
});
const index = pinecone.index(
  process.env.NEXT_PUBLIC_PINECONE_INDEX_NAME as string
);

export async function POST(req: Request) {
  const { messages } = await req.json();
  const lastMessage = messages[messages.length - 1].content;

  console.log("Last message:", lastMessage);
  const embeddedMessage = await createEmbedding(lastMessage);

  const queryResponse = await index.namespace("ayush_first").query({
    vector: embeddedMessage,
    topK: 5,
    includeMetadata: true, // Make sure to include metadata
  });

  console.log(
    "Pinecone query response:",
    JSON.stringify(queryResponse, null, 2)
  );

  const context = queryResponse.matches
    .map((match) => match.metadata?.content || "")
    .filter((content) => content !== "")
    .join("\n");

  console.log("Extracted context:", context);

  if (context === "") {
    console.warn("No context found in Pinecone matches");
  }

  const augmentedMessages = [
    {
      role: "system",
      content: `You are a helpful AI assistant. Use the following context to answer the user's questions: ${context}`,
    },
    ...messages,
  ];

  console.log(
    "Augmented messages:",
    JSON.stringify(augmentedMessages, null, 2)
  );

  const result = await streamText({
    model: openai("gpt-4-turbo"),
    messages: augmentedMessages,
  });

  return result.toAIStreamResponse();
}
