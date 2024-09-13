import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { getS3Url } from "@/utils/s3";

import {
  createEmbedding,
  prepareDocument,
  processImage,
} from "@/utils/pinecone";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { downloadFromS3 } from "@/utils/s3-server";

const pinecone = new Pinecone({
  apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY as string,
});
export async function POST(req: Request, res: Response) {
  try {
    console.log(
      "hehe",
      process.env.NEXT_PUBLIC_PINECONE_INDEX_NAME_API_KEY
      // process.env.OPENAI_API_KEY
    );
    const body = await req.json();
    const { files, username, chatname } = body;

    if (!files || !Array.isArray(files) || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const index = pinecone.index(
      process.env.NEXT_PUBLIC_PINECONE_INDEX_NAME as string
    );

    for (const file of files) {
      const { file_key, file_name } = file;
      const fileUrl = getS3Url(file_key);
      console.log(fileUrl);

      let content;
      if (file_name.toLowerCase().endsWith(".pdf")) {
        const file_name = await downloadFromS3(file_key);
        if (!file_name) {
          throw new Error("Could not download from S3");
        }
        console.log("loading pdf into memory" + file_name);
        const loader = new PDFLoader(file_name);
        const pages = await loader.load();

        // 2. split and segment the pdf
        content = prepareDocument(pages);
      } else {
        //@ts-ignore
        content = await processImage(fileUrl);
      }
      console.log("content", content);
      // -------- TILL HERE IT IS WORKING

      const embedding = await createEmbedding(content);
      console.log(embedding);

      await index.namespace(`${username}_${chatname}`).upsert([
        {
          id: file_key,
          //@ts-ignore
          values: embedding,
          // namespace: ,
          metadata: {
            fileName: file_name,
            username: username,
            content: content?.substring(0, 1000), // Store first 1000 characters of content
          },
        },
      ]);
    }

    return NextResponse.json(
      { message: "Files processed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing files:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
