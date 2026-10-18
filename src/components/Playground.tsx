import { useRef, useState } from 'react'
import type { PointerEvent, KeyboardEvent, CSSProperties } from 'react'
import './playground.css'

const modes = [
  { id: 'motion', name: 'Движение', number: '01' },
  { id: 'depth', name: 'Глубина', number: '02' },
  { id: 'magnet', name: 'Отклик', number: '03' },
] as const
const curves = {
  smooth: { name: 'Плавно', value: 'cubic-bezier(.22,1,.36,1)' },
  spring: { name: 'С пружиной', value: 'cubic-bezier(.34,1.56,.64,1)' },
  precise: { name: 'Точно', value: 'cubic-bezier(.76,0,.24,1)' },
}

export default function Playground({ paused }: { paused: boolean }) {
  const [mode, setMode] = useState<(typeof modes)[number]['id']>('motion')
  const [curve, setCurve] = useState<keyof typeof curves>('spring')
  const [duration, setDuration] = useState(1.6)
  const [run, setRun] = useState(0)
  const [clicked, setClicked] = useState(false)
  const tiltRef = useRef<HTMLButtonElement>(null)
  const magneticRef = useRef<HTMLButtonElement>(null)
  const keyboardTilt = useRef({ x: 0, y: 0 })

  function tilt(event: PointerEvent<HTMLButtonElement>) {
    if (paused || event.pointerType === 'touch') return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    event.currentTarget.style.setProperty('--tilt-x', `${-y * 24}deg`)
    event.currentTarget.style.setProperty('--tilt-y', `${x * 24}deg`)
    event.currentTarget.style.setProperty('--shine-x', `${(x + 0.5) * 100}%`)
    event.currentTarget.style.setProperty('--shine-y', `${(y + 0.5) * 100}%`)
  }
  function resetTilt() {
    keyboardTilt.current = { x: 0, y: 0 }
    tiltRef.current?.style.setProperty('--tilt-x', '0deg')
    tiltRef.current?.style.setProperty('--tilt-y', '0deg')
  }
  function tiltKeys(event: KeyboardEvent<HTMLButtonElement>) {
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return
    event.preventDefault()
    if (paused) return
    if (event.key === 'ArrowUp') keyboardTilt.current.x += 4
    if (event.key === 'ArrowDown') keyboardTilt.current.x -= 4
    if (event.key === 'ArrowLeft') keyboardTilt.current.y -= 4
    if (event.key === 'ArrowRight') keyboardTilt.current.y += 4
    keyboardTilt.current.x = Math.max(-18, Math.min(18, keyboardTilt.current.x))
    keyboardTilt.current.y = Math.max(-18, Math.min(18, keyboardTilt.current.y))
    event.currentTarget.style.setProperty('--tilt-x', `${keyboardTilt.current.x}deg`)
    event.currentTarget.style.setProperty('--tilt-y', `${keyboardTilt.current.y}deg`)
  }
  function magnet(event: PointerEvent<HTMLDivElement>) {
    if (paused || event.pointerType === 'touch') return
    const bounds = event.currentTarget.getBoundingClientRect()
    magneticRef.current?.style.setProperty(
      '--magnet-x',
      `${(event.clientX - bounds.left - bounds.width / 2) * 0.17}px`,
    )
    magneticRef.current?.style.setProperty(
      '--magnet-y',
      `${(event.clientY - bounds.top - bounds.height / 2) * 0.17}px`,
    )
  }
  function resetMagnet() {
    magneticRef.current?.style.setProperty('--magnet-x', '0px')
    magneticRef.current?.style.setProperty('--magnet-y', '0px')
  }

  function changeMode(next: (typeof modes)[number]['id']) {
    resetTilt()
    resetMagnet()
    setMode(next)
  }

  return (
    <section className="playground section-space" id="lab" data-tone="light">
      <div className="container">
        <div className="section-heading reveal">
          <div>
            <p className="eyebrow">06 / НЕБОЛЬШАЯ ЛАБОРАТОРИЯ</p>
            <h2>
              Теперь —
              <br />
              <span className="serif-word">твоя очередь.</span>
            </h2>
          </div>
          <p className="section-description">
            Три небольших эксперимента с тем, <br />
            как ощущается интерфейс. <br />
            <strong>Здесь всё можно потрогать.</strong>
          </p>
        </div>
        <div className="play-console reveal">
          <div className="play-toolbar">
            <span>
              <i /> INTERACTION LAB
            </span>
            <div className="play-tabs" role="tablist" aria-label="Эксперименты">
              {modes.map((item, index) => (
                <button
                  id={`play-tab-${item.id}`}
                  key={item.id}
                  role="tab"
                  aria-selected={mode === item.id}
                  aria-controls="play-panel"
                  tabIndex={mode === item.id ? 0 : -1}
                  onClick={() => changeMode(item.id)}
                  onKeyDown={(event) => {
                    if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
                      event.preventDefault()
                      const next =
                        event.key === 'Home'
                          ? 0
                          : event.key === 'End'
                            ? 2
                            : (index + (event.key === 'ArrowRight' ? 1 : 2)) % 3
                      changeMode(modes[next].id)
                      document.getElementById(`play-tab-${modes[next].id}`)?.focus()
                    }
                  }}
                >
                  <span>{item.number}</span>
                  {item.name}
                </button>
              ))}
            </div>
            <span className="play-live">
              LIVE <i />
            </span>
          </div>
          <div
            className={`play-panel play-${mode}`}
            id="play-panel"
            role="tabpanel"
            aria-labelledby={`play-tab-${mode}`}
          >
            <div className="play-notes">
              <span className="play-index">
                {modes.find((item) => item.id === mode)?.number} / 03
              </span>
              <h3>
                {mode === 'motion' ? (
                  <>
                    Одинаковый путь.
                    <br />
                    Разные ощущения.
                  </>
                ) : mode === 'depth' ? (
                  <>
                    Всего один слой.
                    <br />А сколько глубины.
                  </>
                ) : (
                  <>
                    Немного физики.
                    <br />
                    Много характера.
                  </>
                )}
              </h3>
              <p>
                {mode === 'motion'
                  ? 'Характер движения меняет восприятие интерфейса. Выбери кривую и запусти переход.'
                  : mode === 'depth'
                    ? 'Проведи курсором по карточке. Поворот и свет следуют за тобой. С клавиатуры — стрелками, Enter сбрасывает наклон.'
                    : 'Кнопка чуть тянется к курсору, чтобы нажатие ощущалось естественнее. Попробуй нажать.'}
              </p>
              {mode === 'motion' ? (
                <>
                  <div className="curve-options" role="group" aria-label="Характер движения">
                    {Object.entries(curves).map(([key, value]) => (
                      <button
                        key={key}
                        aria-pressed={curve === key}
                        onClick={() => {
                          setCurve(key as keyof typeof curves)
                          setRun((value) => value + 1)
                        }}
                      >
                        {value.name}
                      </button>
                    ))}
                  </div>
                  <label className="range-label" htmlFor="motion-duration">
                    Длительность <output>{duration.toFixed(1)} сек</output>
                  </label>
                  <input
                    id="motion-duration"
                    type="range"
                    min=".5"
                    max="3"
                    step=".1"
                    value={duration}
                    onChange={(event) => setDuration(Number(event.target.value))}
                  />
                  <button className="play-replay" onClick={() => setRun((value) => value + 1)}>
                    Запустить движение <span aria-hidden="true">↗</span>
                  </button>
                </>
              ) : (
                <div className="play-instruction">
                  <span aria-hidden="true">{mode === 'depth' ? '↔' : '↖'}</span>
                  <p>
                    {mode === 'depth' ? 'Курсор или стрелки клавиатуры' : 'Курсор или Tab + Enter'}
                  </p>
                </div>
              )}
              <span className="play-motion-status">
                {paused ? 'Движение на паузе — включается в шапке.' : 'Деталь, которую чувствуешь.'}
              </span>
            </div>
            <div className="play-stage">
              <div className="play-stage-grid" aria-hidden="true" />
              <span className="play-stage-label">
                {mode === 'motion'
                  ? 'EASING / STUDY'
                  : mode === 'depth'
                    ? 'DEPTH / STUDY'
                    : 'FEEDBACK / STUDY'}
              </span>
              {mode === 'motion' ? (
                <>
                  <div className="play-orbit-rings" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </div>
                  <div className="play-track">
                    <i className="play-track-start" />
                    <div
                      key={`${curve}-${run}`}
                      className="play-orb"
                      style={
                        {
                          '--travel-duration': `${duration}s`,
                          '--travel-curve': curves[curve].value,
                          animationPlayState: paused ? 'paused' : 'running',
                        } as CSSProperties
                      }
                    >
                      <span />
                    </div>
                    <i className="play-track-end" />
                  </div>
                  <div className="play-track-labels">
                    <span>НАЧАЛО</span>
                    <code>{curves[curve].value}</code>
                    <span>РЕЗУЛЬТАТ</span>
                  </div>
                </>
              ) : mode === 'depth' ? (
                <div className="depth-perspective">
                  <button
                    className="depth-card"
                    ref={tiltRef}
                    onPointerMove={tilt}
                    onPointerLeave={resetTilt}
                    onKeyDown={tiltKeys}
                    onClick={resetTilt}
                    aria-label="Интерактивная карточка: стрелки наклоняют, Enter сбрасывает"
                  >
                    <span className="depth-card-top">
                      Y / PERSONAL EDITION <i>001</i>
                    </span>
                    <strong>
                      MAKE
                      <br />
                      <em>IT FEEL.</em>
                    </strong>
                    <span className="depth-card-bottom">
                      <b>Yeldos.</b>
                      <span>DESIGNED TO REACT ↗</span>
                    </span>
                  </button>
                </div>
              ) : (
                <div className="magnet-field" onPointerMove={magnet} onPointerLeave={resetMagnet}>
                  <div className="magnet-ring" />
                  <div className="magnet-ring second" />
                  <button
                    ref={magneticRef}
                    className="magnet-button"
                    onClick={() => setClicked((value) => !value)}
                    aria-label="Проверить отклик кнопки"
                  >
                    <span>{clicked ? 'Есть контакт.' : 'Поймай момент.'}</span>
                    <span aria-hidden="true">↗</span>
                  </button>
                  <p role="status">
                    {clicked
                      ? 'Вот он — отклик. Ещё раз?'
                      : 'Маленькое движение. Заметная разница.'}
                  </p>
                </div>
              )}
              <span className="play-stage-footer">REACT + CSS + CURIOSITY</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
