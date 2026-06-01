import { useMemo, useState } from 'react'
import { copyTextToClipboard } from './clipboard'
import {
  formatGames,
  generateGames,
  generateGamesKeepingLocked,
  randomSourceLabel,
  randomSourceWarning,
  type LottoGame,
} from './lotto'

type FeedbackTone = 'neutral' | 'success' | 'warning'

const createInitialGames = (): LottoGame[] => generateGames()

const getBallColorClass = (number: number) => {
  if (number <= 10) return 'ball-yellow'
  if (number <= 20) return 'ball-blue'
  if (number <= 30) return 'ball-red'
  if (number <= 40) return 'ball-gray'
  return 'ball-green'
}

const App = () => {
  const [games, setGames] = useState<LottoGame[]>(createInitialGames)
  const [lockedIndexes, setLockedIndexes] = useState<Set<number>>(() => new Set())
  const [feedback, setFeedback] = useState({
    message: '5게임을 준비했어요. 마음에 들지 않으면 바로 다시 생성해 보세요.',
    tone: 'neutral' as FeedbackTone,
  })

  const shareText = useMemo(() => {
    return ['완전랜덤 로또 번호 생성기', formatGames(games)].join('\n\n')
  }, [games])

  const lockedCount = lockedIndexes.size

  const regenerate = () => {
    if (lockedCount === games.length) {
      setFeedback({
        message: '모든 게임이 고정되어 있어요. 하나 이상 해제하면 새 번호를 만들 수 있어요.',
        tone: 'warning',
      })
      return
    }

    setGames((currentGames) => generateGamesKeepingLocked(currentGames, lockedIndexes))
    setFeedback({
      message:
        lockedCount > 0
          ? `고정한 ${lockedCount}게임은 유지하고 나머지를 새로 생성했어요.`
          : '새로운 5게임을 생성했어요.',
      tone: 'success',
    })
  }

  const toggleLock = (index: number) => {
    const willLock = !lockedIndexes.has(index)

    setLockedIndexes((currentIndexes) => {
      const nextIndexes = new Set(currentIndexes)

      if (willLock) {
        nextIndexes.add(index)
      } else {
        nextIndexes.delete(index)
      }

      return nextIndexes
    })
    setFeedback({
      message: willLock ? `게임 ${index + 1}을 고정했어요.` : `게임 ${index + 1} 고정을 해제했어요.`,
      tone: 'neutral',
    })
  }

  const copyGames = async (
    successMessage = '5게임 번호를 클립보드에 복사했어요.',
    successTone: FeedbackTone = 'success',
  ) => {
    const copied = await copyTextToClipboard(navigator.clipboard, formatGames(games))

    if (copied) {
      setFeedback({
        message: successMessage,
        tone: successTone,
      })
      return true
    }

    setFeedback({
      message: '이 브라우저에서는 복사가 제한돼 있어요. 번호를 직접 길게 눌러 복사해 주세요.',
      tone: 'warning',
    })
    return false
  }

  const shareGames = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: '완전랜덤 로또 번호 생성기',
          text: shareText,
        })
        setFeedback({
          message: '공유 창을 열었어요.',
          tone: 'success',
        })
        return
      }

      await copyGames('이 기기에서는 공유 대신 복사로 준비했어요.')
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        setFeedback({
          message: '공유를 취소했어요. 번호는 그대로 유지돼요.',
          tone: 'neutral',
        })
        return
      }

      await copyGames('공유가 어려워 복사로 대신했어요.', 'warning')
    }
  }

  return (
    <main className="app-shell">
      <section className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">Lotto 6/45</p>
          <h1>완전랜덤 로또 번호 생성기</h1>
          <p className="lead">브라우저 보안 난수로 5게임을 생성합니다. 마음에 드는 조합은 고정하고 나머지만 다시 뽑을 수 있어요.</p>
          <div className="trust-strip" aria-label="서비스 핵심 원칙">
            <span>보안 난수 기반</span>
            <span>예측 없음</span>
            <span>5게임 즉시 생성</span>
          </div>
        </div>

        <div className="action-row">
          <button type="button" className="primary" onClick={regenerate}>다시 생성</button>
          <button type="button" className="secondary" onClick={() => void copyGames()}>복사하기</button>
          <button type="button" onClick={shareGames}>공유하기</button>
        </div>

        <p className={`feedback ${feedback.tone}`} role="status" aria-live="polite" aria-atomic="true">
          {feedback.message}
        </p>
      </section>

      <section className="games-grid" aria-label="생성된 로또 번호 5게임">
        {games.map((game, index) => {
          const isLocked = lockedIndexes.has(index)

          return (
            <article className={`game-card ${isLocked ? 'locked' : ''}`} key={`${index}-${game.join('-')}`}>
              <div className="game-header">
                <span>게임 {index + 1}</span>
                <div className="game-meta">
                  <span>합계 {game.reduce((sum, value) => sum + value, 0).toString().padStart(3, '0')}</span>
                  <button
                    type="button"
                    className="lock-button"
                    aria-pressed={isLocked}
                    onClick={() => toggleLock(index)}
                  >
                    {isLocked ? '고정됨' : '고정'}
                  </button>
                </div>
              </div>
              <div className="ball-row">
                {game.map((number) => (
                  <span key={number} className={`ball ${getBallColorClass(number)}`}>{number}</span>
                ))}
              </div>
            </article>
          )
        })}
      </section>

      <section className="info-grid">
        <article className="info-card trust-card">
          <h2>왜 이 번호가 랜덤이라고 볼 수 있나요?</h2>
          <p>{randomSourceLabel}</p>
          <ul>
            <li>각 게임은 1~45 사이 숫자 6개를 중복 없이 뽑습니다.</li>
            <li>뽑힌 숫자는 오름차순으로 정렬해 보여줍니다.</li>
            <li>예측, 추천, 통계 가중치는 넣지 않습니다.</li>
          </ul>
          {randomSourceWarning ? (
            <p className="warning-text">현재 브라우저가 보안 난수를 지원하지 않아 대체 방식으로 생성 중입니다. 가능하면 최신 브라우저에서 사용해 주세요.</p>
          ) : null}
        </article>

        <article className="info-card caution-card">
          <h2>꼭 알아둘 점</h2>
          <ul>
            <li>이 서비스는 당첨을 예측하지 않습니다.</li>
            <li>모든 번호 조합의 당첨 확률은 동일합니다.</li>
            <li>재미와 개인 선택을 돕는 용도로만 사용하세요.</li>
          </ul>
        </article>
      </section>
    </main>
  )
}

export default App
