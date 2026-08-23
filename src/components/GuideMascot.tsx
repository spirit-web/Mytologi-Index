// Enkel, tecknad "vägvisare"-figur — inte ett fotorealistiskt porträtt,
// bara en varm, stiliserad karikatyr (grått sidobenat hår, glasögon,
// kavaj/slips) som länkar till framstegssidan. Rent personligt/lokalt
// bruk, inte publicerat.
export function GuideMascot({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="Gå till ditt framsteg"
    >
      {/* Bakgrundscirkel */}
      <circle cx="32" cy="32" r="31" fill="var(--accent-bg)" stroke="var(--accent-border)" strokeWidth="1.5" />
      {/* Kavaj/axlar */}
      <path
        d="M14 58c1-9 7-14 18-14s17 5 18 14"
        fill="var(--text-faint)"
        opacity="0.35"
      />
      {/* Slips */}
      <path d="M31 45l1.5 3-1.5 6-1.5-6z" fill="var(--accent)" opacity="0.6" />
      {/* Hals */}
      <rect x="27" y="38" width="10" height="8" rx="3" fill="#d9a679" />
      {/* Huvud */}
      <ellipse cx="32" cy="28" rx="13" ry="14" fill="#e3b48a" />
      {/* Hår — sidbena, grånande */}
      <path
        d="M19 24c0-9 6-15 13-15s13 6 13 15c-3-4-8-6-13-6s-10 2-13 6z"
        fill="var(--text-muted)"
      />
      <path d="M19 22c1-3 3-5 5-6-2 3-3 6-3 9z" fill="var(--text-muted)" />
      {/* Öron */}
      <circle cx="19.5" cy="29" r="2.2" fill="#e3b48a" />
      <circle cx="44.5" cy="29" r="2.2" fill="#e3b48a" />
      {/* Glasögon */}
      <circle cx="26" cy="28" r="4.2" fill="none" stroke="var(--text)" strokeWidth="1.6" />
      <circle cx="38" cy="28" r="4.2" fill="none" stroke="var(--text)" strokeWidth="1.6" />
      <path d="M30.2 28h1.6" stroke="var(--text)" strokeWidth="1.6" />
      {/* Ögonbryn — lite skeptiska/tankfulla, karaktäristiskt */}
      <path d="M22.5 23.5l6-1" stroke="var(--text-muted)" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M34.5 22.5l6 1" stroke="var(--text-muted)" strokeWidth="1.4" strokeLinecap="round" />
      {/* Näsa */}
      <path d="M32 27v6l-2 1.5" fill="none" stroke="#c99566" strokeWidth="1.2" strokeLinecap="round" />
      {/* Mun — allvarlig, lätt sammanbiten */}
      <path d="M27.5 38q4.5 1.5 9 0" fill="none" stroke="#8a5a3a" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
