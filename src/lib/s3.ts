import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const region = process.env.AWS_REGION ?? "us-east-2";
const bucket = process.env.S3_BUCKET ?? "";

let client: S3Client | null = null;

function s3() {
  if (!client) {
    client = new S3Client({ region });
  }
  return client;
}

export function s3Enabled() {
  return Boolean(bucket);
}

export function publicFileUrl(key: string) {
  const base = (process.env.S3_PUBLIC_BASE_URL ?? "").replace(/\/$/, "");
  if (base) return `${base}/${key}`;
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

export async function putImage(key: string, body: Buffer, contentType: string) {
  if (!bucket) {
    throw new Error("S3_BUCKET is not set");
  }
  await s3().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
  return publicFileUrl(key);
}
