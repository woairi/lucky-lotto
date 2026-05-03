export type LottoGame = number[]

const GAME_COUNT = 5
const NUMBER_COUNT = 6
const MIN_NUMBER = 1
const MAX_NUMBER = 45

const hasCryptoRandom = () =>
  typeof globalThis.crypto !== 'undefined' && typeof globalThis.crypto.getRandomValues === 'function'

const randomInt = (min: number, max: number) => {
  if (!hasCryptoRandom()) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  const range = max - min + 1
  const maxUint = 0xffffffff
  const cutoff = maxUint - ((maxUint + 1) % range)
  const buffer = new Uint32Array(1)

  while (true) {
    globalThis.crypto.getRandomValues(buffer)
    const value = buffer[0]

    if (value <= cutoff) {
      return min + (value % range)
    }
  }
}

const generateGame = (): LottoGame => {
  const picked = new Set<number>()

  while (picked.size < NUMBER_COUNT) {
    picked.add(randomInt(MIN_NUMBER, MAX_NUMBER))
  }

  return [...picked].sort((a, b) => a - b)
}

export const generateGames = (count = GAME_COUNT): LottoGame[] =>
  Array.from({ length: count }, () => generateGame())

export const formatGames = (games: LottoGame[]) =>
  games.map((game, index) => `${index + 1}게임: ${game.join(', ')}`).join('\n')

export const randomSourceLabel = hasCryptoRandom()
  ? '브라우저 보안 난수(crypto.getRandomValues) 기반'
  : '보안 난수를 지원하지 않아 Math.random fallback 사용'

export const randomSourceWarning = !hasCryptoRandom()
