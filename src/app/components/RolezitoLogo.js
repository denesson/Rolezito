// src/app/components/RolezitoLogo.js

export default function RolezitoLogo({ size = 36 }) {
  return (
    <div
      className="flex items-center font-bold tracking-wide"
      style={{ fontFamily: "'Poppins', sans-serif", fontSize: size * 0.6 }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className="mr-2 animate-fade-in"
      >
        <rect
          x="2"
          y="2"
          width="28"
          height="28"
          rx="7"
          fill="url(#grad1)"
          stroke="#1e3a8a"
          strokeWidth="2"
        />
        <circle cx="16" cy="16" r="7" stroke="#ffffff" strokeWidth="2" />
        <rect x="9" y="12" width="4" height="8" rx="2" fill="#ffffff" />
        <defs>
          <linearGradient id="grad1" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1e40af" />
          </linearGradient>
        </defs>
      </svg>
      <span className="text-blue-800 dark:text-blue-300">Rolezito</span>
    </div>
  );
}
