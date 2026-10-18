import { useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import './projects.css'

type Project = {
  id: 'yeldo-os' | 'taytlo' | 'programming-simulator'
  number: string
  title: string
  category: string
  headline: string
  description: string
  challenge: string
  solution: string
  decisions: { title: string; description: string }[]
  facts: { value: string; label: string }[]
  stack: string[]
  group: 'web' | 'interactive'
  live: string
  repository: string
  imageAlt: string
}

const projects: Project[] = [
  {
    id: 'yeldo-os',
    number: '01',
    title: 'YeldoOS',
    category: 'БРАУЗЕРНАЯ ОПЕРАЦИОННАЯ СИСТЕМА',
    headline: 'Портфолио, в котором хочется остаться.',
    description:
      'Окна, приложения, терминал. Знакомый рабочий стол, который рассказывает обо мне через взаимодействие.',
    challenge:
      'Превратить портфолио в операционную систему, сохранив простой доступ к проектам и контактам.',
    solution:
      'Менеджер окон, поиск и отдельные приложения. На телефоне — специальный лаунчер вместо уменьшенного рабочего стола.',
    decisions: [
      {
        title: 'Окна, которые ведут себя как окна',
        description:
          'Перемещение, изменение размера, фокус, сворачивание и восстановление. Состояние окон и настройки хранятся в Zustand; временные диалоги и загрузка отделены от сохранённых предпочтений.',
      },
      {
        title: 'Реальные данные. Понятные границы.',
        description:
          'GitHub REST API работает через серверный Route Handler: Zod проверяет ответы, кеш сокращает повторные запросы. При недоступности API остаются известные данные профиля и ссылки.',
      },
      {
        title: 'Один проект, разные способы взаимодействия',
        description:
          'Тяжёлые приложения загружаются динамически. Командная палитра, клавиатура и мобильный лаунчер позволяют добраться до содержимого без обязательного перетаскивания окон.',
      },
    ],
    facts: [
      { value: 'RU / EN', label: 'Полная локализация' },
      { value: 'Zustand', label: 'Состояние рабочего стола' },
      { value: 'GitHub API', label: 'Публичные данные' },
    ],
    stack: ['Next.js', 'TypeScript', 'Zustand', 'Motion', 'next-intl', 'Zod'],
    group: 'interactive',
    live: 'https://yeldo-os.vercel.app',
    repository: 'https://github.com/TheYeldo/yeldo-os',
    imageAlt: 'Скриншот YeldoOS: браузерный рабочий стол с окнами приложений',
  },
  {
    id: 'taytlo',
    number: '02',
    title: 'Taytlo',
    category: 'КАТАЛОГ И ПРОДУКТОВЫЙ ИНТЕРФЕЙС',
    headline: 'Следующая любимая история — здесь.',
    description:
      'Каталог аниме, где поиск, рейтинги и личные списки складываются в один понятный продукт.',
    challenge:
      'Собрать поиск, фильтры, страницы тайтлов и историю просмотра в интерфейс, удобный на любом экране.',
    solution:
      'Каталог с последовательной навигацией, личными списками и моделью данных на Prisma. Контент остаётся в центре внимания.',
    decisions: [
      {
        title: 'От каталога к конкретной истории',
        description:
          'Поиск и фильтры, жанры, франшизы и рейтинги помогают выбрать тайтл. У каждой истории — отдельная страница с читаемым адресом.',
      },
      {
        title: 'Личное пространство зрителя',
        description:
          'Избранное, история просмотра и персональные списки связывают отдельные посещения в один сценарий. Интерфейс адаптируется к мобильным экранам и поддерживает две темы.',
      },
      {
        title: 'Основа для развития продукта',
        description:
          'Next.js и TypeScript отвечают за приложение, Prisma описывает модель данных для PostgreSQL. Структура каталога, состояние пользователя и воспроизведение разделены по своим задачам.',
      },
    ],
    facts: [
      { value: 'Поиск', label: 'Фильтры и жанры' },
      { value: 'Списки', label: 'Избранное и история' },
      { value: 'Prisma', label: 'Модель данных' },
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'Prisma', 'PostgreSQL', 'HLS.js'],
    group: 'web',
    live: 'https://taytlo.vercel.app',
    repository: 'https://github.com/TheYeldo/taytlo',
    imageAlt: 'Скриншот Taytlo: каталог аниме с постерами и навигацией',
  },
  {
    id: 'programming-simulator',
    number: '03',
    title: 'Programming Simulator',
    category: '3D-ПРОСТРАНСТВО И СИМУЛЯТОР КОДА',
    headline: 'Из цифровой комнаты — в собственный код.',
    description:
      'Интерактивная 3D-комната разработчика. Внутри — рабочий стол, редактор и место для экспериментов.',
    challenge:
      'Соединить атмосферную 3D-сцену с работающим редактором, не сделав WebGL обязательным условием входа.',
    solution:
      'Процедурная сцена и управляемая камера ведут к Monaco. Мобильная версия открывает приложения без тяжёлого 3D.',
    decisions: [
      {
        title: 'Сцена как вход в продукт',
        description:
          'Комната создана из процедурной геометрии в React Three Fiber. Управляемая камера и переход к монитору сохраняют композицию; на мобильных устройствах WebGL-сцена не монтируется.',
      },
      {
        title: 'Код с настоящим откликом',
        description:
          'Monaco позволяет редактировать HTML, CSS и JavaScript. Предпросмотр получает srcDoc внутри iframe с sandbox="allow-scripts": пользовательский код запускается в отдельном контексте браузера.',
      },
      {
        title: 'Сложность загружается по мере необходимости',
        description:
          'Monaco, 3D-сцена и приложения разбиты на динамические модули. Файлы редактора, заметки и прогресс сохраняются локально; временное состояние сцены хранится отдельно.',
      },
    ],
    facts: [
      { value: 'React Three Fiber', label: 'Процедурная 3D-сцена' },
      { value: 'Monaco', label: 'Редактирование кода' },
      { value: 'Sandbox', label: 'Изолированный preview' },
    ],
    stack: ['Next.js', 'TypeScript', 'Three.js', 'React Three Fiber', 'Monaco', 'Zustand'],
    group: 'interactive',
    live: 'https://programming-simulator.vercel.app',
    repository: 'https://github.com/TheYeldo/programming-simulator',
    imageAlt: 'Скриншот Programming Simulator: редактор кода и предпросмотр результата',
  },
]

const filters = [
  { id: 'all', label: 'Все работы', count: '03' },
  { id: 'web', label: 'Веб-приложения', count: '01' },
  { id: 'interactive', label: 'Интерактив и 3D', count: '02' },
] as const

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

function ProjectFrame({ project, compact = false }: { project: Project; compact?: boolean }) {
  return (
    <div
      className={`project-stage project-stage-${project.id}${compact ? ' project-stage-compact' : ''}`}
    >
      <div className="project-stage-grid" aria-hidden="true" />
      {!compact && (
        <div className="project-stage-topline" aria-hidden="true">
          <span>YELDOS — SELECTED WORK</span>
          <span>{project.number} / 03</span>
        </div>
      )}
      <div className="project-browser-frame">
        <div className="project-browser-chrome" aria-hidden="true">
          <span className="project-browser-dots">
            <i />
            <i />
            <i />
          </span>
          <span className="project-browser-address">
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
              <path d="M5 7V5a3 3 0 0 1 6 0v2M4 7h8v6H4z" stroke="currentColor" />
            </svg>
            {new URL(project.live).hostname}
          </span>
          <span className="project-browser-corner">↗</span>
        </div>
        <img
          className="project-screenshot"
          src={`/projects/${project.id}.jpg`}
          alt={project.imageAlt}
          width="1280"
          height="720"
          loading="lazy"
          decoding="async"
        />
      </div>
      {!compact && (
        <div className="project-stage-bottomline">
          <span>Реальный интерфейс проекта</span>
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Открыть ${project.title}, новая вкладка`}
          >
            Открыть в браузере <Arrow diagonal />
          </a>
        </div>
      )}
    </div>
  )
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
    <section
      id="projects"
      className="projects-section"
      data-tone="dark"
      aria-labelledby="projects-title"
    >
      <div className="container projects-container">
        <div className="projects-section-marker">
          <span className="eyebrow">02 / ИЗБРАННЫЕ РАБОТЫ</span>
          <span className="projects-marker-line" />
          <span className="projects-year">2026</span>
        </div>
        <header className="projects-heading">
          <h2 id="projects-title">
            Мои идеи.
            <span>
              Уже в браузере<span className="projects-heading-period">.</span>
            </span>
          </h2>
          <div className="projects-heading-aside">
            <p>
              Личные проекты, которые можно
              <br />
              открыть, исследовать и разобрать по коду.
            </p>
            <a
              className="projects-github-link"
              href="https://github.com/TheYeldo?tab=repositories"
              target="_blank"
              rel="noopener noreferrer"
            >
              Смотреть весь GitHub <Arrow diagonal />
            </a>
          </div>
        </header>
        <div className="projects-toolbar">
          <div className="project-filters" role="group" aria-label="Фильтр проектов">
            {filters.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={filter === item.id}
                onClick={() => setFilter(item.id)}
              >
                {item.label}
                <sup>{item.count}</sup>
              </button>
            ))}
          </div>
          <span className="projects-toolbar-caption" aria-hidden="true">
            DESIGN + DEVELOPMENT
          </span>
        </div>
        <p className="projects-status" aria-live="polite">
          Показано проектов: {visibleProjects.length}
        </p>
        <div className="projects-chapters">
          {visibleProjects.map((project) => (
            <article
              className={`project-card project-chapter project-card-${project.id}`}
              key={project.id}
              aria-labelledby={`project-title-${project.id}`}
            >
              <header className="project-chapter-heading">
                <span className="project-chapter-number" aria-hidden="true">
                  {project.number}
                </span>
                <div className="project-chapter-title">
                  <p className="project-category">{project.category}</p>
                  <h3 id={`project-title-${project.id}`}>{project.title}</h3>
                </div>
                <p className="project-chapter-description">{project.description}</p>
              </header>
              <ProjectFrame project={project} />
              <div className="project-chapter-details">
                <h4>{project.headline}</h4>
                <div className="project-short-story">
                  <div>
                    <span>ЗАДАЧА</span>
                    <p>{project.challenge}</p>
                  </div>
                  <div>
                    <span>РЕШЕНИЕ</span>
                    <p>{project.solution}</p>
                  </div>
                </div>
              </div>
              <footer className="project-chapter-footer">
                <div className="project-stack" aria-label="Технологии">
                  {project.stack.slice(0, 4).map((technology) => (
                    <span key={technology}>{technology}</span>
                  ))}
                </div>
                <button
                  className="project-open-button"
                  type="button"
                  aria-label={`Подробнее о проекте ${project.title}`}
                  onClick={(event) => showProject(project, event)}
                >
                  Разобрать проект{' '}
                  <span>
                    <Arrow diagonal />
                  </span>
                </button>
              </footer>
            </article>
          ))}
        </div>
        <div className="project-experiments">
          <div className="project-experiments-heading">
            <p className="eyebrow">ЕЩЁ БОЛЬШЕ ЛЮБОПЫТСТВА</p>
            <h3>
              Ещё несколько
              <br />
              направлений.
            </h3>
          </div>
          <div className="project-experiments-list">
            <a
              href="https://github.com/TheYeldo/uniroute-korea"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="experiment-index">04</span>
              <span className="experiment-name">
                UniRoute Korea<small>Планировщик поступления в университет</small>
              </span>
              <span className="experiment-tech">Next.js / Supabase</span>
              <Arrow diagonal />
            </a>
            <a
              href="https://github.com/TheYeldo/museum-of-the-lost-internet"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="experiment-index">05</span>
              <span className="experiment-name">
                Museum of the Lost Internet<small>Семь пространств цифровой истории</small>
              </span>
              <span className="experiment-tech">3D / Web</span>
              <Arrow diagonal />
            </a>
            <a
              href="https://github.com/TheYeldo/yeldos-assistant-bot"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="experiment-index">06</span>
              <span className="experiment-name">
                Yeldos Assistant<small>Двуязычный Telegram-помощник</small>
              </span>
              <span className="experiment-tech">Workers / D1</span>
              <Arrow diagonal />
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
            <div className="project-dialog-header">
              <p className="eyebrow">CASE STUDY {selectedProject.number} / 2026</p>
              <h2 id="project-dialog-title">{selectedProject.title}</h2>
              <p className="project-dialog-lead">{selectedProject.headline}</p>
            </div>
            <ProjectFrame project={selectedProject} compact />
            <div className="project-dialog-body">
              <div className="project-facts">
                {selectedProject.facts.map((fact) => (
                  <div key={fact.label}>
                    <strong>{fact.value}</strong>
                    <span>{fact.label}</span>
                  </div>
                ))}
              </div>
              <div className="project-dialog-overview">
                <div>
                  <h3>Задача</h3>
                  <p>{selectedProject.challenge}</p>
                </div>
                <div>
                  <h3>Решение</h3>
                  <p>{selectedProject.solution}</p>
                </div>
              </div>
              <div className="project-decisions">
                <h3>За интерфейсом</h3>
                {selectedProject.decisions.map((decision, index) => (
                  <div className="project-decision" key={decision.title}>
                    <span>0{index + 1}</span>
                    <div>
                      <h4>{decision.title}</h4>
                      <p>{decision.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="project-dialog-stack">
                <h3>Технологии</h3>
                <div className="project-stack">
                  {selectedProject.stack.map((technology) => (
                    <span key={technology}>{technology}</span>
                  ))}
                </div>
              </div>
              <div className="project-dialog-actions">
                <a
                  className="project-link-primary"
                  href={selectedProject.live}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Открыть проект <Arrow diagonal />
                </a>
                <a
                  className="project-link-secondary"
                  href={selectedProject.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Исходный код <Arrow diagonal />
                </a>
              </div>
              <p className="project-dialog-note">
                Личный проект. Факты и решения — из публичного репозитория. Ссылки откроются в новой
                вкладке.
              </p>
            </div>
          </div>
        )}
      </dialog>
    </section>
  )
}
