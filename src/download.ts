import { S3 } from 'aws-sdk'
import { writeFileSync } from 'fs'
import { basename } from 'path'

/**
 * Downloads an object from S3 and saves it to local folder.
 * @param {string} bucket - The bucket name
 * @param {string} key - The object key
 * @param {S3} s3 - S3 client instance
 * @return {string} Path to downloaded file
 */
export default async function download (
  bucket: string,
  key: string,
  {
    filepath = `/tmp/${basename(key)}`,
    s3 = new S3(),
  }: { filepath?: string, s3?: S3 } = {}
): Promise<string> {
  const res = await s3.getObject({ Bucket: bucket, Key: key }).promise()
  writeFileSync(filepath, res.Body)
  return filepath
}
