import { useEffect, useRef, useState } from 'react'
import Signature from './components/Signature'
import Projects from './components/Projects'
import BeyondBrowser from './components/BeyondBrowser'
import Playground from './components/Playground'
import CommandMenu from './components/CommandMenu'

export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg className="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'M4 12h15m-6-6 6 6-6 6'} />
    </svg>
  )
}

const navigation = [
  ['projects', 'Работы'],
  ['about', 'Обо мне'],
  ['expertise', 'Подход'],
  ['lab', 'Playground'],
] as const
const expertise = [
  {
    title: 'Интерфейс как система',
    label: '01 / FRONTEND',
    description:
      'Компоненты, состояние, данные и все состояния между ними. Собираю интерфейсы, которые остаются понятными, когда продукт становится сложнее.',
    tools: ['React', 'Next.js', 'TypeScript', 'Zustand'],
    proof: 'В YeldoOS окна, темы и настройки работают как части одной системы.',
    href: 'https://github.com/TheYeldo/yeldo-os',
  },
  {
    title: 'Движение с намерением',
    label: '02 / INTERACTION',
    description:
      'Переходы объясняют, что изменилось. Глубина помогает ориентироваться. А 3D создаёт пространство, которое хочется исследовать.',
    tools: ['Motion', 'Three.js', 'React Three Fiber', 'WebGL'],
    proof: 'В Programming Simulator комната превращается в рабочую среду.',
    href: 'https://github.com/TheYeldo/programming-simulator',
  },
  {
    title: 'Логика за красивым экраном',
    label: '03 / PRODUCT',
    description:
      'Поиск, фильтры, API и сохранённое состояние. Продумываю не только удачный путь, но и загрузку, отсутствие данных и ошибки.',
    tools: ['REST API', 'Prisma', 'PostgreSQL', 'Git'],
    proof: 'В Taytlo каталог связывает тайтлы, жанры, франшизы и личные списки.',
    href: 'https://github.com/TheYeldo/taytlo',
  },
]

export default function App() {
  const [paused, setPaused] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [tone, setTone] = useState<'titanium' | 'obsidian'>('titanium')
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [expertiseIndex, setExpertiseIndex] = useState(0)
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle')
  const [briefType, setBriefType] = useState('Продуктовая команда')
  const headerRef = useRef<HTMLElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const storyRef = useRef<HTMLElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const explicitMotion = useRef(false)

  useEffect(() => {
    document.documentElement.dataset.motion = paused ? 'paused' : 'active'
  }, [paused])

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {
      if (!explicitMotion.current) setPaused(media.matches)
    }
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08 },
    )
    document.querySelectorAll('.reveal').forEach((el) => {
      el.classList.add('will-reveal')
      observer.observe(el)
    })
    const sections = Array.from(document.querySelectorAll<HTMLElement>('main > section[id]'))
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: '-20% 0px -65% 0px' },
    )
    sections.forEach((section) => sectionObserver.observe(section))
    let frame = 0
    const updateScroll = () => {
      frame = 0
      const vh = window.innerHeight
      const y = window.scrollY
      const max = document.documentElement.scrollHeight - vh
      progressRef.current?.style.setProperty('transform', `scaleX(${max > 0 ? y / max : 0})`)
      const motion = document.documentElement.dataset.motion !== 'paused'
      const hero = heroRef.current
      if (hero)
        hero.style.setProperty(
          '--hero-progress',
          String(motion ? Math.min(y / hero.offsetHeight, 1) : 0),
        )
      const story = storyRef.current
      if (story) {
        const rect = story.getBoundingClientRect()
        const p = Math.max(0, Math.min(1, (vh * 0.72 - rect.top) / (rect.height - vh * 0.25)))
        story.style.setProperty('--story-progress', String(motion ? p : 1))
        story.dataset.step = p < 0.34 ? '1' : p < 0.67 ? '2' : '3'
      }
      let theme = 'light'
      for (const section of sections) {
        const bounds = section.getBoundingClientRect()
        if (bounds.top <= 70 && bounds.bottom > 70) {
          theme = section.dataset.tone || 'light'
          break
        }
      }
      if (headerRef.current) headerRef.current.dataset.tone = theme
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(updateScroll)
    }
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    schedule()
    return () => {
      observer.disconnect()
      sectionObserver.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      cancelAnimationFrame(frame)
      clearTimeout(copyTimer.current)
    }
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    navRef.current?.querySelector<HTMLAnchorElement>('a')?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen])

  function toggleMotion() {
    explicitMotion.current = true
    setPaused((value) => !value)
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText('eldosegimbaev606@gmail.com')
      setCopyState('copied')
      clearTimeout(copyTimer.current)
      copyTimer.current = setTimeout(() => setCopyState('idle'), 2500)
    } catch {
      setCopyState('error')
    }
  }

  const selectedExpertise = expertise[expertiseIndex]
  const telegramMessage = encodeURIComponent(
    `Привет, Yeldos! Хочу обсудить: ${briefType.toLowerCase()}.`,
  )
  return (
    <>
      <a className="skip-link" href="#main">
        Перейти к содержимому
      </a>
      <header ref={headerRef} className="site-header" data-tone="light">
        <div ref={progressRef} className="scroll-progress" />
        <div className="header-inner container">
          <a className="wordmark" href="#top" aria-label="Yeldos — на главную">
            <svg viewBox="0 0 28 28" aria-hidden="true">
              <path d="M5 4h6l3 7 3-7h6l-6 13v7h-6v-7z" fill="currentColor" />
            </svg>
            yeldos<span className="wordmark-period">.</span>
          </a>
          <nav
            ref={navRef}
            id="navigation"
            className={`navigation${menuOpen ? ' is-open' : ''}`}
            aria-label="Основная навигация"
          >
            {navigation.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                aria-current={activeSection === id ? 'location' : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            ))}
            <a className="mobile-contact" href="#contact" onClick={() => setMenuOpen(false)}>
              Контакты
            </a>
          </nav>
          <div className="header-actions">
            <CommandMenu />
            <button
              className="motion-toggle"
              onClick={toggleMotion}
              aria-label={paused ? 'Включить анимации' : 'Приостановить анимации'}
              aria-pressed={paused}
              title={paused ? 'Включить анимации' : 'Приостановить анимации'}
            >
              <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none">
                <path d={paused ? 'm9 5 10 7-10 7z' : 'M8 6v12M16 6v12'} />
              </svg>
            </button>
            <a className="header-contact" href="#contact">
              Есть идея? <Arrow diagonal />
            </a>
            <button
              ref={menuButtonRef}
              className="menu-toggle"
              aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
              aria-controls="navigation"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((value) => !value)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>
      <main id="main">
        <section ref={heroRef} className="hero" id="top" data-tone="light">
          <div className="hero-grid container">
            <div className="hero-copy">
              <p className="hero-eyebrow">
                <span className="status-dot" /> FRONTEND DEVELOPER{' '}
                <span className="hero-location">АЛМАТЫ, KZ</span>
              </p>
              <h1>
                <span className="hero-name">Yeldos.</span>
                <span className="hero-title">
                  Делаю веб
                  <br />
                  <span className="hero-title-soft">ощутимым.</span>
                </span>
              </h1>
              <p className="hero-description">
                Пишу код. Чувствую форму.
                <br />
                Превращаю идеи в интерфейсы, которыми хочется пользоваться.
              </p>
              <div className="hero-buttons">
                <a className="button button-primary" href="#projects">
                  Исследовать работы <Arrow />
                </a>
                <a className="text-link" href="#about">
                  Кто за этим стоит <span aria-hidden="true">↗</span>
                </a>
              </div>
              <div className="hero-stack">
                <span>REACT</span>
                <i />
                <span>TYPESCRIPT</span>
                <i />
                <span>NEXT.JS</span>
              </div>
            </div>
            <div className="hero-visual">
              <span className="visual-coordinate coordinate-top">SIGNATURE / 001</span>
              <span className="visual-coordinate coordinate-right">DESIGNED IN CODE</span>
              <div className="signature-stage">
                <Signature paused={paused} tone={tone} />
              </div>
              <div className="signature-caption">
                <span className="tiny-cross" aria-hidden="true">
                  +
                </span>
                <p>
                  Моя буква. Мой подход.
                  <br />
                  <span>Наведи курсор — форма откликнется.</span>
                </p>
              </div>
              <div className="material-control" role="group" aria-label="Материал монограммы">
                <button aria-pressed={tone === 'titanium'} onClick={() => setTone('titanium')}>
                  <i className="titanium-swatch" />
                  Титан
                </button>
                <button aria-pressed={tone === 'obsidian'} onClick={() => setTone('obsidian')}>
                  <i className="obsidian-swatch" />
                  Обсидиан
                </button>
              </div>
            </div>
          </div>
          <div className="hero-bottom container">
            <span>ПЕРСОНАЛЬНОЕ ПОРТФОЛИО / 2026</span>
            <a href="#story">
              Листай. Дальше интереснее. <span aria-hidden="true">↓</span>
            </a>
            <span>
              СОЗДАНО С ЛЮБОПЫТСТВОМ <span aria-hidden="true">✳</span>
            </span>
          </div>
        </section>
        <section ref={storyRef} className="story" id="story" data-step="1" data-tone="light">
          <div className="story-sticky container">
            <div className="section-kicker">
              <span>01 / МОЯ ТОЧКА ЗРЕНИЯ</span>
              <span>ОТ ИДЕИ ДО ОЩУЩЕНИЯ</span>
            </div>
            <h2 className="story-statement">
              Хороший интерфейс
              <br />
              <span>хочется исследовать.</span>
              <br />И легко понять.
            </h2>
            <div className="story-lower">
              <p>
                Я соединяю разработку, визуальный ритм
                <br className="desktop-break" /> и интерактивность. Чтобы за эффектным
                <br className="desktop-break" /> первым впечатлением был работающий продукт.
              </p>
              <div className="story-stages" aria-label="От идеи к результату">
                <span data-stage="1">
                  <b>01</b> Любопытство
                </span>
                <i />
                <span data-stage="2">
                  <b>02</b> Эксперимент
                </span>
                <i />
                <span data-stage="3">
                  <b>03</b> Продукт
                </span>
              </div>
            </div>
            <span className="story-asterisk" aria-hidden="true">
              ✳
            </span>
          </div>
        </section>
        <Projects />
        <section className="about section-space" id="about" data-tone="light">
          <div className="container">
            <div className="section-kicker reveal">
              <span>03 / ЧЕЛОВЕК ЗА КОДОМ</span>
              <span>YELDOS YEGIMBAYEV</span>
            </div>
            <div className="about-editorial">
              <div className="about-left reveal">
                <h2>
                  Люблю разбираться.
                  <br />
                  Ещё больше —<br />
                  <span className="serif-word">создавать.</span>
                </h2>
                <div className="personal-note">
                  <svg viewBox="0 0 130 50" fill="none" aria-hidden="true">
                    <path
                      d="M4 12 21 37 44 3M24 33l-7 14M46 28q-10 12 2 12l12-7M62 7l-7 32 12-11-4 12 15-10M79 25q-15 15-1 15l7-9q-7-8-6 6M93 26q-14 9-1 10t1 7M108 35l16-7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Всегда есть что исследовать.</span>
                </div>
              </div>
              <div className="about-right reveal">
                <p className="about-intro">
                  Привет, я Елдос.
                  <br />
                  Frontend-разработчик из Казахстана.
                </p>
                <p>
                  Мне интересно, как идея превращается в вещь, которой можно пользоваться. Поэтому в
                  моих проектах есть и каталог аниме, и рабочий стол в браузере, и комната, в
                  которой можно писать код.
                </p>
                <p>
                  Люблю точные интерфейсы: понятную структуру, аккуратную типографику, хороший
                  отклик. А когда хочется понять инструмент глубже — могу собрать собственную
                  систему контроля версий на C++.
                </p>
                <div className="about-foot">
                  <span>
                    <i className="status-dot" /> Алматы, Казахстан
                  </span>
                  <a href="https://github.com/TheYeldo" target="_blank" rel="noreferrer">
                    Посмотреть GitHub <Arrow diagonal />
                  </a>
                </div>
              </div>
            </div>
            <div className="about-beliefs reveal">
              <div>
                <span>01</span>
                <p>
                  Честный продукт.
                  <br />
                  <strong>Реальные состояния.</strong>
                </p>
              </div>
              <div>
                <span>02</span>
                <p>
                  Выразительный дизайн.
                  <br />
                  <strong>Понятное поведение.</strong>
                </p>
              </div>
              <div>
                <span>03</span>
                <p>
                  Чистый код.
                  <br />
                  <strong>Пространство для роста.</strong>
                </p>
              </div>
            </div>
          </div>
        </section>
        <BeyondBrowser />
        <section className="expertise section-space" id="expertise" data-tone="light">
          <div className="container">
            <div className="section-heading reveal">
              <div>
                <p className="eyebrow">05 / КАК Я ДУМАЮ</p>
                <h2>
                  Детали работают.
                  <br />
                  <span className="text-muted">Вместе.</span>
                </h2>
              </div>
              <p className="section-description">
                Каждый инструмент нужен для конкретной задачи. <br />
                Вот как это выглядит в моих проектах.
              </p>
            </div>
            <div className="expertise-layout reveal">
              <div className="expertise-tabs" role="tablist" aria-label="Направления работы">
                {expertise.map((item, index) => (
                  <button
                    id={`expertise-tab-${index}`}
                    key={item.title}
                    role="tab"
                    aria-selected={expertiseIndex === index}
                    aria-controls="expertise-panel"
                    tabIndex={expertiseIndex === index ? 0 : -1}
                    onClick={() => setExpertiseIndex(index)}
                    onKeyDown={(event) => {
                      if (
                        ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End'].includes(
                          event.key,
                        )
                      ) {
                        event.preventDefault()
                        const next =
                          event.key === 'Home'
                            ? 0
                            : event.key === 'End'
                              ? expertise.length - 1
                              : (index +
                                  (event.key === 'ArrowDown' || event.key === 'ArrowRight'
                                    ? 1
                                    : expertise.length - 1)) %
                                expertise.length
                        setExpertiseIndex(next)
                        document.getElementById(`expertise-tab-${next}`)?.focus()
                      }
                    }}
                  >
                    <span>{item.label}</span>
                    <strong>{item.title}</strong>
                    <Arrow diagonal />
                  </button>
                ))}
              </div>
              <div
                id="expertise-panel"
                role="tabpanel"
                tabIndex={0}
                aria-labelledby={`expertise-tab-${expertiseIndex}`}
                className="expertise-panel"
              >
                <div className={`expertise-diagram diagram-${expertiseIndex}`} aria-hidden="true">
                  <div className="diagram-ring ring-one" />
                  <div className="diagram-ring ring-two" />
                  <div className="diagram-ring ring-three" />
                  <div className="diagram-core">
                    {expertiseIndex === 0 ? '{ }' : expertiseIndex === 1 ? '✳' : '↗'}
                  </div>
                  <span>
                    {expertiseIndex === 0
                      ? 'COMPONENT → SYSTEM'
                      : expertiseIndex === 1
                        ? 'INTENTION → MOTION'
                        : 'DATA → EXPERIENCE'}
                  </span>
                </div>
                <h3>{selectedExpertise.title}</h3>
                <p>{selectedExpertise.description}</p>
                <div className="tags">
                  {selectedExpertise.tools.map((tool) => (
                    <span key={tool}>{tool}</span>
                  ))}
                </div>
                <a
                  className="expertise-proof"
                  href={selectedExpertise.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>{selectedExpertise.proof}</span>
                  <Arrow diagonal />
                </a>
              </div>
            </div>
          </div>
        </section>
        <section className="process" id="process" data-tone="light">
          <div className="container">
            <div className="section-kicker reveal">
              <span>ПОНЯТНЫЙ ПУТЬ ДО РЕЗУЛЬТАТА</span>
              <span>01 → 04</span>
            </div>
            <div className="process-grid">
              {[
                [
                  '01',
                  'Сначала — зачем.',
                  'Обсуждаем задачу, аудиторию и то, что должно измениться для пользователя.',
                ],
                [
                  '02',
                  'Потом — как.',
                  'Прорабатываю структуру, состояния, визуальный язык и взаимодействия.',
                ],
                [
                  '03',
                  'Дальше — в код.',
                  'Собираю компоненты, подключаю данные и оживляю интерфейс.',
                ],
                [
                  '04',
                  'И ещё один проход.',
                  'Проверяю экраны, клавиатуру, скорость и все небольшие «а если».',
                ],
              ].map(([number, title, description]) => (
                <article className="process-step reveal" key={number}>
                  <div>
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
        <Playground paused={paused} />
        <section className="contact section-space" id="contact" data-tone="dark">
          <div className="container">
            <div className="section-kicker reveal">
              <span>
                <i className="status-dot" /> ОТКРЫТ К НОВЫМ ИДЕЯМ
              </span>
              <span>LET’S MAKE SOMETHING GOOD</span>
            </div>
            <div className="contact-title reveal">
              <h2>
                Есть идея?
                <br />
                <span>Давай создадим.</span>
              </h2>
              <span className="contact-star" aria-hidden="true">
                ✳
              </span>
            </div>
            <div className="contact-layout reveal">
              <p>
                Продукт, интерфейс или необычный эксперимент. <br />
                Расскажи, что задумал — начнём с разговора.
              </p>
              <div className="contact-composer">
                <span className="composer-label">ЧТО ОБСУДИМ?</span>
                <div className="brief-options" role="group" aria-label="Тема сообщения">
                  {['Продуктовая команда', 'Разработка сайта', 'Интересная идея'].map((type) => (
                    <button
                      key={type}
                      aria-pressed={briefType === type}
                      onClick={() => setBriefType(type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                <a
                  className="contact-send"
                  href={`https://t.me/Yeldomr?text=${telegramMessage}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>
                    Написать в Telegram<small>@Yeldomr</small>
                  </span>
                  <Arrow diagonal />
                </a>
                <p className="composer-hint">Откроется Telegram с выбранной темой сообщения.</p>
              </div>
            </div>
            <div className="contact-secondary">
              <a href="mailto:eldosegimbaev606@gmail.com">
                eldosegimbaev606@gmail.com <Arrow diagonal />
              </a>
              <button onClick={copyEmail}>
                {copyState === 'copied' ? 'Скопировано ✓' : 'Скопировать email'}
              </button>
              <span role="status" className={copyState === 'error' ? 'copy-error' : 'sr-only'}>
                {copyState === 'copied'
                  ? 'Email скопирован'
                  : copyState === 'error'
                    ? 'Не удалось скопировать. Адрес можно выделить выше.'
                    : ''}
              </span>
              <a href="https://github.com/TheYeldo" target="_blank" rel="noreferrer">
                GitHub <Arrow diagonal />
              </a>
            </div>
          </div>
          <div className="footer-wordmark" aria-hidden="true">
            yeldos<span>.</span>
          </div>
          <footer className="footer container">
            <span>© {new Date().getFullYear()} YELDOS YEGIMBAYEV</span>
            <span>ПРОДУМАНО. НАПИСАНО. ОЖИВЛЕНО.</span>
            <a href="#top">
              Вернуться наверх <span aria-hidden="true">↑</span>
            </a>
          </footer>
        </section>
      </main>
    </>
  )
}
