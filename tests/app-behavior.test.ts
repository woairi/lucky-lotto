import assert from 'node:assert/strict'
import test from 'node:test'
import { copyTextToClipboard } from '../src/clipboard.ts'
import { generateGamesKeepingLocked, type LottoGame } from '../src/lotto.ts'

const sampleGames: LottoGame[] = [
  [1, 2, 3, 4, 5, 6],
  [7, 8, 9, 10, 11, 12],
  [13, 14, 15, 16, 17, 18],
]

test('generateGamesKeepingLocked keeps locked games and regenerates unlocked games', () => {
  const generatedGames: LottoGame[] = [
    [21, 22, 23, 24, 25, 26],
    [31, 32, 33, 34, 35, 36],
  ]
  let generatedIndex = 0

  const result = generateGamesKeepingLocked(sampleGames, new Set([1]), () => generatedGames[generatedIndex++])

  assert.deepEqual(result, [
    [21, 22, 23, 24, 25, 26],
    [7, 8, 9, 10, 11, 12],
    [31, 32, 33, 34, 35, 36],
  ])
  assert.equal(generatedIndex, 2)
})

test('copyTextToClipboard reports success only when clipboard write succeeds', async () => {
  let copiedText = ''
  const success = await copyTextToClipboard({
    writeText: async (text) => {
      copiedText = text
    },
  }, '1게임: 1, 2, 3, 4, 5, 6')

  assert.equal(success, true)
  assert.equal(copiedText, '1게임: 1, 2, 3, 4, 5, 6')

  const missingClipboard = await copyTextToClipboard(undefined, 'text')
  assert.equal(missingClipboard, false)

  const rejectedWrite = await copyTextToClipboard({
    writeText: async () => {
      throw new Error('denied')
    },
  }, 'text')
  assert.equal(rejectedWrite, false)
})
