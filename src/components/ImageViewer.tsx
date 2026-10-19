import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import './image-viewer.css'

export type ProjectImage = { src: string; alt: string; label: string }

type ImageViewerProps = {
  title: string
  images: readonly ProjectImage[]
  initialIndex: number
  onClose: () => void
}

export default function ImageViewer({ title, images, initialIndex, onClose }: ImageViewerProps) {
  const [index, setIndex] = useState(initialIndex)
  const [zoomed, setZoomed] = useState(false)
  const [failed, setFailed] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const image = images[index]

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const previousFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    if (!dialog.open) dialog.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true })
    }
  }, [])

  function selectImage(next: number) {
    setIndex((next + images.length) % images.length)
    setZoomed(false)
    setFailed(false)
    viewportRef.current?.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }

  function changeZoom(next: boolean) {
    setZoomed(next)
    viewportRef.current?.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    viewportRef.current?.focus({ preventScroll: true })
  }

  return createPortal(
    <dialog
      ref={dialogRef}
      className="image-viewer"
      aria-labelledby="image-viewer-title"
      onClose={onClose}
      onCancel={(event) => event.stopPropagation()}
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close()
      }}
      onKeyDown={(event) => {
        if (event.ctrlKey || event.metaKey || event.altKey) return
        if (event.key === 'Escape') event.stopPropagation()
        if (!zoomed && images.length > 1 && ['ArrowLeft', 'ArrowRight'].includes(event.key)) {
          event.preventDefault()
          selectImage(index + (event.key === 'ArrowRight' ? 1 : -1))
        }
        if (['+', '=', '-', '0'].includes(event.key)) {
          event.preventDefault()
          changeZoom(event.key === '+' || event.key === '=')
        }
      }}
    >
      <div className="image-viewer-layout">
        <header className="image-viewer-header">
          <div>
            <span className="image-viewer-eyebrow">
              В ДЕТАЛЯХ / {String(index + 1).padStart(2, '0')}
            </span>
            <h2 id="image-viewer-title">{title}</h2>
          </div>
          <div className="image-viewer-actions">
            <button
              className="image-viewer-zoom"
              type="button"
              aria-pressed={zoomed}
              aria-label={
                zoomed ? 'Уместить изображение в экран' : 'Увеличить до оригинального размера'
              }
              onClick={() => changeZoom(!zoomed)}
            >
              <span aria-hidden="true">{zoomed ? '−' : '+'}</span>
              {zoomed ? 'Уместить' : '100%'}
            </button>
            <button
              type="button"
              className="image-viewer-close"
              aria-label="Закрыть просмотр изображения"
              onClick={() => dialogRef.current?.close()}
              autoFocus
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="m6 6 12 12M6 18 18 6" />
              </svg>
            </button>
          </div>
        </header>
        <div
          ref={viewportRef}
          className={`image-viewer-viewport${zoomed ? ' is-zoomed' : ''}`}
          tabIndex={0}
          role="region"
          aria-label={
            zoomed
              ? 'Изображение в оригинальном размере. Прокручивайте, чтобы рассмотреть детали.'
              : 'Просмотр скриншота'
          }
        >
          {failed ? (
            <div className="image-viewer-error" role="status">
              <p>Не удалось загрузить скриншот.</p>
              <a href={image.src} target="_blank" rel="noopener noreferrer">
                Открыть изображение отдельно ↗
              </a>
            </div>
          ) : (
            <img
              key={image.src}
              className="image-viewer-image"
              src={image.src}
              alt={image.alt}
              width={1280}
              height={720}
              onError={() => setFailed(true)}
            />
          )}
        </div>
        <footer className="image-viewer-footer">
          <div className="image-viewer-caption" aria-live="polite">
            <strong>{image.label}</strong>
            <span>
              {zoomed
                ? 'Оригинальный размер · прокручивай изображение'
                : 'Реальный интерфейс проекта'}
            </span>
          </div>
          {images.length > 1 && (
            <div className="image-viewer-pages" aria-label="Ракурсы проекта">
              <button
                type="button"
                aria-label="Предыдущее изображение"
                onClick={() => selectImage(index - 1)}
              >
                ←
              </button>
              <span>
                {index + 1} / {images.length}
              </span>
              <button
                type="button"
                aria-label="Следующее изображение"
                onClick={() => selectImage(index + 1)}
              >
                →
              </button>
            </div>
          )}
          <span className="image-viewer-key-hint">+ / − масштаб · Esc закрыть</span>
        </footer>
      </div>
    </dialog>,
    document.body,
  )
}
