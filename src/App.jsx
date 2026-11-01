import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Wisteria,
  Calla,
  Lace,
  WaxSeal,
  WaxHeart,
  Sprig,
  HEART_PATH,
} from "./art.jsx";
import { TimelineIcon } from "./icons.jsx";
import foto from "./foto.jpg";

const CONFIG = {
  groom: "Бахтиёр",
  bride: "Мохларойим",
  initials: "Б&М",

  eventISO: "2026-11-07T17:00:00+06:00",
  year: 2026,
  month: 11,
  day: 7,
  monthName: "Ноябрь",
  monthWord: "ноября",
  weekday: "СУББОТА",

  venueType: "Ресторан",
  venueTitle: "«Мурас»",
  address: "Жалал-Абадская область, Ала-Бука, улица Мамирбекова, 63",
  mapUrl: "https://2gis.kg/bishkek/geo/70000001101555735",

  timeline: [
    {
      time: "08:00",
      text: "Утро невесты, встреча с подругами",
      icon: "flower",
    },
    { time: "12:00", text: "Приезд сватов", icon: "car" },
    { time: "13:00", text: "Проводы невесты, обряд «Ёр-ёр»", icon: "house" },
    { time: "13:00–14:00", text: "Обручение и отъезд невесты", icon: "rings" },
    { time: "16:00", text: "Фотосессия", icon: "camera" },
    { time: "17:00", text: "Начало свадебного торжества", icon: "glasses" },
    { time: "Вечер", text: "Дискотека", icon: "disco" },
    { time: "21:00", text: "Обряд «Келин салом»", icon: "heart" },
  ],

  rsvpEndpoint: "/api/rsvp",
  rsvpText: "Просим вас подтвердить своё присутствие и заполнить анкету ниже.",
  rsvpNote: "",

  musicSrc: "/music.mp3",
  openSfx: "/magic.mp3",
};

const MUSIC_AT = 2.3; // секунд после нажатия: музыка начинает проявляться
const MUSIC_FADE = 1.5; // секунд плавного нарастания музыки

const pad = (n) => String(n).padStart(2, "0");
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

const ReadyContext = createContext(true);

function Reveal({ children, delay = 0, className = "", as: Tag = "div" }) {
  const ready = useContext(ReadyContext);
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !ready || shown) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.18 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ready, shown]);

  return (
    <Tag
      ref={ref}
      className={`reveal ${shown ? "is-shown" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

function makeStars() {
  let s = 11;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const tints = [
    "#ffffff",
    "#ffe9b0",
    "#f9cddb",
    "#fff6d8",
    "#ecd2ff",
    "#ffd98a",
  ];
  const stars = Array.from({ length: 56 }, (_, i) => ({
    kind: "star",
    left: 3 + rnd() * 94,
    top: 1 + Math.pow(rnd(), 1.4) * 58,
    size: 6 + rnd() * 24,
    delay: 0.9 + rnd() * 3.5,
    dur: 1.6 + rnd() * 2.4,
    tint: tints[i % tints.length],
    drift: 0,
  }));
  const dots = Array.from({ length: 34 }, (_, i) => ({
    kind: "dot",
    left: 6 + rnd() * 88,
    top: 20 + rnd() * 55,
    size: 3 + rnd() * 11,
    delay: 1 + rnd() * 5,
    dur: 4 + rnd() * 4,
    tint: tints[(i + 2) % tints.length],
    drift: (rnd() - 0.5) * 40,
  }));
  return [...stars, ...dots];
}

function makeSparks() {
  let s = 7;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const tints = [
    "#fffdf0",
    "#ffe9a8",
    "#ffd77a",
    "#fff3c9",
    "#f9cddb",
    "#ffffff",
  ];
  return Array.from({ length: 46 }, (_, i) => {
    const a = rnd() * Math.PI * 2;
    const r = 22 + rnd() * 46;
    return {
      round: i % 3 === 0,
      size: 5 + rnd() * 15,
      tx: Math.cos(a) * r,
      ty: Math.sin(a) * r * 1.35 - 10,
      delay: 0.45 + rnd() * 0.55,
      dur: 1.5 + rnd() * 1.4,
      tint: tints[i % tints.length],
    };
  });
}

function Envelope({ onOpen, opening, leaving }) {
  const stars = useMemo(makeStars, []);
  const sparks = useMemo(makeSparks, []);
  return (
    <div
      className={`env ${opening ? "is-opening" : ""} ${leaving ? "is-leaving" : ""}`}
    >
      <div className="env__stage">
        <div className="env__inside" />
        <div className="env__glow">
          <div className="env__rays" />
          <div className="env__rays env__rays--b" />
          {stars.map((st, i) => (
            <i
              key={i}
              className={st.kind === "star" ? "env__star" : "env__dot"}
              style={{
                left: `${st.left}%`,
                top: `${st.top}%`,
                width: st.size,
                height: st.size,
                background: st.tint,
                color: st.tint,
                animationDelay: `${st.delay}s`,
                animationDuration: `${st.dur}s`,
                "--dx": `${st.drift}px`,
              }}
            />
          ))}
        </div>

        <div className="env__card">
          <div className="env__card-in">
            <span className="env__card-top">Приглашение</span>
            <span className="env__card-n">{CONFIG.groom}</span>
            <span className="env__card-amp">&amp;</span>
            <span className="env__card-n">{CONFIG.bride}</span>
            <span className="env__card-date">
              {CONFIG.day} {CONFIG.monthWord} {CONFIG.year}
            </span>
          </div>
        </div>

        <div className="env__sides">
          <div className="env__piece env__piece--l">
            <Sprig className="env__sprig env__sprig--l1" />
            <Sprig className="env__sprig env__sprig--l2" />
          </div>
          <div className="env__piece env__piece--r">
            <Sprig className="env__sprig env__sprig--r1" />
            <Sprig className="env__sprig env__sprig--r2" />
          </div>
        </div>
        <div className="env__bottom">
          <div className="env__piece env__piece--b">
            <Sprig className="env__sprig env__sprig--b1" />
            <Sprig className="env__sprig env__sprig--b2" />
          </div>
        </div>

        <div className="env__burst" />
        <div className="env__flash" />

        <div className="env__spark">
          <i className="env__ring" />
          <i className="env__ring env__ring--b" />
          {sparks.map((sp, i) => (
            <i
              key={i}
              className={`env__sp ${sp.round ? "env__sp--dot" : ""}`}
              style={{
                width: sp.size,
                height: sp.size,
                background: sp.tint,
                color: sp.tint,
                "--tx": sp.tx,
                "--ty": sp.ty,
                animationDelay: `${sp.delay}s`,
                animationDuration: `${sp.dur}s`,
              }}
            />
          ))}
        </div>

        <div className="env__flap">
          <div className="env__flap-face" />
          <button
            className="env__seal"
            onClick={onOpen}
            aria-label="Открыть приглашение"
          >
            <WaxSeal text={CONFIG.initials} />
            <span className="env__shine" />
          </button>
        </div>

        <p className="env__hint">Нажмите на печать, чтобы открыть</p>
      </div>
    </div>
  );
}

function Hero() {
  const { groom, bride } = CONFIG;
  return (
    <section id="home" className="hero">
      <div
        className="hero__bg"
        style={{ backgroundImage: `url(${foto})` }}
        aria-hidden="true"
      />
      <div className="hero__veil" aria-hidden="true" />

      <Wisteria className="fl fl--w1" />
      <div className="hero__stage">
        <div className="hero__panel">
          <div className="hero__names">
            <Reveal delay={200} className="hero__n hero__n--a">
              {groom}
            </Reveal>
            <Reveal delay={450} className="hero__amp">
              &amp;
            </Reveal>
            <Reveal delay={700} className="hero__n hero__n--b">
              {bride}
            </Reveal>
          </div>
          <Reveal delay={1000} className="hero__date">
            <div className="hero__row">
              <span className="hero__wd">{CONFIG.weekday}</span>
              <span className="hero__day">
                <i />
                {CONFIG.day}
                <i />
              </span>
              <span className="hero__mo">{CONFIG.monthName.toUpperCase()}</span>
            </div>
            <div className="hero__year">{CONFIG.year}</div>
          </Reveal>
        </div>
      </div>
      <Calla className="fl fl--c1" />
      <a className="hero__down" href="#invitation" aria-label="Листайте вниз">
        <span />
      </a>
    </section>
  );
}

function Welcome() {
  return (
    <section id="invitation" className="section welcome-wrap">
      <Reveal className="welcome">
        <Wisteria className="welcome__fl welcome__fl--l" />
        <Wisteria className="welcome__fl welcome__fl--r" />
        <h2 className="script welcome__title">Дорогие гости!</h2>
        <p className="welcome__text">
          приглашаем вас разделить с нами радость особенного дня и стать частью
          начала нашей семейной истории
        </p>
      </Reveal>
    </section>
  );
}

const TL_W = 390;
const TL_STEP = 132;
const TL_TOP = 150;
const TL_CENTER = 195;

function Timeline() {
  const items = CONFIG.timeline;
  const H = TL_TOP + (items.length - 1) * TL_STEP + 150;

  const points = useMemo(
    () =>
      items.map((it, i) => ({
        ...it,
        y: TL_TOP + i * TL_STEP,
        x: i % 2 === 0 ? 112 : 282,
      })),
    [items],
  );
  const d = useMemo(() => {
    const pts = [{ x: TL_CENTER, y: 6 }, ...points, { x: TL_CENTER, y: H - 8 }];
    let s = `M${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1];
      const b = pts[i];
      const my = (a.y + b.y) / 2;
      s += ` C${a.x} ${my} ${b.x} ${my} ${b.x} ${b.y}`;
    }
    return s;
  }, [points, H]);

  const wrapRef = useRef(null);
  const guideRef = useRef(null);
  const progRef = useRef(null);
  const heartRef = useRef(null);
  const rowRefs = useRef([]);
  const dotRefs = useRef([]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const guide = guideRef.current;
    const prog = progRef.current;
    const heart = heartRef.current;
    if (!wrap || !guide) return;
    const len = guide.getTotalLength();
    prog.style.strokeDasharray = `${len}`;
    let raf = 0;

    const update = () => {
      raf = 0;
      const r = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = clamp((vh * 0.6 - r.top) / r.height, 0, 1);
      const pt = guide.getPointAtLength(p * len);
      heart.setAttribute(
        "transform",
        `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`,
      );
      prog.style.strokeDashoffset = `${len * (1 - p)}`;
      points.forEach((q, i) => {
        const passed = pt.y >= q.y - 30;
        rowRefs.current[i]?.classList.toggle("is-passed", passed);
        dotRefs.current[i]?.classList.toggle("is-passed", passed);
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [points]);

  return (
    <section className="section timeline">
      <Lace className="timeline__lace" />
      <div
        className="timeline__stage"
        ref={wrapRef}
        style={{ aspectRatio: `${TL_W} / ${H}` }}
      >
        <svg
          className="timeline__svg"
          viewBox={`0 0 ${TL_W} ${H}`}
          aria-hidden="true"
        >
          <path ref={guideRef} d={d} className="tl-line" />
          <path ref={progRef} d={d} className="tl-line tl-line--on" />
          {points.map((q, i) => (
            <circle
              key={i}
              ref={(el) => (dotRefs.current[i] = el)}
              cx={q.x}
              cy={q.y}
              r="4"
              className="tl-dot"
            />
          ))}
          <g ref={heartRef} className="tl-heart">
            <g transform="translate(-17 -16) scale(1.42)">
              <path d={HEART_PATH} />
            </g>
          </g>
        </svg>

        {points.map((q, i) => {
          const onLeft = q.x > TL_CENTER;
          const cx = onLeft ? (18 + q.x - 36) / 2 : (q.x + 36 + TL_W - 18) / 2;
          return (
            <div
              key={i}
              ref={(el) => (rowRefs.current[i] = el)}
              className="tl-item"
              style={{
                left: `${(cx / TL_W) * 100}%`,
                top: `${(q.y / H) * 100}%`,
              }}
            >
              <TimelineIcon name={q.icon} className="tl-item__icon" />
              <div className="tl-item__time">{q.time}</div>
              <div className="tl-item__text">{q.text}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Calendar() {
  const { year, month, day } = CONFIG;
  const cells = useMemo(() => {
    const first = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
    const offset = (first + 6) % 7;
    const total = new Date(Date.UTC(year, month, 0)).getUTCDate();
    return [
      ...Array(offset).fill(null),
      ...Array.from({ length: total }, (_, i) => i + 1),
    ];
  }, [year, month]);
  const week = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  return (
    <section className="section calendar">
      <Reveal>
        <h2 className="script calendar__month">{CONFIG.monthName}</h2>
      </Reveal>
      <Reveal delay={150} className="calendar__grid">
        {week.map((w) => (
          <span key={w} className="calendar__wd">
            {w}
          </span>
        ))}
        {cells.map((n, i) =>
          n === day ? (
            <span key={i} className="calendar__d calendar__d--on">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d={HEART_PATH} />
              </svg>
              <b>{n}</b>
            </span>
          ) : (
            <span key={i} className="calendar__d">
              {n}
            </span>
          ),
        )}
      </Reveal>
    </section>
  );
}

function Venue() {
  const mapHref =
    CONFIG.mapUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${CONFIG.venueType} ${CONFIG.venueTitle}, ${CONFIG.address}`,
    )}`;
  return (
    <section className="section venue">
      <Reveal>
        <p className="caps venue__type">{CONFIG.venueType}</p>
        <h3 className="caps venue__title">{CONFIG.venueTitle}</h3>
        <p className="venue__addr">{CONFIG.address}</p>
        <a className="btn" href={mapHref} target="_blank" rel="noreferrer">
          ОТКРЫТЬ КАРТУ
        </a>
      </Reveal>
    </section>
  );
}

function useCountdown(targetISO) {
  const target = new Date(targetISO).getTime();
  const calc = () => {
    const diff = Math.max(0, target - Date.now());
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff / 3600000) % 24),
      minutes: Math.floor((diff / 60000) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };
  const [left, setLeft] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setLeft(calc()), 1000);
    return () => clearInterval(id);
  }, [targetISO]);
  return left;
}

function Countdown() {
  const t = useCountdown(CONFIG.eventISO);
  const items = [
    [t.days, "Дней"],
    [t.hours, "Часов"],
    [t.minutes, "Минут"],
    [t.seconds, "Секунд"],
  ];
  return (
    <section className="section countdown">
      <Reveal>
        <h2 className="script countdown__title">До свадьбы осталось</h2>
        <div className="countdown__row">
          {items.map(([v, label]) => (
            <div className="countdown__cell" key={label}>
              <b>{pad(v)}</b>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

const RSVP_KEY = "wedding_rsvp_sent";

// читаем сохранённый ответ (если гость уже отправлял анкету)
function loadSaved() {
  try {
    const raw = localStorage.getItem(RSVP_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function Rsvp() {
  const [saved] = useState(loadSaved);
  const [name, setName] = useState("");
  const [attending, setAttending] = useState(saved?.attending || "");
  const [trap, setTrap] = useState(""); // скрытое поле-ловушка для ботов
  const [status, setStatus] = useState(saved ? "done" : "idle"); // idle | sending | done | error
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (status === "sending" || status === "done") return;
    if (name.trim().length < 2)
      return (setMsg("Пожалуйста, укажите ваше имя"), setStatus("error"));
    if (!attending)
      return (setMsg("Выберите, сможете ли вы прийти"), setStatus("error"));
    setStatus("sending");
    setMsg("");
    try {
      const res = await fetch(CONFIG.rsvpEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), attending, trap }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.ok === false) throw new Error(data.error || "fail");

      // запоминаем на этом устройстве, что анкета отправлена
      try {
        localStorage.setItem(
          RSVP_KEY,
          JSON.stringify({ attending, name: name.trim(), at: Date.now() }),
        );
      } catch {}

      setStatus("done");
    } catch {
      setMsg("Не получилось отправить. Попробуйте ещё раз чуть позже.");
      setStatus("error");
    }
  };

  return (
    <section className="section rsvp">
      <Reveal>
        <h2 className="script rsvp__title">Анкета</h2>

        {status === "done" ? (
          <div className="rsvp__done" role="status">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d={HEART_PATH} />
            </svg>
            <p className="script">Спасибо!</p>
            <p>
              {attending === "yes"
                ? "Ваш ответ получен. Будем рады видеть вас!"
                : "Ваш ответ получен. Жаль, что вы не сможете быть с нами."}
            </p>
          </div>
        ) : (
          <>
            <p className="caps rsvp__text">{CONFIG.rsvpText}</p>
            {CONFIG.rsvpNote && (
              <p className="caps rsvp__text">{CONFIG.rsvpNote}</p>
            )}

            <form className="rsvp__form" onSubmit={submit} noValidate>
              <label className="field">
                <span className="field__label">Ваше ФИО</span>
                <input
                  type="text"
                  className="field__input"
                  placeholder="Имя"
                  autoComplete="name"
                  maxLength={100}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>

              <fieldset className="choice">
                <legend className="field__label">
                  Вы будете на торжестве?
                </legend>
                {[
                  ["yes", "Да"],
                  ["no", "Нет"],
                ].map(([v, l]) => (
                  <label key={v} className="choice__opt">
                    <input
                      type="radio"
                      name="attending"
                      value={v}
                      checked={attending === v}
                      onChange={() => setAttending(v)}
                    />
                    <i aria-hidden="true" />
                    <span>{l}</span>
                  </label>
                ))}
              </fieldset>

              <input
                className="trap"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={trap}
                onChange={(e) => setTrap(e.target.value)}
              />

              {status === "error" && msg && (
                <p className="rsvp__error" role="alert">
                  {msg}
                </p>
              )}
              <button
                className="btn btn--full"
                type="submit"
                disabled={status === "sending"}
              >
                {status === "sending" ? "ОТПРАВЛЯЕМ…" : "ОТПРАВИТЬ"}
              </button>
            </form>
          </>
        )}
      </Reveal>
    </section>
  );
}

function Finale() {
  return (
    <section className="section finale">
      <Reveal>
        <p className="script finale__regards">С уважением,</p>
        <p className="script finale__names">
          {CONFIG.groom}
          <span> &amp; </span>
          {CONFIG.bride}
        </p>
      </Reveal>
      <Reveal delay={200}>
        <WaxHeart className="finale__heart" />
        <p className="script finale__wait">Ждём вас!</p>
      </Reveal>
    </section>
  );
}

function MusicButton({ playing, toggle }) {
  return (
    <button
      className={`music ${playing ? "music--on" : ""}`}
      onClick={toggle}
      aria-label={playing ? "Выключить музыку" : "Включить музыку"}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 18V6l10-2v12" />
        <circle cx="6.5" cy="18" r="2.5" />
        <circle cx="16.5" cy="16" r="2.5" />
      </svg>
      {!playing && <span className="music__slash" />}
    </button>
  );
}

export default function App() {
  const [stage, setStage] = useState("closed");
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);
  const sfxRef = useRef(null);
  const ctxRef = useRef(null);
  const gainRef = useRef(null);

  useEffect(() => {
    const a = new Audio(CONFIG.openSfx);
    a.preload = "auto";
    a.volume = 0.85;
    sfxRef.current = a;
  }, []);

  // громкость музыки идёт через Web Audio, чтобы плавно «вывести» её после звука открытия
  const ensureGraph = () => {
    if (ctxRef.current || !audioRef.current) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try {
      const ctx = new AC();
      const src = ctx.createMediaElementSource(audioRef.current);
      const gain = ctx.createGain();
      src.connect(gain);
      gain.connect(ctx.destination);
      ctxRef.current = ctx;
      gainRef.current = gain;
    } catch {}
  };

  const play = async () => {
    try {
      ensureGraph();
      await ctxRef.current?.resume();
      if (gainRef.current) {
        const g = gainRef.current.gain;
        g.cancelScheduledValues(0);
        g.setValueAtTime(1, ctxRef.current.currentTime);
      }
      await audioRef.current?.play();
      setPlaying(true);
    } catch {}
  };
  const pause = () => {
    audioRef.current?.pause();
    setPlaying(false);
  };
  const toggle = () => (playing ? pause() : play());

  const open = () => {
    if (stage !== "closed") return;
    setStage("opening");

    // 1) звук открытия конверта
    try {
      sfxRef.current.currentTime = 0;
      sfxRef.current.play().catch(() => {});
    } catch {}

    // 2) музыка запускается «беззвучно» в момент нажатия (так разрешают браузеры),
    //    а затем плавно проявляется, пока звук открытия растворяется
    ensureGraph();
    const ctx = ctxRef.current;
    const gain = gainRef.current;
    if (ctx && gain) {
      ctx.resume();
      gain.gain.cancelScheduledValues(0);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      audioRef.current
        .play()
        .then(() => setPlaying(true))
        .catch(() => {});
      setTimeout(() => {
        audioRef.current.currentTime = 0;
        const t0 = ctx.currentTime;
        gain.gain.cancelScheduledValues(t0);
        gain.gain.setValueAtTime(0, t0);
        const curve = new Float32Array(64).map(
          (_, i) => Math.sin((i / 63) * Math.PI * 0.5) ** 2,
        );
        gain.gain.setValueCurveAtTime(curve, t0, MUSIC_FADE);
      }, MUSIC_AT * 1000);
    } else {
      setTimeout(play, MUSIC_AT * 1000);
    }

    setTimeout(() => setStage("leaving"), 3700);
    setTimeout(() => setStage("open"), 4700);
  };

  useEffect(() => {
    document.body.style.overflow = stage === "open" ? "" : "hidden";
    if (stage === "open") window.scrollTo(0, 0);
  }, [stage]);

  return (
    <ReadyContext.Provider value={stage === "leaving" || stage === "open"}>
      {CONFIG.musicSrc && (
        <audio ref={audioRef} src={CONFIG.musicSrc} loop preload="auto" />
      )}
      <main className="page">
        <Hero />
        <Welcome />
        <Timeline />
        <Calendar />
        <Venue />
        <Countdown />
        <Rsvp />
        <Finale />
      </main>
      {stage !== "open" && (
        <Envelope
          onOpen={open}
          opening={stage !== "closed"}
          leaving={stage === "leaving"}
        />
      )}
      <MusicButton playing={playing} toggle={toggle} />
    </ReadyContext.Provider>
  );
}
