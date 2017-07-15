import { S3 } from 'aws-sdk'
import * as mockFs from 'mock-fs'
import upload from '../upload'

const MockS3 = jest.fn<S3>(() => ({
  upload: jest.fn(),
}))

beforeEach(() => {
  mockFs({
    '/tmp/foobar': mockFs.directory({
      items: {
        'book.mobi': 'Awesome book',
      },
    })
  })
})

afterEach(() => {
  mockFs.restore()
})

test('upload successfully', async () => {
  const s3 = new MockS3()
  s3.upload.mockReturnValueOnce({ promise: () => Promise.resolve() })
  await upload('/tmp/foobar/book.mobi', 'bucket', 'path/to/book.mobi', { s3 })
  expect(s3.upload.mock.calls[0][0].Bucket).toBe('bucket')
  expect(s3.upload.mock.calls[0][0].Key).toBe('path/to/book.mobi')
  expect(s3.upload.mock.calls[0][0].Body.toString()).toBe('Awesome book')
})

