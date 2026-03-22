export default function AppLogo({ size = 64 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="شعار الأستاذ المصحح"
    >
      <defs>
        <linearGradient id="logo-bg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3B6FD4" />
          <stop offset="100%" stopColor="#2451A8" />
        </linearGradient>
        <linearGradient id="logo-shine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.18" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Background rounded square */}
      <rect width="64" height="64" rx="18" fill="url(#logo-bg)" />

      {/* Inner shine */}
      <rect width="64" height="32" rx="18" fill="url(#logo-shine)" />

      {/* Open book — two pages */}
      <path
        d="M32 44 L16 40 L16 22 L32 26 L32 44Z"
        fill="white"
        fillOpacity="0.92"
      />
      <path
        d="M32 44 L48 40 L48 22 L32 26 L32 44Z"
        fill="white"
        fillOpacity="0.72"
      />
      {/* Spine line */}
      <line x1="32" y1="26" x2="32" y2="44" stroke="white" strokeOpacity="0.35" strokeWidth="1" />

      {/* Lines on left page */}
      <line x1="20" y1="30" x2="29.5" y2="31.5" stroke="#3B6FD4" strokeOpacity="0.55" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="20" y1="34" x2="29.5" y2="35.5" stroke="#3B6FD4" strokeOpacity="0.55" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="20" y1="38" x2="27" y2="39.2" stroke="#3B6FD4" strokeOpacity="0.55" strokeWidth="1.3" strokeLinecap="round" />

      {/* Checkmark / Spark on top-right */}
      <circle cx="44" cy="17" r="8" fill="#4ADE80" fillOpacity="0.95" />
      <path
        d="M40.5 17 L43 19.5 L47.5 14.5"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
