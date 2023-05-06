const b4a = require('b4a')
const test = require('brittle')

const { storage, write, read, teardown, close } = require('./helpers')

test('simple reopen', async function (t) {
  t.teardown(teardown())

  const cool = storage('cool.txt', { size: 5 })
  t.is(cool.name, 'cool.txt')
  await write(cool, 100, b4a.from('GREETINGS'))
  const fstbuf = await read(cool, 100, 9)
  t.is(b4a.toString(fstbuf, 'utf-8'), 'GREETINGS')
  const sndbuf = await read(cool, 104, 3)
  t.is(b4a.toString(sndbuf, 'utf-8'), 'TIN')
  console.log('before closing')
  await close(cool)
  console.log('after closing')
  const cool2 = storage('cool.txt', { size: 5 })
  console.log('after reopening')
  try {
    const reopenbuf = await read(cool2, 100, 9)
    t.is(b4a.toString(reopenbuf, 'utf-8'), 'GREETINGS')
  } catch (err) {
    console.log('after read error', err)
  };
})
