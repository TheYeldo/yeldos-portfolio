import { useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import './projects.css'

type Project = {
  id: 'yeldo-os' | 'taytlo' | 'programming-simulator'
  title: string
  category: string
  description: string
  detail: string
  features: string[]
  stack: string[]
  group: 'web' | 'interactive'
  live: string
  repository: string
}

const projects: Project[] = [
  {
    id: 'yeldo-os',
    title: 'YeldoOS',
    category: 'Портфолио, которое можно исследовать',
    description: 'Целая операционная система. Прямо в браузере.',
    detail:
      'Личное портфолио в формате рабочего стола: приложения, окна, терминал и реальные проекты. Знакомые взаимодействия превращают знакомство с разработчиком в небольшое исследование.',
    features: [
      'Перемещаемые окна, терминал и проводник проектов',
      'Интеграция с GitHub и сохранение состояния',
      'Русский и английский интерфейс, смена тем',
    ],
    stack: ['Next.js', 'TypeScript', 'Motion', 'Zustand', 'next-intl'],
    group: 'interactive',
    live: 'https://yeldo-os.vercel.app',
    repository: 'https://github.com/TheYeldo/yeldo-os',
  },
  {
    id: 'taytlo',
    title: 'Taytlo',
    category: 'Веб-приложение',
    description: 'Следующая любимая история — в одном поиске.',
    detail:
      'Каталог аниме с поиском, фильтрами, рейтингами и личными списками. Сложный набор данных собран в понятный интерфейс, который удобно использовать и на большом экране, и с телефона.',
    features: [
      'Поиск, фильтры, жанры и страницы тайтлов',
      'Избранное, история просмотра и личные списки',
      'Адаптивный интерфейс со светлой и тёмной темой',
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'Prisma'],
    group: 'web',
    live: 'https://taytlo.vercel.app',
    repository: 'https://github.com/TheYeldo/taytlo',
  },
  {
    id: 'programming-simulator',
    title: 'Programming Simulator',
    category: '3D и интерактив',
    description: 'Зайти в комнату. Открыть редактор. Создать.',
    detail:
      'Интерактивная комната разработчика с трёхмерной сценой, браузерным рабочим столом и симулятором программирования. Пространство ведёт от исследования к собственным экспериментам с кодом.',
    features: [
      'Процедурная 3D-комната на React Three Fiber',
      'Редактор Monaco и изолированный предпросмотр кода',
      'Задания, сохранение прогресса и адаптация для мобильных',
    ],
    stack: ['Next.js', 'TypeScript', 'Three.js', 'React Three Fiber', 'Monaco'],
    group: 'interactive',
    live: 'https://programming-simulator.vercel.app',
    repository: 'https://github.com/TheYeldo/programming-simulator',
  },
]

const filters = [
  { id: 'all', label: 'Все проекты' },
  { id: 'web', label: 'Веб-приложения' },
  { id: 'interactive', label: '3D и интерактив' },
] as const

function ArrowIcon({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'M4 12h16m-6-6 6 6-6 6'}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function OsPreview() {
  return (
    <div className="project-visual project-visual-os" aria-hidden="true">
      <div className="os-wallpaper" />
      <div className="os-menubar">
        <b>Y</b>
        <span>YeldoOS</span>
        <span>Файл</span>
        <span>Вид</span>
        <span className="os-menubar-right">Пространство для идей ↗</span>
      </div>
      <div className="os-window">
        <div className="preview-windowbar">
          <span className="window-dots">
            <i />
            <i />
            <i />
          </span>
          <span>explorer / projects</span>
          <span>⌘ K</span>
        </div>
        <div className="os-window-content">
          <aside>
            <strong>Моё пространство</strong>
            <span className="os-sidebar-selected">◈ &nbsp; Проекты</span>
            <span>⌘ &nbsp; Обо мне</span>
            <span>↗ &nbsp; Контакты</span>
            <small>Создано с любопытством.</small>
          </aside>
          <div className="os-explorer">
            <span className="preview-eyebrow">ОТ ИДЕИ — К ИНТЕРФЕЙСУ</span>
            <h4>Есть что показать.</h4>
            <p>Небольшие эксперименты. Большие возможности.</p>
            <div className="os-folders">
              <div>
                <i className="preview-folder" />
                <span>Продукты</span>
              </div>
              <div>
                <i className="preview-folder folder-blue" />
                <span>Эксперименты</span>
              </div>
              <div>
                <i className="preview-folder folder-violet" />
                <span>Обо мне</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="os-terminal">
        <div className="terminal-head">
          <span className="terminal-dot" /> terminal
        </div>
        <p>
          <span>yeldo</span> ~ / creative-space
        </p>
        <p>
          <em>→</em> идеи становятся интерфейсами
          <span className="terminal-cursor" />
        </p>
      </div>
      <div className="os-dock">
        <span>Y</span>
        <span>⌘</span>
        <span>◈</span>
        <span>⌁</span>
        <span>↗</span>
      </div>
      <span className="visual-caption">Визуальная интерпретация проекта</span>
    </div>
  )
}

function TaytloPreview() {
  return (
    <div className="project-visual project-visual-taytlo" aria-hidden="true">
      <div className="taytlo-preview-window">
        <div className="taytlo-preview-nav">
          <b>
            taytlo<span>®</span>
          </b>
          <span>Найти свою историю</span>
          <i>⌕</i>
        </div>
        <div className="taytlo-preview-heading">
          <span className="preview-eyebrow">НОВЫЕ МИРЫ РЯДОМ</span>
          <h4>Ещё одну серию.</h4>
          <span className="taytlo-preview-pill">Исследовать каталог ↗</span>
        </div>
        <div className="taytlo-posters">
          <div className="taytlo-poster poster-mountain">
            <div />
            <span>ЗА ГОРИЗОНТОМ</span>
            <small>Приключения</small>
          </div>
          <div className="taytlo-poster poster-city">
            <div />
            <span>ПОСЛЕ ЗАКАТА</span>
            <small>Фантастика</small>
          </div>
          <div className="taytlo-poster poster-sky">
            <div />
            <span>ТИШИНА НЕБА</span>
            <small>Повседневность</small>
          </div>
        </div>
      </div>
      <span className="visual-caption">Визуальная интерпретация проекта</span>
    </div>
  )
}

function SimulatorPreview() {
  return (
    <div className="project-visual project-visual-simulator" aria-hidden="true">
      <div className="sim-room-glow" />
      <span className="sim-preview-label">
        <span /> CREATIVE MODE
      </span>
      <div className="sim-room">
        <div className="sim-wall-lines" />
        <div className="sim-plant">
          <i />
          <i />
          <i />
          <span />
        </div>
        <div className="sim-monitor">
          <div className="sim-monitor-screen">
            <div className="sim-code-header">
              playground.tsx <span>●</span>
            </div>
            <div className="sim-code-lines">
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
            <div className="sim-code-orbit">
              <span />
            </div>
          </div>
          <div className="sim-monitor-neck" />
          <div className="sim-monitor-foot" />
        </div>
        <div className="sim-desk">
          <div className="sim-keyboard" />
          <span className="sim-desk-leg" />
          <span className="sim-desk-leg leg-right" />
        </div>
        <div className="sim-floor" />
      </div>
      <span className="sim-preview-hint">↓ &nbsp; Погрузиться в процесс</span>
      <span className="visual-caption">Визуальная интерпретация проекта</span>
    </div>
  )
}

function ProjectPreview({ id }: { id: Project['id'] }) {
  if (id === 'yeldo-os') return <OsPreview />
  if (id === 'taytlo') return <TaytloPreview />
  return <SimulatorPreview />
}

export default function Projects() {
  const [filter, setFilter] = useState<(typeof filters)[number]['id']>('all')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const visibleProjects = projects.filter((project) => filter === 'all' || project.group === filter)

  useEffect(() => {
    if (!selectedProject || !dialogRef.current) return
    const dialog = dialogRef.current
    const previousOverflow = document.body.style.overflow
    if (!dialog.open) dialog.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [selectedProject])

  function showProject(project: Project, event: MouseEvent<HTMLButtonElement>) {
    triggerRef.current = event.currentTarget
    setSelectedProject(project)
  }

  function closeProject() {
    dialogRef.current?.close()
  }

  function handleDialogClose() {
    setSelectedProject(null)
    triggerRef.current?.focus({ preventScroll: true })
  }

  return (
    <section id="projects" className="projects-section" aria-labelledby="projects-title">
      <div className="container">
        <div className="section-heading reveal projects-heading">
          <div>
            <p className="eyebrow">01 / ИЗБРАННОЕ</p>
            <h2 id="projects-title">
              Сделано.
              <br />
              <span>С вниманием.</span>
            </h2>
            <p className="projects-intro">
              Идеи, которые вышли за пределы заметок.
              <br className="projects-desktop-break" /> И обрели свою форму в браузере.
            </p>
          </div>
          <a
            className="projects-github-link"
            href="https://github.com/TheYeldo?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
          >
            Все работы на GitHub <ArrowIcon diagonal />
          </a>
        </div>
        <div className="project-filters" role="group" aria-label="Фильтр проектов">
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={filter === item.id}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
              {item.id === 'all' && <span>03</span>}
            </button>
          ))}
        </div>
        <p className="projects-status" aria-live="polite">
          Показано проектов: {visibleProjects.length}
        </p>
        <div className="projects-grid">
          {visibleProjects.map((project) => (
            <article className={`project-card project-card-${project.id}`} key={project.id}>
              <ProjectPreview id={project.id} />
              <div className="project-card-content">
                <div className="project-card-meta">
                  <span>{project.category}</span>
                  <span>2026</span>
                </div>
                <div className="project-card-title-row">
                  <div>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                  </div>
                  <button
                    className="project-open-button"
                    type="button"
                    aria-label={`Подробнее о проекте ${project.title}`}
                    onClick={(event) => showProject(project, event)}
                  >
                    <ArrowIcon diagonal />
                  </button>
                </div>
                <div className="project-stack" aria-label="Технологии">
                  {project.stack.slice(0, 3).map((technology) => (
                    <span key={technology}>{technology}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="project-experiments reveal">
          <p>
            <span className="eyebrow">ЛЮБОПЫТСТВО БЕЗ ГРАНИЦ</span>
            <strong>И ещё кое-что.</strong>
          </p>
          <div>
            <a
              href="https://github.com/TheYeldo/uniroute-korea"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>
                UniRoute Korea<small>Планировщик поступления</small>
              </span>
              <ArrowIcon diagonal />
            </a>
            <a
              href="https://github.com/TheYeldo/ProcessLens"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>
                ProcessLens<small>Системный монитор · C++</small>
              </span>
              <ArrowIcon diagonal />
            </a>
            <a href="https://github.com/TheYeldo/YelGit" target="_blank" rel="noopener noreferrer">
              <span>
                YelGit<small>Своя система контроля версий</small>
              </span>
              <ArrowIcon diagonal />
            </a>
          </div>
        </div>
      </div>
      <dialog
        ref={dialogRef}
        className="project-dialog"
        aria-labelledby="project-dialog-title"
        onClose={handleDialogClose}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeProject()
        }}
      >
        {selectedProject && (
          <div className="project-dialog-panel">
            <button
              className="project-dialog-close"
              type="button"
              aria-label="Закрыть описание проекта"
              onClick={closeProject}
              autoFocus
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="m6 6 12 12M6 18 18 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <p className="eyebrow">ПРОЕКТ / 2026</p>
            <h2 id="project-dialog-title">{selectedProject.title}</h2>
            <p className="project-dialog-description">{selectedProject.detail}</p>
            <div className="project-dialog-section">
              <h3>Что внутри</h3>
              <ul>
                {selectedProject.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>
            <div className="project-dialog-section">
              <h3>Технологии</h3>
              <div className="project-stack">
                {selectedProject.stack.map((technology) => (
                  <span key={technology}>{technology}</span>
                ))}
              </div>
            </div>
            <div className="project-dialog-actions">
              <a
                className="button button-primary"
                href={selectedProject.live}
                target="_blank"
                rel="noopener noreferrer"
              >
                Открыть проект <ArrowIcon diagonal />
              </a>
              <a
                className="button button-secondary"
                href={selectedProject.repository}
                target="_blank"
                rel="noopener noreferrer"
              >
                Исходный код <ArrowIcon diagonal />
              </a>
            </div>
            <p className="project-dialog-note">Ссылки откроются в новой вкладке.</p>
          </div>
        )}
      </dialog>
    </section>
  )
}
