import { useId, useMemo } from "react";

export const HEART_PATH =
  "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

const IMG = (name) => `${import.meta.env.BASE_URL}img/${name}.webp`;

export function Wisteria({ className = "" }) {
  return <img className={className} src={IMG("wisteria")} alt="" aria-hidden="true" draggable="false" />;
}

export function Calla({ className = "" }) {
  return <img className={className} src={IMG("calla")} alt="" aria-hidden="true" draggable="false" />;
}

export function Lace({ className = "" }) {
  return (
    <div
      className={className}
      aria-hidden="true"
      style={{ backgroundImage: `url(${IMG("lace")})` }}
    />
  );
}

export function WaxSeal({ text }) {
  const id = useId().replace(/:/g, "");
  const { outer, inner } = useMemo(() => {
    const build = (k) => {
      const pts = [];
      const n = 220;
      for (let i = 0; i <= n; i++) {
        const a = (i / n) * Math.PI * 2;
        const r = 1 + 0.05 * Math.sin(7 * a + 0.5) + 0.008 * Math.sin(2 * a + 1.2);
        pts.push(`${(70 + Math.cos(a) * 64 * r * k).toFixed(2)} ${(62 + Math.sin(a) * 57 * r * k).toFixed(2)}`);
      }
      return `M${pts.join(" L")} Z`;
    };
    return { outer: build(1), inner: build(0.9) };
  }, []);
  return (
    <svg viewBox="0 0 140 124" aria-hidden="true">
      <defs>
        <linearGradient id={`r${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d98a97" />
          <stop offset=".22" stopColor="#8e2a40" />
          <stop offset=".6" stopColor="#5a0f1f" />
          <stop offset=".85" stopColor="#c0707e" />
          <stop offset="1" stopColor="#e39aa5" />
        </linearGradient>
        <radialGradient id={`b${id}`} cx="40%" cy="30%" r="90%">
          <stop offset="0" stopColor="#7a1a30" />
          <stop offset=".55" stopColor="#541020" />
          <stop offset="1" stopColor="#3f0a17" />
        </radialGradient>
        <linearGradient id={`d${id}`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#c27c8a" />
          <stop offset=".5" stopColor="#ab5b6d" />
          <stop offset="1" stopColor="#9a4659" />
        </linearGradient>
        <linearGradient id={`t${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbe3dc" />
          <stop offset=".55" stopColor="#efc3ba" />
          <stop offset="1" stopColor="#d9a29f" />
        </linearGradient>
        <filter id={`s${id}`} x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0.4" dy="1.1" stdDeviation=".6" floodColor="#4a0a1a" floodOpacity=".75" />
        </filter>
      </defs>
      <path d={outer} fill={`url(#r${id})`} />
      <path d={inner} fill={`url(#b${id})`} />
      <path d={outer} fill="none" stroke="rgba(60,5,18,.55)" strokeWidth=".9" />
      <circle cx="70" cy="62" r="45" fill="none" stroke="rgba(20,0,6,.55)" strokeWidth="4" />
      <circle cx="70" cy="62" r="48" fill="none" stroke="rgba(214,130,146,.35)" strokeWidth="1.2" />
      <circle cx="70" cy="62" r="42.2" fill={`url(#d${id})`} />
      <circle cx="70" cy="62" r="42.2" fill="none" stroke="rgba(240,190,196,.75)" strokeWidth="1.1" />
      <circle cx="70" cy="62" r="40.6" fill="none" stroke="rgba(110,28,48,.5)" strokeWidth=".9" />
      <ellipse cx="62" cy="38" rx="26" ry="10" fill="rgba(255,235,235,.14)" transform="rotate(-12 62 38)" />
      <text
        x="70"
        y="74"
        textAnchor="middle"
        className="seal__text"
        fill={`url(#t${id})`}
        stroke="rgba(110,28,48,.55)"
        strokeWidth=".5"
        filter={`url(#s${id})`}
        transform="translate(70 0) skewX(-7) translate(-70 0)"
      >
        {text}
      </text>
    </svg>
  );
}

const LEAF = "M0 0 C5 -7 18 -8 29 0 C18 8 5 7 0 0 Z";

export function Sprig({ className = "" }) {
  const id = useId().replace(/:/g, "");
  const shape = useMemo(() => {
    const P = [
      [50, 236],
      [12, 164],
      [88, 94],
      [52, 22],
    ];
    const at = (t) => {
      const u = 1 - t;
      return [
        u * u * u * P[0][0] + 3 * u * u * t * P[1][0] + 3 * u * t * t * P[2][0] + t * t * t * P[3][0],
        u * u * u * P[0][1] + 3 * u * u * t * P[1][1] + 3 * u * t * t * P[2][1] + t * t * t * P[3][1],
      ];
    };
    const tan = (t) => {
      const u = 1 - t;
      return [
        3 * u * u * (P[1][0] - P[0][0]) + 6 * u * t * (P[2][0] - P[1][0]) + 3 * t * t * (P[3][0] - P[2][0]),
        3 * u * u * (P[1][1] - P[0][1]) + 6 * u * t * (P[2][1] - P[1][1]) + 3 * t * t * (P[3][1] - P[2][1]),
      ];
    };
    const leaves = [];
    for (let i = 0; i < 10; i++) {
      const t = 0.12 + i * 0.082;
      const [x, y] = at(t);
      const [dx, dy] = tan(t);
      const side = i % 2 ? 1 : -1;
      const ang = (Math.atan2(dy, dx) * 180) / Math.PI + side * 56;
      const sc = 1.05 - i * 0.045;
      leaves.push(`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${ang.toFixed(1)}) scale(${sc.toFixed(2)})`);
    }
    const [tx, ty] = at(1);
    return {
      stem: `M${P[0].join(" ")} C${P[1].join(" ")} ${P[2].join(" ")} ${P[3].join(" ")}`,
      leaves,
      tip: [tx, ty],
    };
  }, []);
  return (
    <svg className={className} viewBox="0 0 100 240" aria-hidden="true">
      <defs>
        <filter id={`b${id}`}>
          <feGaussianBlur stdDeviation=".7" />
        </filter>
        <g id={`g${id}`}>
          <path d={shape.stem} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          {shape.leaves.map((tr, i) => (
            <path key={i} d={LEAF} transform={tr} fill="currentColor" />
          ))}
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse
              key={a}
              cx={shape.tip[0]}
              cy={shape.tip[1] - 8}
              rx="4.2"
              ry="8"
              fill="currentColor"
              transform={`rotate(${a} ${shape.tip[0]} ${shape.tip[1]})`}
            />
          ))}
          <circle cx={shape.tip[0]} cy={shape.tip[1]} r="3.4" fill="currentColor" />
        </g>
      </defs>
      <use href={`#g${id}`} className="sprig__dark" transform="translate(1.7 1.9)" filter={`url(#b${id})`} />
      <use href={`#g${id}`} className="sprig__light" transform="translate(-1.6 -1.7)" />
      <use href={`#g${id}`} className="sprig__base" />
    </svg>
  );
}

export function WaxHeart({ className = "" }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <radialGradient id={`r${id}`} cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor="#f2c1c6" />
          <stop offset=".6" stopColor="#dc9aa2" />
          <stop offset="1" stopColor="#c27a85" />
        </radialGradient>
        <filter id={`f${id}`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="2" seed="4" />
          <feDisplacementMap in="SourceGraphic" scale="1.3" />
        </filter>
      </defs>
      <g filter={`url(#f${id})`}>
        <path d={HEART_PATH} fill={`url(#r${id})`} />
        <path
          d={HEART_PATH}
          fill="none"
          stroke="rgba(255,255,255,.55)"
          strokeWidth=".5"
          transform="translate(12 12.4) scale(.78) translate(-12 -12)"
        />
      </g>
    </svg>
  );
}
