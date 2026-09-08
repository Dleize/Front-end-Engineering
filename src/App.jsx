import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowIcon,
  BookmarkIcon,
  CheckIcon,
  RefreshIcon,
  SearchIcon,
  SparkIcon,
  VolumeIcon,
} from "./icons.jsx";
import { CLASSROOM_API, fallbackWords, OWN_API } from "./data.js";

const configuredApi = import.meta.env.VITE_API_URL?.trim();

function loadStoredSet(key) {
  try {
    return new Set(JSON.parse(localStorage.getItem(key) || "[]"));
  } catch {
    return new Set();
  }
}

function sanitizeWords(payload) {
  if (!Array.isArray(payload)) return [];
  return payload
    .filter((item) => item?.word && item?.description && item?.useCase)
    .map(({ word, description, useCase }) => ({
      word: String(word),
      description: String(description),
      useCase: String(useCase),
    }));
}

function WordCard({ word, index, isSaved, isLearned, onSave, onLearn }) {
  const speak = () => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word.word);
    utterance.lang = "en-US";
    utterance.rate = 0.86;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <article className={`word-card ${isLearned ? "is-learned" : ""}`}>
      <div className="card-topline">
        <span className="card-number">{String(index + 1).padStart(2, "0")}</span>
        <div className="card-actions">
          <button className="icon-button" onClick={speak} title={`Ouvir ${word.word}`} type="button">
            <VolumeIcon size={18} />
            <span className="sr-only">Ouvir pronúncia de {word.word}</span>
          </button>
          <button
            aria-pressed={isSaved}
            className="icon-button"
            onClick={onSave}
            title={isSaved ? "Remover dos salvos" : "Salvar palavra"}
            type="button"
          >
            <BookmarkIcon filled={isSaved} size={18} />
            <span className="sr-only">{isSaved ? "Remover" : "Salvar"} {word.word}</span>
          </button>
        </div>
      </div>

      <h2>{word.word}</h2>
      <p className="word-type">new vocabulary</p>
      <div className="definition-block">
        <span>Significado</span>
        <p>{word.description}</p>
      </div>
      <div className="example-block">
        <span>Em contexto</span>
        <p>“{word.useCase}”</p>
      </div>
      <button
        aria-pressed={isLearned}
        className="learn-button"
        onClick={onLearn}
        type="button"
      >
        <span className="check-circle"><CheckIcon size={15} /></span>
        {isLearned ? "Aprendida" : "Marcar como aprendida"}
      </button>
    </article>
  );
}

function App() {
  const [words, setWords] = useState([]);
  const [status, setStatus] = useState("loading");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState(() => loadStoredSet("lexora:saved"));
  const [learned, setLearned] = useState(() => loadStoredSet("lexora:learned"));
  const [source, setSource] = useState(configuredApi ? "own" : "classroom");

  const endpoint = configuredApi || (source === "classroom" ? CLASSROOM_API : OWN_API);

  const fetchWords = useCallback(async () => {
    setStatus("loading");
    setNotice("");
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);

    try {
      const response = await fetch(endpoint, { signal: controller.signal });
      if (!response.ok) throw new Error(`A API respondeu com status ${response.status}`);
      const cleanWords = sanitizeWords(await response.json());
      if (!cleanWords.length) throw new Error("A API não retornou palavras válidas");
      setWords(cleanWords);
      setStatus("success");
    } catch {
      setWords(fallbackWords);
      setStatus("fallback");
      setNotice("A API está despertando. Enquanto isso, mostramos uma seleção local para você continuar estudando.");
    } finally {
      window.clearTimeout(timeout);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  useEffect(() => {
    localStorage.setItem("lexora:saved", JSON.stringify([...saved]));
  }, [saved]);

  useEffect(() => {
    localStorage.setItem("lexora:learned", JSON.stringify([...learned]));
  }, [learned]);

  const visibleWords = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return words;
    return words.filter((item) =>
      [item.word, item.description, item.useCase].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      ),
    );
  }, [query, words]);

  const learnedInCollection = words.filter((item) => learned.has(item.word)).length;
  const progress = words.length ? Math.round((learnedInCollection / words.length) * 100) : 0;

  const toggleSetValue = (setter, value) => {
    setter((current) => {
      const next = new Set(current);
      next.has(value) ? next.delete(value) : next.add(value);
      return next;
    });
  };

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Lexora, início">
          <span className="brand-mark"><SparkIcon size={19} /></span>
          <span>lexora</span>
        </a>
        <nav aria-label="Navegação principal">
          <a className="active" href="#collection">Explorar</a>
          <a href="#progress">Meu progresso</a>
        </nav>
        <a className="saved-pill" href="#collection">
          <BookmarkIcon filled size={15} />
          {saved.size} {saved.size === 1 ? "salva" : "salvas"}
        </a>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow"><span /> Uma coleção por dia</p>
            <h1>Inglês que você<br /><em>leva com você.</em></h1>
            <p className="hero-description">
              Cinco palavras escolhidas para ampliar seu vocabulário — com significado, contexto e som.
            </p>
            <a className="primary-cta" href="#collection">
              Começar agora <ArrowIcon size={18} />
            </a>
          </div>

          <aside className="progress-card" id="progress">
            <span className="progress-kicker">Coleção atual</span>
            <strong>{learnedInCollection}<small>/{words.length || 5}</small></strong>
            <p>palavras aprendidas</p>
            <div
              aria-label="Progresso da coleção"
              aria-valuemax="100"
              aria-valuemin="0"
              aria-valuenow={progress}
              className="progress-track"
              role="progressbar"
            >
              <span style={{ width: `${progress}%` }} />
            </div>
            <span className="progress-caption">{progress}% concluído</span>
          </aside>
        </section>

        <section className="collection-section" id="collection">
          <div className="section-heading">
            <div>
              <p className="eyebrow"><span /> Vocabulário em foco</p>
              <h2>Sua coleção de hoje</h2>
            </div>
            <div className="toolbar">
              <label className="search-field">
                <span className="sr-only">Buscar nas palavras</span>
                <SearchIcon size={17} />
                <input
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar palavra"
                  type="search"
                  value={query}
                />
              </label>
              <button className="refresh-button" disabled={status === "loading"} onClick={fetchWords} type="button">
                <RefreshIcon className={status === "loading" ? "spin" : ""} size={17} />
                Nova coleção
              </button>
            </div>
          </div>

          {!configuredApi && (
            <div className="source-switch" aria-label="Fonte das palavras">
              <span>Fonte</span>
              <button className={source === "classroom" ? "selected" : ""} onClick={() => setSource("classroom")} type="button">API da aula</button>
              <button className={source === "own" ? "selected" : ""} onClick={() => setSource("own")} type="button">API Lexora</button>
            </div>
          )}

          {notice && <p className="notice" role="status">{notice}</p>}

          {status === "loading" ? (
            <div className="word-grid" aria-label="Carregando palavras" aria-live="polite">
              {Array.from({ length: 5 }, (_, index) => <div className="word-card skeleton" key={index} />)}
            </div>
          ) : visibleWords.length ? (
            <div className="word-grid">
              {visibleWords.map((word, index) => (
                <WordCard
                  index={index}
                  isLearned={learned.has(word.word)}
                  isSaved={saved.has(word.word)}
                  key={word.word}
                  onLearn={() => toggleSetValue(setLearned, word.word)}
                  onSave={() => toggleSetValue(setSaved, word.word)}
                  word={word}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <SearchIcon size={30} />
              <h3>Nenhuma palavra encontrada</h3>
              <p>Tente buscar por outro termo.</p>
              <button onClick={() => setQuery("")} type="button">Limpar busca</button>
            </div>
          )}
        </section>

        <section className="closing-section">
          <SparkIcon size={24} />
          <p>Pequenos passos, um vocabulário inteiro.</p>
          <span>Volte amanhã para descobrir uma nova seleção.</span>
        </section>
      </main>

      <footer>
        <a className="brand footer-brand" href="#top"><span className="brand-mark"><SparkIcon size={15} /></span><span>lexora</span></a>
        <p>Feito para transformar curiosidade em fluência.</p>
        <span>FIAP · Front-end Engineering · 2026</span>
      </footer>
    </div>
  );
}

export default App;
