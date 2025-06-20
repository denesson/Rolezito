// src/app/components/RolezitoLogo.js
export default function RolezitoLogo({ size = 36 }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", fontFamily: "monospace",
      fontWeight: "bold", fontSize: size, letterSpacing: 1
    }}>
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{marginRight: 8}}>
        <rect x="2" y="2" width="28" height="28" rx="7" stroke="#222" strokeWidth="2" fill="#fafafa"/>
        <circle cx="16" cy="16" r="7" stroke="#222" strokeWidth="2"/>
        <rect x="9" y="12" width="4" height="8" rx="2" fill="#222" />
      </svg>
      Rolezito
    </div>
  )
}