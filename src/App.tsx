import { useMemo, useState } from 'react'
import { formatGames, generateGames, randomSourceLabel, randomSourceWarning, type LottoGame } from './lotto'

type FeedbackTone = 'neutral' | 'success' | 'warning'

const createInitialGames = (): LottoGame[] => generateGames()

const App = () => {
  const [games, setGames] = useState<LottoGame[]>(createInitialGames)
  const [feedback, setFeedback] = useState({
    message: '5게임을 준비했어요. 마음에 들지 않으면 바로 다시 생성해 보세요.',
    tone: 'neutral' as FeedbackTone,
  })

  const shareText = useMemo(() => {
    return ['완전랜덤 로또 번호 생성기', formatGames(games)].join('\n\n')
  }, [games])

  const regenerate = () => {
    setGames(generateGames())
    setFeedback({
      message: '새로운 5게임을 생성했어요.',
      tone: 'success',
    })
  }

  const copyGames = async () => {
    try {
      if (!navigator.clipboard) {
        throw new Error('clipboard unavailable')
      }

      await navigator.clipboard.writeText(formatGames(games))
      setFeedback({
        message: '5게임 번호를 클립보드에 복사했어요.',
        tone: 'success',
      })
    } catch {
      setFeedback({
        message: '이 브라우저에서는 복사가 제한돼 있어요. 번호를 직접 길게 눌러 복사해 주세요.',
        tone: 'warning',
      })
    }
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

      await copyGames()
      setFeedback({
        message: '이 기기에서는 공유 대신 복사로 준비했어요.',
        tone: 'success',
      })
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        setFeedback({
          message: '공유를 취소했어요. 번호는 그대로 유지돼요.',
          tone: 'neutral',
        })
        return
      }

      await copyGames()
      setFeedback({
        message: '공유가 어려워 복사로 대신했어요.',
        tone: 'warning',
      })
    }
  }

  return (
    <main className="app-shell">
      <section className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">Lotto 6/45</p>
          <h1>완전랜덤 로또 번호 생성기</h1>
          <p className="lead">브라우저 보안 난수를 바탕으로 5게임을 바로 생성합니다. 통계나 예측 없이, 매번 새로운 조합만 보여줍니다.</p>
        </div>

        <div className="action-row">
          <button type="button" className="primary" onClick={regenerate}>다시 생성</button>
          <button type="button" onClick={copyGames}>복사하기</button>
          <button type="button" onClick={shareGames}>공유하기</button>
        </div>

        <p className={`feedback ${feedback.tone}`}>{feedback.message}</p>
      </section>

      <section className="games-grid" aria-label="생성된 로또 번호 5게임">
        {games.map((game, index) => (
          <article className="game-card" key={`${index}-${game.join('-')}`}>
            <div className="game-header">
              <span>게임 {index + 1}</span>
              <span>합계 {game.reduce((sum, value) => sum + value, 0).toString().padStart(3, '0')}</span>
            </div>
            <div className="ball-row">
              {game.map((number) => (
                <span key={number} className="ball">{number}</span>
              ))}
            </div>
          </article>
        ))}
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
