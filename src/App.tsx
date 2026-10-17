import { useEffect, useRef, useState } from 'react'
import Sculpture from './components/Sculpture'
import Projects from './components/Projects'

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="icon">
      {diagonal ? <path d="M6 18 18 6M6 6h12v12" /> : <path d="M4 12h15m-6-6 6 6-6 6" />}
    </svg>
  )
}

const navigation = [
  ['projects', 'Проекты'],
  ['about', 'Обо мне'],
  ['expertise', 'Стек'],
  ['lab', 'Лаборатория'],
] as const

const expertise = [
  {
    name: 'Интерфейсы',
    number: '01',
    title: 'От первого пикселя до последнего состояния.',
    description:
      'Собираю адаптивные интерфейсы на React и Next.js. Продумываю структуру компонентов, работу с данными и поведение на каждом экране.',
    tags: ['React', 'Next.js', 'TypeScript', 'HTML & CSS'],
  },
  {
    name: 'Движение и 3D',
    number: '02',
    title: 'Когда интерфейс становится впечатлением.',
    description:
      'Исследую анимации, пространственные интерфейсы и интерактивные сцены. Движение помогает понять действие и почувствовать отклик.',
    tags: ['Three.js', 'React Three Fiber', 'Motion', 'WebGL'],
  },
  {
    name: 'Логика продукта',
    number: '03',
    title: 'Красиво снаружи. Продумано внутри.',
    description:
      'Соединяю экраны с API, работаю с состоянием, поиском и пользовательскими сценариями. Учитываю загрузку, ошибки и пустые результаты.',
    tags: ['REST API', 'Zustand', 'Prisma', 'PostgreSQL'],
  },
  {
    name: 'Качество и процесс',
    number: '04',
    title: 'Детали, из которых складывается результат.',
    description:
      'Использую Git, внимательно отношусь к семантике и доступности. Проверяю адаптивность, читаемость кода и предсказуемость взаимодействий.',
    tags: ['Git & GitHub', 'Figma', 'Accessibility', 'Responsive UI'],
  },
]

function MotionLab({ paused }: { paused: boolean }) {
  const [curve, setCurve] = useState('smooth')
  const [duration, setDuration] = useState(1.4)
  const [run, setRun] = useState(0)
  const curves: Record<string, { name: string; css: string; path: string }> = {
    smooth: {
      name: 'Плавно',
      css: 'cubic-bezier(0.22, 1, 0.36, 1)',
      path: 'M24 160 C58 18 85 20 196 20',
    },
    spring: {
      name: 'Пружина',
      css: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      path: 'M24 160 C80 -20 135 -15 196 20',
    },
    precise: {
      name: 'Точно',
      css: 'cubic-bezier(0.76, 0, 0.24, 1)',
      path: 'M24 160 C160 160 60 20 196 20',
    },
  }
  const selected = curves[curve]
  return (
    <section className="lab section-space" id="lab">
      <div className="container">
        <div className="section-heading reveal">
          <div>
            <p className="eyebrow">05 / PLAYGROUND</p>
            <h2>
              Чуть больше
              <br />
              <span className="text-muted">чем просто код.</span>
            </h2>
          </div>
          <p className="section-description">
            Здесь можно потрогать движение.
            <br />
            Выбери характер, настрой скорость —<br />и посмотри, как меняется ощущение.
          </p>
        </div>
        <div className="motion-lab reveal">
          <div className="lab-controls">
            <div className="lab-label">
              <span className="status-dot" /> MOTION STUDY — 001
            </div>
            <h3>
              У движения
              <br />
              есть характер.
            </h3>
            <div className="segmented" role="group" aria-label="Характер анимации">
              {Object.entries(curves).map(([key, value]) => (
                <button
                  key={key}
                  aria-pressed={curve === key}
                  onClick={() => {
                    setCurve(key)
                    setRun(run + 1)
                  }}
                >
                  {value.name}
                </button>
              ))}
            </div>
            <label className="range-label" htmlFor="duration">
              Длительность <span>{duration.toFixed(1)} сек</span>
            </label>
            <input
              id="duration"
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={duration}
              onChange={(event) => setDuration(Number(event.target.value))}
            />
            <button className="button button-secondary replay" onClick={() => setRun(run + 1)}>
              Повторить анимацию <span aria-hidden="true">↻</span>
            </button>
            <p className="lab-footnote">
              {paused
                ? 'Анимации приостановлены. Включить их можно в шапке.'
                : 'Маленькие детали. Большая разница.'}
            </p>
          </div>
          <div className="lab-stage">
            <span className="stage-label">INTERACTION / {selected.name.toUpperCase()}</span>
            <svg
              className="curve-graph"
              viewBox="0 0 220 180"
              role="img"
              aria-label={`Кривая анимации: ${selected.name}`}
            >
              <path className="curve-grid" d="M24 20v140h172M24 90h172M110 20v140" />
              <path className="curve-line" d={selected.path} />
              <circle cx="24" cy="160" r="4" />
              <circle cx="196" cy="20" r="4" />
            </svg>
            <div className="lab-track">
              <span className="track-start" />
              <div
                key={`${curve}-${run}`}
                className="motion-orb"
                style={{
                  animationDuration: `${duration}s`,
                  animationTimingFunction: selected.css,
                  animationPlayState: paused ? 'paused' : 'running',
                }}
              />
              <span className="track-end" />
            </div>
            <div className="stage-bottom">
              <span>START</span>
              <code>{selected.css}</code>
              <span>END</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [paused, setPaused] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [tone, setTone] = useState<'silver' | 'emerald'>('silver')
  const [activeSection, setActiveSection] = useState('')
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const progressRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    document.documentElement.dataset.motion = paused ? 'paused' : 'active'
  }, [paused])

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setPaused(preference.matches)
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            revealObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08 },
    )
    document.querySelectorAll('.reveal').forEach((element) => {
      element.classList.add('will-reveal')
      revealObserver.observe(element)
    })
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: '-15% 0px -65% 0px' },
    )
    document
      .querySelectorAll('main section[id]')
      .forEach((section) => sectionObserver.observe(section))
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        const height = document.documentElement.scrollHeight - window.innerHeight
        if (progressRef.current)
          progressRef.current.style.transform = `scaleX(${height > 0 ? window.scrollY / height : 0})`
        frame = 0
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      revealObserver.disconnect()
      sectionObserver.disconnect()
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
      clearTimeout(copyTimer.current)
    }
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen])

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText('eldosegimbaev606@gmail.com')
      setCopied(true)
      setCopyError(false)
      clearTimeout(copyTimer.current)
      copyTimer.current = setTimeout(() => setCopied(false), 2500)
    } catch {
      setCopyError(true)
    }
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Перейти к содержимому
      </a>
      <header className="site-header">
        <div className="scroll-progress" ref={progressRef} />
        <div className="header-inner container">
          <a href="#top" className="wordmark" aria-label="Yeldos — на главную">
            yeldos<span>®</span>
          </a>
          <nav
            id="navigation"
            aria-label="Основная навигация"
            className={menuOpen ? 'navigation is-open' : 'navigation'}
          >
            {navigation.map(([id, label]) => (
              <a
                href={`#${id}`}
                key={id}
                className={activeSection === id ? 'active' : ''}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            ))}
            <a href="#contact" className="mobile-contact" onClick={() => setMenuOpen(false)}>
              Контакты
            </a>
          </nav>
          <div className="header-actions">
            <button
              className="motion-toggle"
              onClick={() => setPaused(!paused)}
              aria-label={paused ? 'Включить анимации' : 'Приостановить анимации'}
              aria-pressed={paused}
              title={paused ? 'Включить анимации' : 'Приостановить анимации'}
            >
              {paused ? (
                <svg className="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="m9 5 10 7-10 7z" />
                </svg>
              ) : (
                <svg className="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M8 5v14M16 5v14" />
                </svg>
              )}
            </button>
            <a
              className="header-contact"
              href="https://t.me/Yeldomr"
              target="_blank"
              rel="noreferrer"
            >
              Обсудим проект <Arrow diagonal />
            </a>
            <button
              ref={menuButtonRef}
              className="menu-toggle"
              aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
              aria-expanded={menuOpen}
              aria-controls="navigation"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>
      <main id="main">
        <section className="hero" id="top">
          <div className="hero-glow" aria-hidden="true" />
          <div className="container hero-content">
            <div className="hero-copy">
              <div className="hero-kicker">
                <span className="status-dot" /> FRONTEND DEVELOPER & CREATIVE MIND
              </div>
              <h1>
                Код.
                <br />
                Форма.
                <br />
                <span>Впечатление.</span>
              </h1>
              <p className="hero-description">
                Привет, я <strong>Yeldos</strong>. Создаю цифровой опыт,
                <br className="desktop-break" /> в котором продумана каждая деталь.
              </p>
              <div className="hero-buttons">
                <a className="button button-primary" href="#projects">
                  Смотреть проекты <Arrow />
                </a>
                <a className="hero-about" href="#about">
                  Ближе познакомиться <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
            <div className="hero-art">
              <div className="sculpture-frame">
                <Sculpture paused={paused} tone={tone} />
              </div>
              <div className="art-label">
                <span className="art-cross" aria-hidden="true">
                  +
                </span>
                <span>
                  FORM FOLLOWS CURIOSITY
                  <br />
                  <span className="text-muted">Интерактивная форма. Живой код.</span>
                </span>
              </div>
              <div className="material-control" role="group" aria-label="Материал 3D-фигуры">
                <button
                  className="material-swatch silver"
                  aria-pressed={tone === 'silver'}
                  aria-label="Серебряный материал"
                  onClick={() => setTone('silver')}
                />
                <button
                  className="material-swatch emerald"
                  aria-pressed={tone === 'emerald'}
                  aria-label="Изумрудный материал"
                  onClick={() => setTone('emerald')}
                />
                <span>{tone === 'silver' ? 'SILVER' : 'EMERALD'}</span>
              </div>
            </div>
          </div>
          <div className="hero-bottom container">
            <span>
              БАЗИРУЮСЬ В КАЗАХСТАНЕ <span className="tiny-star">✳</span> СОЗДАЮ ДЛЯ МИРА
            </span>
            <a href="#projects">
              SCROLL TO EXPLORE <span aria-hidden="true">↓</span>
            </a>
            <span>PORTFOLIO — 2026</span>
          </div>
        </section>
        <div className="stack-ribbon" aria-label="Основные технологии">
          <div className="container">
            <span>МОЙ НАБОР ИНСТРУМЕНТОВ</span>
            <span className="stack-word">React</span>
            <span className="stack-word">Next.js</span>
            <span className="stack-word">TypeScript</span>
            <span className="stack-word">Three.js</span>
            <span className="stack-word">Figma</span>
            <span className="stack-word">Git</span>
          </div>
        </div>
        <Projects />
        <section className="about section-space" id="about">
          <div className="container">
            <div className="section-heading reveal">
              <div>
                <p className="eyebrow">02 / ЗА ИНТЕРФЕЙСОМ</p>
                <h2>
                  Разработчик.
                  <br />
                  <span className="text-muted">По природе — создатель.</span>
                </h2>
              </div>
            </div>
            <div className="about-grid">
              <div className="about-portrait reveal">
                <div className="portrait-grid" aria-hidden="true" />
                <div className="monogram" aria-hidden="true">
                  Y<span>.</span>
                </div>
                <div className="portrait-caption">
                  <span>YELDOS YEGIMBAYEV</span>
                  <span>FRONTEND DEVELOPER</span>
                </div>
                <span className="portrait-location">
                  <span className="status-dot" /> Kazakhstan
                </span>
              </div>
              <div className="about-copy reveal">
                <p className="about-lead">
                  Мне нравится момент,
                  <br />
                  когда идея <span>становится живой.</span>
                </p>
                <p>
                  Я Елдос Егимбаев, frontend-разработчик из Казахстана. Превращаю макеты в
                  адаптивные интерфейсы и соединяю визуальную аккуратность с понятной логикой.
                </p>
                <p>
                  Мой интерес — на пересечении разработки и дизайна: от удобных React-приложений до
                  браузерных операционных систем и интерактивных 3D-миров.
                </p>
                <a
                  className="text-link"
                  href="https://github.com/TheYeldo"
                  target="_blank"
                  rel="noreferrer"
                >
                  Больше обо мне в GitHub <Arrow diagonal />
                </a>
                <div className="about-facts">
                  <div>
                    <span>ФОКУС</span>
                    <strong>Frontend & UI</strong>
                  </div>
                  <div>
                    <span>ПОДХОД</span>
                    <strong>Внимание к деталям</strong>
                  </div>
                </div>
              </div>
            </div>
            <div className="principles">
              <article className="reveal">
                <span className="principle-symbol">✳</span>
                <h3>Смысл прежде эффекта.</h3>
                <p>Каждая анимация и каждый элемент помогают пользователю двигаться дальше.</p>
              </article>
              <article className="reveal">
                <span className="principle-symbol">⌘</span>
                <h3>Красота в системе.</h3>
                <p>Чистая структура, переиспользуемые компоненты и предсказуемое поведение.</p>
              </article>
              <article className="reveal">
                <span className="principle-symbol">↗</span>
                <h3>Любопытство как навык.</h3>
                <p>Новые технологии — повод исследовать, пробовать и создавать что-то своё.</p>
              </article>
            </div>
          </div>
        </section>
        <section className="expertise section-space" id="expertise">
          <div className="container expertise-layout">
            <div className="expertise-intro reveal">
              <p className="eyebrow">03 / ЭКСПЕРТИЗА</p>
              <h2>
                Не только
                <br />
                <span className="text-muted">красивый экран.</span>
              </h2>
              <p>
                Инструменты меняются.
                <br />
                Внимание к опыту — остаётся.
              </p>
              <div className="code-emblem" aria-hidden="true">
                {'{ }'}
                <span>BUILT WITH INTENTION</span>
              </div>
            </div>
            <div className="expertise-list reveal">
              {expertise.map((item, index) => (
                <details key={item.name} name="expertise" open={index === 0 ? true : undefined}>
                  <summary>
                    <span className="item-number">{item.number}</span>
                    <h3>{item.name}</h3>
                    <span className="details-plus" aria-hidden="true">
                      +
                    </span>
                  </summary>
                  <div className="expertise-detail">
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                    <div className="tags">
                      {item.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
        <section className="process section-space" id="process">
          <div className="container">
            <div className="section-heading reveal">
              <div>
                <p className="eyebrow">04 / ПРОЦЕСС</p>
                <h2>
                  От «а что, если»
                  <br />
                  <span className="text-muted">до «вот, попробуй».</span>
                </h2>
              </div>
              <p className="section-description">
                Понятный путь от задачи до результата.
                <br />С диалогом на каждом этапе.
              </p>
            </div>
            <div className="process-grid">
              {[
                [
                  '01',
                  'Понять',
                  'Погружаюсь в задачу, обсуждаю цель, аудиторию и сценарии использования.',
                ],
                [
                  '02',
                  'Продумать',
                  'Собираю структуру, определяю визуальный язык и поведение интерфейса.',
                ],
                [
                  '03',
                  'Создать',
                  'Пишу компоненты, соединяю логику и добавляю движение там, где оно нужно.',
                ],
                [
                  '04',
                  'Отточить',
                  'Проверяю на разных экранах, прорабатываю состояния и учитываю обратную связь.',
                ],
              ].map(([number, title, description]) => (
                <article className="process-step reveal" key={number}>
                  <div className="process-top">
                    <span>{number}</span>
                    <Arrow />
                  </div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <MotionLab paused={paused} />
        <section className="contact section-space" id="contact">
          <div className="container">
            <div className="contact-top reveal">
              <p className="eyebrow">
                <span className="status-dot" /> ОТКРЫТ К ДИАЛОГУ И НОВЫМ ИДЕЯМ
              </p>
              <span className="contact-spark" aria-hidden="true">
                ✳
              </span>
            </div>
            <div className="contact-main reveal">
              <h2>
                Следующий проект
                <br />
                может быть <span>нашим.</span>
              </h2>
              <a
                className="contact-round"
                href="https://t.me/Yeldomr"
                target="_blank"
                rel="noreferrer"
                aria-label="Обсудить проект в Telegram"
              >
                <Arrow diagonal />
              </a>
            </div>
            <div className="contact-bottom reveal">
              <p>
                Есть идея, задача или просто хочется сказать привет?
                <br />
                Давай начнём с разговора.
              </p>
              <div className="contact-links">
                <a href="https://t.me/Yeldomr" target="_blank" rel="noreferrer">
                  Telegram <Arrow diagonal />
                </a>
                <a href="mailto:eldosegimbaev606@gmail.com">
                  Email <Arrow diagonal />
                </a>
                <button onClick={copyEmail} aria-label="Скопировать email">
                  {copied ? 'Скопировано ✓' : 'Копировать email'}
                </button>
                <span className="sr-only" role="status">
                  {copied
                    ? 'Email скопирован'
                    : copyError
                      ? 'Не удалось скопировать. Email: eldosegimbaev606@gmail.com'
                      : ''}
                </span>
              </div>
            </div>
            {copyError ? (
              <p className="copy-error">Можно скопировать вручную: eldosegimbaev606@gmail.com</p>
            ) : null}
          </div>
        </section>
      </main>
      <footer className="footer">
        <div className="container footer-inner">
          <a className="wordmark" href="#top" aria-label="Yeldos — наверх">
            yeldos<span>®</span>
          </a>
          <p>© {new Date().getFullYear()} Yeldos. Сделано с вниманием.</p>
          <div>
            <a href="https://github.com/TheYeldo" target="_blank" rel="noreferrer">
              GitHub <Arrow diagonal />
            </a>
            <a href="#top">
              Наверх <span aria-hidden="true">↑</span>
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}
