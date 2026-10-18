import { useEffect, useRef, useState } from 'react'
import './command-menu.css'

const destinations = [
  {
    id: 'project-yeldo-os',
    title: 'YeldoOS',
    description: 'Браузерная операционная система',
    category: 'Работы',
    mark: '01',
    keywords:
      'портфолио ос операционная система рабочий стол окна терминал desktop operating system windows terminal react next typescript zustand',
  },
  {
    id: 'project-taytlo',
    title: 'Taytlo',
    description: 'Каталог аниме и личные списки',
    category: 'Работы',
    mark: '02',
    keywords:
      'тайтло аниме каталог поиск фильтры рейтинги anime catalog lists prisma postgres react next typescript',
  },
  {
    id: 'project-programming-simulator',
    title: 'Programming Simulator',
    description: '3D-комната с настоящим редактором кода',
    category: 'Работы',
    mark: '03',
    keywords:
      'симулятор программирование комната код редактор трехмерный 3d room code editor monaco webgl three react fiber',
  },
  {
    id: 'project-uniroute',
    title: 'UniRoute Korea',
    description: 'Планировщик поступления в университет',
    category: 'Работы',
    mark: '04',
    keywords: 'университет поступление корея планировщик education university next supabase',
  },
  {
    id: 'project-museum',
    title: 'Museum of the Lost Internet',
    description: 'Семь пространств цифровой истории',
    category: 'Работы',
    mark: '05',
    keywords: 'музей интернет история 3d museum internet history web',
  },
  {
    id: 'project-assistant',
    title: 'Yeldos Assistant',
    description: 'Двуязычный Telegram-помощник',
    category: 'Работы',
    mark: '06',
    keywords: 'ассистент помощник бот телеграм assistant bot telegram workers d1',
  },
  {
    id: 'about',
    title: 'Человек за кодом',
    description: 'Обо мне, интересах и подходе к разработке',
    category: 'Разделы',
    mark: 'Y',
    keywords:
      'елдос егимбаев yeldos yegimbayev about me обо мне биография разработчик frontend kazakhstan казахстан алматы',
  },
  {
    id: 'curiosity',
    title: 'Любопытство без рамок',
    description: 'YelGit, ProcessLens и разработка на C++',
    category: 'Разделы',
    mark: '{ }',
    keywords:
      'любопытство yelgit processlens git c++ cpp контроль версий терминал метрики монитор windows win32 direct2d curiosity experiments system systems sha-256',
  },
  {
    id: 'expertise',
    title: 'Подход к работе',
    description: 'Интерфейс, движение и логика продукта',
    category: 'Разделы',
    mark: '↗',
    keywords:
      'навыки подход технологии стек опыт expertise skills stack frontend design react typescript api motion интерфейсы',
  },
  {
    id: 'lab',
    title: 'Playground',
    description: 'Три эксперимента, которые можно потрогать',
    category: 'Разделы',
    mark: '✳',
    keywords:
      'лаборатория интерактив анимация движение глубина отклик пружина наклон кнопка playground lab interaction animation easing tilt magnet',
  },
  {
    id: 'contact',
    title: 'Давай создадим',
    description: 'Контакты и начало нового проекта',
    category: 'Разделы',
    mark: '@',
    keywords:
      'контакты контакт написать почта телеграм связь сотрудничество работа contact contacts email mail telegram hire hiring work project',
  },
] as const

type Destination = (typeof destinations)[number]

function normalize(value: string) {
  return value.toLocaleLowerCase('ru').normalize('NFKC').replace(/ё/g, 'е').trim()
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 4.5 4.5" />
    </svg>
  )
}

export default function CommandMenu() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)
  const previousOverflow = useRef<string | null>(null)
  const pendingDestination = useRef<Destination | null>(null)
  const navigationFrame = useRef(0)
  const terms = normalize(query).split(/\s+/).filter(Boolean)
  const results = destinations.filter((item) => {
    const searchable = normalize(`${item.title} ${item.description} ${item.keywords}`)
    return terms.every((term) => searchable.includes(term))
  })
  const activeIndex = Math.min(selectedIndex, Math.max(0, results.length - 1))

  function openMenu() {
    const dialog = dialogRef.current
    if (!dialog || dialog.open || document.querySelector('dialog[open]')) return
    previousFocus.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    previousOverflow.current = document.body.style.overflow
    pendingDestination.current = null
    setQuery('')
    setSelectedIndex(0)
    setOpen(true)
    dialog.showModal()
    document.body.style.overflow = 'hidden'
    inputRef.current?.focus({ preventScroll: true })
  }

  function restoreScroll() {
    if (previousOverflow.current !== null) {
      document.body.style.overflow = previousOverflow.current
      previousOverflow.current = null
    }
  }

  function handleClose() {
    setOpen(false)
    restoreScroll()
    const destination = pendingDestination.current
    pendingDestination.current = null
    if (!destination) {
      const target = previousFocus.current?.isConnected ? previousFocus.current : triggerRef.current
      target?.focus({ preventScroll: true })
      return
    }

    // Projects can reveal a filtered card before its deep link receives focus.
    window.dispatchEvent(new CustomEvent('portfolio:navigate', { detail: { id: destination.id } }))
    navigationFrame.current = requestAnimationFrame(() => {
      navigationFrame.current = 0
      const target = document.getElementById(destination.id)
      if (!target) return
      if (window.location.hash !== `#${destination.id}`) {
        window.history.pushState(null, '', `#${destination.id}`)
      }
      const hadTabIndex = target.hasAttribute('tabindex')
      if (!hadTabIndex) {
        target.setAttribute('tabindex', '-1')
        target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true })
      }
      target.focus({ preventScroll: true })
      const motion = document.documentElement.dataset.motion
      const reduceMotion =
        motion === 'paused' ||
        (motion !== 'active' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      target.scrollIntoView({ block: 'start', behavior: reduceMotion ? 'instant' : 'smooth' })
    })
  }

  function choose(item: Destination) {
    pendingDestination.current = item
    dialogRef.current?.close()
  }

  function clearSearch() {
    setQuery('')
    setSelectedIndex(0)
    inputRef.current?.focus()
  }

  useEffect(() => {
    const onShortcut = (event: KeyboardEvent) => {
      if (
        event.isComposing ||
        event.repeat ||
        event.altKey ||
        !(event.metaKey || event.ctrlKey) ||
        event.key.toLowerCase() !== 'k'
      )
        return
      const dialog = dialogRef.current
      const otherDialog = Array.from(
        document.querySelectorAll<HTMLDialogElement>('dialog[open]'),
      ).some((item) => item !== dialog)
      if (otherDialog) return
      event.preventDefault()
      if (dialog?.open) dialog.close()
      else openMenu()
    }
    document.addEventListener('keydown', onShortcut)
    return () => {
      document.removeEventListener('keydown', onShortcut)
      cancelAnimationFrame(navigationFrame.current)
      if (previousOverflow.current !== null) {
        document.body.style.overflow = previousOverflow.current
        previousOverflow.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!open || !results.length) return
    document
      .getElementById(`command-option-${results[activeIndex].id}`)
      ?.scrollIntoView({ block: 'nearest', behavior: 'instant' })
  }, [activeIndex, open, query, results])

  return (
    <>
      <button
        ref={triggerRef}
        className="command-menu-trigger"
        type="button"
        onClick={openMenu}
        aria-label="Поиск по портфолио"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="portfolio-command-menu"
        aria-keyshortcuts="Control+K Meta+K"
        title="Поиск по портфолио — Ctrl / ⌘ K"
      >
        <SearchIcon />
        <kbd aria-hidden="true">⌘ K</kbd>
      </button>
      <dialog
        id="portfolio-command-menu"
        ref={dialogRef}
        className="command-menu"
        aria-labelledby="command-menu-title"
        onClose={handleClose}
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close()
        }}
      >
        <div className="command-menu-panel">
          <div className="command-menu-heading">
            <span>Y / PERSONAL INDEX</span>
            <button
              className="command-menu-close"
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Закрыть поиск"
            >
              <span aria-hidden="true">ESC</span>
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="m4 4 8 8M4 12l8-8" />
              </svg>
            </button>
          </div>
          <h2 id="command-menu-title" className="sr-only">
            Поиск по портфолио
          </h2>
          <div className="command-menu-search">
            <SearchIcon />
            <input
              ref={inputRef}
              id="command-menu-query"
              type="text"
              inputMode="search"
              role="combobox"
              aria-label="Название проекта, раздел или технология"
              aria-autocomplete="list"
              aria-expanded={open}
              aria-controls="command-menu-results"
              aria-activedescendant={
                results.length ? `command-option-${results[activeIndex].id}` : undefined
              }
              placeholder="Куда отправимся?"
              autoComplete="off"
              spellCheck={false}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setSelectedIndex(0)
              }}
              onKeyDown={(event) => {
                if (event.nativeEvent.isComposing) return
                if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                  event.preventDefault()
                  if (results.length)
                    setSelectedIndex(
                      (index) =>
                        (index + (event.key === 'ArrowDown' ? 1 : results.length - 1)) %
                        results.length,
                    )
                }
                if (event.key === 'Enter' && results.length) {
                  event.preventDefault()
                  choose(results[activeIndex])
                }
              }}
            />
            {query && (
              <button
                className="command-menu-clear"
                type="button"
                onClick={clearSearch}
                aria-label="Очистить поиск"
              >
                ×
              </button>
            )}
          </div>
          <div className="command-menu-results-wrap">
            <div id="command-menu-results" role="listbox" aria-label="Результаты поиска">
              {(['Работы', 'Разделы'] as const).map((category) => {
                const items = results.filter((item) => item.category === category)
                if (!items.length) return null
                const groupId =
                  category === 'Работы' ? 'command-group-projects' : 'command-group-sections'
                return (
                  <div
                    className="command-menu-group"
                    key={category}
                    role="group"
                    aria-labelledby={groupId}
                  >
                    <p className="command-menu-group-title" id={groupId}>
                      {category}
                      <span>{String(items.length).padStart(2, '0')}</span>
                    </p>
                    {items.map((item) => {
                      const index = results.indexOf(item)
                      const selected = index === activeIndex
                      return (
                        <button
                          id={`command-option-${item.id}`}
                          className="command-menu-result"
                          key={item.id}
                          type="button"
                          role="option"
                          tabIndex={-1}
                          aria-selected={selected}
                          onPointerMove={(event) => {
                            if (event.pointerType === 'mouse') setSelectedIndex(index)
                          }}
                          onPointerDown={(event) => {
                            if (event.pointerType === 'mouse') event.preventDefault()
                          }}
                          onClick={() => choose(item)}
                        >
                          <span
                            className={`command-menu-mark${category === 'Работы' ? ' is-project' : ''}`}
                            aria-hidden="true"
                          >
                            {item.mark}
                          </span>
                          <span className="command-menu-result-copy">
                            <strong>{item.title}</strong>
                            <span>{item.description}</span>
                          </span>
                          <span className="command-menu-enter" aria-hidden="true">
                            ↵
                          </span>
                        </button>
                      )
                    })}
                  </div>
                )
              })}
            </div>
            {!results.length && (
              <div className="command-menu-empty">
                <span className="command-menu-empty-symbol" aria-hidden="true">
                  ?
                </span>
                <h3>Пока ничего не нашлось.</h3>
                <p>Попробуй «React», «аниме» или «контакты».</p>
                <button type="button" onClick={clearSearch}>
                  Показать всё <span aria-hidden="true">↗</span>
                </button>
              </div>
            )}
          </div>
          <div className="command-menu-footer">
            <span className="command-menu-key-help">
              <kbd>↑</kbd>
              <kbd>↓</kbd> выбрать <kbd>↵</kbd> перейти
            </span>
            <span>
              {results.length
                ? `${String(results.length).padStart(2, '0')} ТОЧЕК ИНТЕРЕСА`
                : 'НОВОЕ НАЧИНАЕТСЯ С ПОИСКА'}
            </span>
          </div>
          <span className="sr-only" role="status">
            Найдено: {results.length}
          </span>
        </div>
      </dialog>
    </>
  )
}
