import { S3CreateEvent, Context } from 'aws-lambda'

import download from './download'
import convert from './convert'
import upload from './upload'

exports.handler = async (event: S3CreateEvent, ctx: Context) => {
  const { bucket, object } = event.Records[0].s3
  if (!['html', 'htm', 'epub'].some(ext => object.key.endsWith(ext))) {
    ctx.fail(new Error("Unsupportd file format."))
    return
  }
  const key = decodeURIComponent(object.key.replace(/\+/g, ' '))
  const srcpath = await download(bucket.name, key)
  const destpath = await convert(srcpath)
  await upload(destpath, bucket.name, key.replace(/\.\w+$/, ".mobi"))
  ctx.done()
}
