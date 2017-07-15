import { S3 } from 'aws-sdk'
import { readFileSync } from 'fs'

/**
 * Upload local file to S3
 * @param filepath - Path to the file for uploading
 * @param bucket - The S3 bucket name
 * @param key - The S3 object key
 */
export default async function upload (
  filepath: string,
  bucket: string,
  key: string,
  { s3 = new S3() }: { s3?: S3 } = {},
) {
  await s3.upload({ Bucket: bucket, Key: key, Body: readFileSync(filepath) }).promise()
}
