import { S3 } from 'aws-sdk'
import * as mockFs from 'mock-fs'
import { readFileSync } from 'fs'
import download from '../download'

const MockS3 = jest.fn<S3>(() => ({
  getObject: jest.fn(),
}))

beforeEach(() => {
  mockFs({
    '/tmp': mockFs.directory({
      items: {},
    })
  })
})

afterEach(() => {
  mockFs.restore()
})

test('download successfully', async () => {
  const s3 = new MockS3()
  s3.getObject.mockReturnValueOnce({
    promise: () => Promise.resolve({ Body: new Buffer("testdoc") }),
  })
  const filepath = await download('bucket', 'path/to/srcbook.epub', { s3 })
  expect(filepath).toBe('/tmp/srcbook.epub')
  expect(readFileSync(filepath).toString()).toBe('testdoc')
})
