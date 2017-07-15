import convert from '../convert'

test('convert successfully', async () => {
  const execFn = jest.fn((_0, _1, cb) => cb())
  const filepath = await convert('/tmp/foobar/srcbook.epub', 'destbook.mobi', execFn)
  expect(execFn.mock.calls[0][0]).toBe('./kindlegen')
  expect(execFn.mock.calls[0][1].join(' ')).toBe('/tmp/foobar/srcbook.epub -o destbook.mobi')
  expect(filepath).toBe('/tmp/foobar/destbook.mobi')
})
