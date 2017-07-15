import { S3CreateEvent, Context } from 'aws-lambda'
import { S3 } from 'aws-sdk'
import { writeFileSync, readFileSync } from 'fs'
import { extname } from 'path'
import { execSync } from 'child_process'

exports.handler = async (event: S3CreateEvent, ctx: Context) => {
  const { bucket, object } = event.Records[0].s3
  if (!['html', 'htm', 'epub'].some(ext => object.key.endsWith(ext))) {
    ctx.fail(new Error("Unsupportd file format."))
    return
  }
  const s3 = new S3()
  const res = await s3.getObject({
    Bucket: bucket.name,
    Key: decodeURIComponent(object.key.replace(/\+/g, ' ')),
  }).promise()
  const basefile = `/tmp/book${extname(object.key)}`
  writeFileSync(basefile, res.Body)
  execSync(`kindlegen ${basefile}`)
  await s3.upload({
    Bucket: bucket.name,
    Key: object.key.replace(/\.\w+$/, ".mobi"),
    Body: readFileSync('book.mobi'),
  }).promise()
  ctx.done()
}
