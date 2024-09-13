import { PutObjectCommandOutput, S3 } from "@aws-sdk/client-s3";

export async function uploadToS3(
  file: File
): Promise<{ file_key: string; file_name: string }> {
  return new Promise((resolve, reject) => {
    try {
      // AWS.config.update({
      //   accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
      //   secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
      // });
      const s3 = new S3({
        credentials: {
          accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
        },
        region: "ap-southeast-2",
      });
      const file_key =
        "uploads/" + Date.now().toString() + file.name.replace(" ", "-");
      console.log(file_key);

      const params = {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
        Key: file_key,
        Body: file,
      };
      s3.putObject(
        params,
        (err: any, data: PutObjectCommandOutput | undefined) => {
          return resolve({
            file_key,
            file_name: file.name,
          });
        }
      );
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

export function getS3Url(file_key: string) {
  const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.ap-southeast-2.amazonaws.com/${file_key}`;
  return url;
}
