import { motion } from "framer-motion";

const RegisterIllustration = ({ className }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className || ""}`}>
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute size-28 rounded-full bg-primary-soft/60 blur-xl" />

      {/* Floating decorative elements matching Reference Image 2 */}
      {/* 1. Top Blue Badge 'SALE' */}
      <motion.div
        initial={{ y: -4, opacity: 0 }}
        animate={{ y: [0, -3, 0], opacity: 1 }}
        transition={{ y: { repeat: Infinity, duration: 3.8, ease: "easeInOut" }, opacity: { duration: 0.3 } }}
        className="absolute top-0 right-14 z-20 flex items-center justify-center rounded-[6px] bg-blue-600 px-1.5 py-0.5 shadow-xs"
      >
        <span className="text-[9px] font-black tracking-wider text-white">SALE</span>
      </motion.div>

      {/* 2. Middle Green Badge '%' */}
      <motion.div
        initial={{ x: -4, opacity: 0 }}
        animate={{ x: [0, -3, 0], opacity: 1 }}
        transition={{ x: { repeat: Infinity, duration: 4.2, ease: "easeInOut" }, opacity: { duration: 0.3, delay: 0.1 } }}
        className="absolute top-6 left-12 z-20 flex size-5 items-center justify-center rounded-[5px] bg-emerald-500 shadow-xs"
      >
        <span className="text-[10px] font-black text-white">%</span>
      </motion.div>

      {/* 3. Red Accent Sparkle Badge '*' */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: [1, 1.1, 1], opacity: 1 }}
        transition={{ scale: { repeat: Infinity, duration: 3.5, ease: "easeInOut" }, opacity: { duration: 0.3, delay: 0.2 } }}
        className="absolute top-12 left-14 z-20 flex size-4 items-center justify-center rounded-[4px] bg-rose-500 shadow-xs"
      >
        <span className="text-[9px] font-black text-white">★</span>
      </motion.div>

      {/* Main Character SVG (Pharmacist / Operations Manager with Order Sheet) */}
      <svg
        width="140"
        height="120"
        viewBox="0 0 160 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
      >
        {/* Soft circle background */}
        <circle cx="80" cy="70" r="56" fill="var(--app-color-surface-alt, #f1f5f9)" />

        {/* Character Hair (Blue wavy hair matching reference image) */}
        <path
          d="M62 42C56 34 64 24 78 24C92 24 100 32 98 42C106 44 110 52 108 62C106 72 96 74 96 74C96 74 98 62 92 56C86 50 82 52 76 52C70 52 64 58 64 66C58 64 56 54 58 48C60 42 62 42 62 42Z"
          fill="#2563EB"
        />

        {/* Face & Neck */}
        <rect x="74" y="52" width="12" height="12" rx="4" fill="#FED7AA" />
        <ellipse cx="80" cy="46" rx="14" ry="15" fill="#FED7AA" />

        {/* Face details */}
        {/* Hair bangs */}
        <path d="M68 38C72 34 82 34 86 38C88 42 78 40 74 42C70 44 68 40 68 38Z" fill="#1D4ED8" />
        {/* Eyes (happy curves) */}
        <path d="M74 46C75 44 77 44 78 46" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M82 46C83 44 85 44 86 46" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
        {/* Smile */}
        <path d="M78 52C79 53.5 81 53.5 82 52" stroke="#EA580C" strokeWidth="1.5" strokeLinecap="round" />
        {/* Rosy cheeks */}
        <circle cx="72" cy="50" r="2.5" fill="#FDA4AF" opacity="0.6" />
        <circle cx="88" cy="50" r="2.5" fill="#FDA4AF" opacity="0.6" />

        {/* Yellow Top/Blouse */}
        <path
          d="M62 72C62 66 70 64 80 64C90 64 98 66 98 72L106 112C106 116 102 120 98 120H62C58 120 54 116 54 112L62 72Z"
          fill="#F59E0B"
        />
        {/* Collar neckline */}
        <path d="M76 64L80 72L84 64" fill="#FED7AA" />

        {/* Left & Right Arms */}
        <path
          d="M60 74L50 88C48 91 50 95 54 95L62 92"
          stroke="#FED7AA"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M100 74L110 88C112 91 110 95 106 95L98 92"
          stroke="#FED7AA"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Prescription / Clipboard Sheet in hands */}
        <motion.g
          initial={{ y: 2 }}
          animate={{ y: [-1, 2, -1] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          <rect x="68" y="76" width="24" height="34" rx="3" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
          {/* Clipboard lines */}
          <line x1="73" y1="84" x2="87" y2="84" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="73" y1="89" x2="85" y2="89" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="73" y1="94" x2="82" y2="94" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="85" cy="99" r="2" fill="var(--app-color-primary, #00994a)" />
        </motion.g>

        {/* Thumbs holding sheet */}
        <circle cx="68" cy="92" r="3" fill="#FED7AA" />
        <circle cx="92" cy="92" r="3" fill="#FED7AA" />
      </svg>
    </div>
  );
};

export default RegisterIllustration;
