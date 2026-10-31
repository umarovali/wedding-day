const common = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.3,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const ICONS = {
  flower: (
    <>
      <circle cx="24" cy="17" r="3" />
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="24" cy="9.5" rx="3.6" ry="5" transform={`rotate(${a} 24 17)`} />
      ))}
      <path d="M24 25 C24 32 22 38 24 44 M24 34 C18 32 15 28 15 25 C20 25 23 28 24 34 M24 37 C30 35 33 32 33 29 C28 29 25 32 24 37" />
    </>
  ),
  car: (
    <>
      <path d="M6 31 V25 L10 24 L15 15 H32 L39 24 L43 26 V31 Z" />
      <path d="M16 24 L19 17 H24 V24 Z M27 24 V17 H31 L35 24 Z" />
      <circle cx="15" cy="32" r="4" />
      <circle cx="34" cy="32" r="4" />
    </>
  ),
  house: (
    <>
      <path d="M7 23 L24 8 L41 23 M11 20 V40 H37 V20" />
      <path d="M20 40 V30 a4 4 0 0 1 8 0 V40" />
      <path d="M24 19.5 c-1-1.6 -3.6-1 -3.6 1 c0 1.8 3.6 3.6 3.6 3.6 s3.6-1.8 3.6-3.6 c0-2-2.6-2.6-3.6-1 z" />
    </>
  ),
  rings: (
    <>
      <circle cx="17" cy="28" r="9.5" />
      <circle cx="31" cy="28" r="9.5" />
      <path d="M13 11 L16 7 H20 L23 11 L18 17 Z M13 11 H23" />
    </>
  ),
  camera: (
    <>
      <path d="M6 17 H15 L18 12 H30 L33 17 H42 V38 H6 Z" />
      <circle cx="24" cy="27" r="7.5" />
      <circle cx="24" cy="27" r="3.4" />
      <path d="M36 21 h2.5" />
    </>
  ),
  glasses: (
    <>
      <path d="M12 6 H22 L21 20 C21 24 19 26 17 26 C15 26 13 24 13 20 Z M17 26 V38 M12 38 H22" transform="rotate(-10 17 22)" />
      <path d="M26 6 H36 L35 20 C35 24 33 26 31 26 C29 26 27 24 27 20 Z M31 26 V38 M26 38 H36" transform="rotate(10 31 22)" />
      <path d="M22 4 l1 -2 M24 6 l2 -2 M26 3 l1 -2" />
    </>
  ),
  disco: (
    <>
      <path d="M24 4 V10" />
      <circle cx="24" cy="26" r="15" />
      <path d="M9 26 H39 M24 11 V41 M12 16 C20 20 28 20 36 16 M12 36 C20 32 28 32 36 36 M17 13 C13 22 13 30 17 39 M31 13 C35 22 35 30 31 39" />
      <path d="M40 8 l1.2 3 3 1.2 -3 1.2 -1.2 3 -1.2 -3 -3 -1.2 3 -1.2 Z" />
    </>
  ),
  heart: (
    <>
      <path d="M24 38 C10 28 7 22 7 16.5 C7 12 10.5 9 14.5 9 C18.5 9 22 11 24 14.5 C26 11 29.5 9 33.5 9 C37.5 9 41 12 41 16.5 C41 22 38 28 24 38 Z" />
      <path d="M24 4 V1 M10 5 l-2 -2 M38 5 l2 -2" />
      <path d="M17 18 c1.2-2 4-2 5 0" />
    </>
  ),
};

export function TimelineIcon({ name, className = "" }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true" {...common}>
      {ICONS[name] || ICONS.heart}
    </svg>
  );
}
