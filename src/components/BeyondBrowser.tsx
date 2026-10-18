import './beyond-browser.css'

function BeyondArrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 18 18 6M6 6h12v12" />
    </svg>
  )
}

export default function BeyondBrowser() {
  return (
    <section className="beyond" id="curiosity" aria-labelledby="beyond-title">
      <div className="beyond-inner">
        <div className="beyond-heading reveal">
          <div>
            <p className="beyond-eyebrow">04 / ЧУТЬ ГЛУБЖЕ</p>
            <h2 id="beyond-title">
              Любопытство
              <br />
              <span>без рамок браузера.</span>
            </h2>
          </div>
          <p className="beyond-intro">
            Иногда, чтобы лучше понять инструмент,
            <br className="beyond-desktop-break" /> хочется собрать его самому.
          </p>
        </div>

        <div className="beyond-grid">
          <article className="beyond-card beyond-git reveal" aria-labelledby="beyond-git-title">
            <div className="beyond-card-top">
              <span className="beyond-index" aria-hidden="true">
                01
              </span>
              <span className="beyond-card-kicker">ИЗНУТРИ НАРУЖУ / C++20</span>
            </div>
            <div className="beyond-card-copy">
              <h3 id="beyond-git-title">YelGit</h3>
              <p className="beyond-card-lead">У каждого изменения есть история.</p>
              <p className="beyond-description">
                Учебная система контроля версий с собственной реализацией SHA-256. Сохраняет объекты
                по хешу, собирает коммиты и переключает ветки — без вызовов git.exe.
              </p>
            </div>

            <figure className="beyond-terminal">
              <figcaption className="beyond-terminal-header">
                <span className="beyond-terminal-symbol" aria-hidden="true">
                  &gt;_
                </span>
                <span>Пример команд · локальный репозиторий</span>
              </figcaption>
              <pre aria-label="Пример: создать репозиторий, добавить файлы и сохранить коммит">
                <code>
                  <span className="beyond-command">
                    <span aria-hidden="true">$ </span>yelgit init
                  </span>
                  {'\n'}
                  <span className="beyond-command">
                    <span aria-hidden="true">$ </span>yelgit add .
                  </span>
                  {'\n'}
                  <span className="beyond-command">
                    <span aria-hidden="true">$ </span>yelgit commit -m <em>"First idea"</em>
                  </span>
                </code>
              </pre>
              <div
                className="beyond-object-flow"
                aria-label="Объекты: содержимое файла, дерево, коммит"
              >
                <span>blob</span>
                <i aria-hidden="true">→</i>
                <span>tree</span>
                <i aria-hidden="true">→</i>
                <span>commit</span>
              </div>
            </figure>

            <div className="beyond-git-bottom">
              <p>От байтов файла — к истории проекта.</p>
              <a
                className="beyond-link beyond-link-dark"
                href="https://github.com/TheYeldo/YelGit"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Исходный код YelGit на GitHub — новая вкладка"
              >
                Заглянуть внутрь <BeyondArrow />
              </a>
            </div>
          </article>

          <article
            className="beyond-card beyond-process reveal"
            aria-labelledby="beyond-process-title"
          >
            <div className="beyond-card-top">
              <span className="beyond-index" aria-hidden="true">
                02
              </span>
              <span className="beyond-card-kicker">ЗА ПРЕДЕЛАМИ ВЕБА / WINDOWS</span>
            </div>
            <div className="beyond-card-copy">
              <h3 id="beyond-process-title">ProcessLens</h3>
              <p className="beyond-card-lead">Система. В поле зрения.</p>
              <p className="beyond-description">
                Нативный монитор Windows на C++20, Win32 и Direct2D. Живые метрики, графики и
                процессы — в собственном интерфейсе с вниманием к типографике и деталям.
              </p>
            </div>

            <figure className="beyond-desktop">
              <div className="beyond-desktop-frame">
                <div className="beyond-desktop-label" aria-hidden="true">
                  <span className="beyond-desktop-icon">
                    <i />
                    <i />
                    <i />
                    <i />
                  </span>
                  <span>PROCESSLENS.EXE</span>
                  <span>C++ / NATIVE UI</span>
                </div>
                <img
                  src="/projects/processlens.jpg"
                  alt="ProcessLens: тёмный интерфейс с графиками процессора, памяти, видеокарты и сети, а также таблицей процессов"
                  width="1180"
                  height="820"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption>Реальный скриншот приложения · Windows</figcaption>
            </figure>

            <div className="beyond-process-bottom">
              <p>
                <span>ПРОДУМАННЫЙ СЦЕНАРИЙ</span>
                Пауза фиксирует экран.
                <br />
                Сбор метрик продолжается.
              </p>
              <a
                className="beyond-link beyond-link-light"
                href="https://github.com/TheYeldo/ProcessLens"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Исходный код ProcessLens на GitHub — новая вкладка"
              >
                Смотреть код <BeyondArrow />
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
