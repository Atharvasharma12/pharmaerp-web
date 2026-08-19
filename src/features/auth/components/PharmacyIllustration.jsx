import { motion } from "framer-motion";

const PharmacyIllustration = ({ className }) => {
  return (
    <motion.div
      initial={{ scale: 0.92, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={className}
    >
      <svg
        viewBox="0 0 240 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-auto w-full max-w-[200px] select-none"
      >
        {/* Ambient background glow dots */}
        <circle cx="45" cy="50" r="3" fill="#3B82F6" opacity="0.35" />
        <circle cx="210" cy="70" r="4" fill="#F59E0B" opacity="0.4" />
        <circle cx="25" cy="120" r="2.5" fill="#10B981" opacity="0.3" />
        
        {/* Plus / sparkle accents */}
        <path d="M195 40V48M191 44H199" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        <path d="M215 90V96M212 93H218" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        <path d="M35 80V86M32 83H38" stroke="#10B981" strokeWidth="2" strokeLinecap="round" opacity="0.7" />

        {/* Growth Bar Chart in background */}
        <rect x="155" y="98" width="10" height="34" rx="3" fill="#1E293B" />
        <rect x="170" y="82" width="10" height="50" rx="3" fill="#1E293B" />
        <rect x="185" y="66" width="10" height="66" rx="3" fill="#1E293B" />
        
        {/* Growth arrow */}
        <path
          d="M152 108C162 92 172 74 186 52M186 52H176M186 52V62"
          stroke="#1E293B"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Person / Pharmacist character */}
        {/* Hair - yellow playful curl style */}
        <path
          d="M72 72C68 58 80 44 98 44C114 44 126 54 124 68C132 68 136 78 130 86C126 92 118 94 114 94C108 94 104 88 100 88C96 88 92 92 84 92C76 92 70 82 72 72Z"
          fill="#FBBF24"
        />
        {/* Hair outline details */}
        <path
          d="M80 56C86 48 98 46 108 48C118 50 124 58 122 66"
          stroke="#1E293B"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M124 66C130 68 134 76 128 84"
          stroke="#1E293B"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        
        {/* Face */}
        <path
          d="M86 68C86 68 84 92 100 96C112 98 118 88 118 78"
          fill="#FFFFFF"
          stroke="#1E293B"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Eye & Smile */}
        <circle cx="106" cy="74" r="2.2" fill="#1E293B" />
        <path
          d="M100 82C104 85 108 85 110 82"
          stroke="#1E293B"
          strokeWidth="2"
          strokeLinecap="round"
        />
        
        {/* Ear */}
        <path
          d="M86 76C82 76 82 82 86 84"
          stroke="#1E293B"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Neck */}
        <path
          d="M96 95V106M106 95V106"
          stroke="#1E293B"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Body / Shirt - Vibrant Blue */}
        <path
          d="M66 142C66 118 80 106 102 106C124 106 138 118 138 142H66Z"
          fill="#3B82F6"
          stroke="#1E293B"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        
        {/* Collar / Tie detail */}
        <path
          d="M94 106L102 116L110 106"
          stroke="#FFFFFF"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Holding Phone / Tablet device */}
        <rect
          x="120"
          y="90"
          width="20"
          height="34"
          rx="4"
          fill="#38BDF8"
          stroke="#1E293B"
          strokeWidth="2.2"
          transform="rotate(8 120 90)"
        />
        {/* Phone screen detail */}
        <line
          x1="126"
          y1="98"
          x2="136"
          y2="99"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="125"
          y1="104"
          x2="133"
          y2="105"
          stroke="#FFFFFF"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Hand holding phone */}
        <circle cx="120" cy="116" r="6" fill="#FBBF24" stroke="#1E293B" strokeWidth="2.2" />

        {/* Prescription / Pill bottle on left */}
        <rect x="80" y="112" width="16" height="28" rx="3" fill="#FBBF24" stroke="#1E293B" strokeWidth="2.2" />
        <rect x="82" y="107" width="12" height="5" rx="1.5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
        <path d="M88 120V128M84 124H92" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />

        {/* Base ground soft shadow */}
        <ellipse cx="120" cy="150" rx="70" ry="6" fill="#000000" opacity="0.06" />
      </svg>
    </motion.div>
  );
};

export default PharmacyIllustration;
