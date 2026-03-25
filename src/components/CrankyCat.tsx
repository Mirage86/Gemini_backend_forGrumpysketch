import React from 'react';

export function CrankyCat({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="-20 -10 240 220" className={className} xmlns="http://www.w3.org/2000/svg">
      <style>
        {`
          @keyframes blink {
            0%, 92%, 98%, 100% { transform: scaleY(1); }
            95% { transform: scaleY(0.1); }
          }
          @keyframes earTwitchLeft {
            0%, 80%, 100% { transform: rotate(0deg); }
            85% { transform: rotate(-8deg); }
            90% { transform: rotate(4deg); }
            95% { transform: rotate(0deg); }
          }
          @keyframes earTwitchRight {
            0%, 60%, 100% { transform: rotate(0deg); }
            65% { transform: rotate(8deg); }
            70% { transform: rotate(-4deg); }
            75% { transform: rotate(0deg); }
          }
          @keyframes breathe {
            0%, 100% { transform: translateY(0) scaleY(1); }
            50% { transform: translateY(2px) scaleY(0.99); }
          }
          @keyframes tailWag {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(8deg); }
          }
          .eye-l { transform-origin: 65px 95px; animation: blink 4s infinite; }
          .eye-r { transform-origin: 135px 95px; animation: blink 4s infinite; }
          .ear-l { transform-origin: 70px 55px; animation: earTwitchLeft 6s infinite; }
          .ear-r { transform-origin: 130px 55px; animation: earTwitchRight 8s infinite; }
          .body-group { transform-origin: 100px 195px; animation: breathe 3s ease-in-out infinite; }
          .tail { transform-origin: 140px 160px; animation: tailWag 5s ease-in-out infinite; }
        `}
      </style>

      <g className="body-group">
        {/* Tail */}
        <g className="tail">
          <path d="M 140 160 C 200 200 230 100 180 70 C 150 100 160 130 140 130" fill="#D7CCC8" stroke="#1F100B" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
        
        {/* Ears */}
        <g className="ear-l">
          <path d="M 55 65 L 35 10 L 85 45 Z" fill="#3E2723" stroke="#1F100B" strokeWidth="6" strokeLinejoin="round"/>
          <path d="M 52 55 L 42 22 L 75 45 Z" fill="#EF9A9A" />
        </g>
        <g className="ear-r">
          <path d="M 145 65 L 165 10 L 115 45 Z" fill="#3E2723" stroke="#1F100B" strokeWidth="6" strokeLinejoin="round"/>
          <path d="M 148 55 L 158 22 L 125 45 Z" fill="#EF9A9A" />
        </g>

        {/* Body */}
        <path d="M 35 110 C 0 150 15 195 80 195 L 130 195 C 190 195 185 130 155 100 C 140 70 60 70 35 110 Z" fill="#D7CCC8" stroke="#1F100B" strokeWidth="6" strokeLinejoin="round"/>

        {/* Belly patch */}
        <path d="M 45 130 C 30 170 60 190 90 190 L 130 190 C 160 190 160 130 145 110 C 120 150 70 150 45 130 Z" fill="#EFEBE9" />
      </g>

      {/* Back leg crease */}
      <path d="M 25 145 C 15 170 35 190 65 195" fill="none" stroke="#1F100B" strokeWidth="6" strokeLinecap="round"/>

      {/* Front Legs */}
      <path d="M 70 195 C 70 165 95 165 95 195" fill="#D7CCC8" stroke="#1F100B" strokeWidth="6" strokeLinecap="round"/>
      <path d="M 115 195 C 115 165 140 165 140 195" fill="#D7CCC8" stroke="#1F100B" strokeWidth="6" strokeLinecap="round"/>
      
      {/* Paws details */}
      <line x1="78" y1="195" x2="78" y2="185" stroke="#1F100B" strokeWidth="4" strokeLinecap="round"/>
      <line x1="87" y1="195" x2="87" y2="185" stroke="#1F100B" strokeWidth="4" strokeLinecap="round"/>
      <line x1="123" y1="195" x2="123" y2="185" stroke="#1F100B" strokeWidth="4" strokeLinecap="round"/>
      <line x1="132" y1="195" x2="132" y2="185" stroke="#1F100B" strokeWidth="4" strokeLinecap="round"/>

      <g className="body-group">
        {/* Head Base */}
        <ellipse cx="100" cy="100" rx="75" ry="65" fill="#D7CCC8" stroke="#1F100B" strokeWidth="6"/>

        {/* Dark Face Markings */}
        <path d="M 25 100 C 25 55 80 55 95 100 C 95 145 40 145 25 100 Z" fill="#3E2723" />
        <path d="M 175 100 C 175 55 120 55 105 100 C 105 145 160 145 175 100 Z" fill="#3E2723" />

        {/* Eyes (Flat top) */}
        <g className="eye-l">
          <path d="M 40 95 L 90 95 Q 65 120 40 95 Z" fill="#81D4FA" stroke="#1F100B" strokeWidth="5" strokeLinejoin="round"/>
          <path d="M 57 95 A 8 8 0 0 0 73 95 Z" fill="#1F100B" />
        </g>
        <g className="eye-r">
          <path d="M 110 95 L 160 95 Q 135 120 110 95 Z" fill="#81D4FA" stroke="#1F100B" strokeWidth="5" strokeLinejoin="round"/>
          <path d="M 127 95 A 8 8 0 0 0 143 95 Z" fill="#1F100B" />
        </g>

        {/* Angry Eyebrows */}
        <rect x="35" y="82" width="60" height="20" rx="6" transform="rotate(12 65 92)" fill="#1F100B" />
        <rect x="105" y="82" width="60" height="20" rx="6" transform="rotate(-12 135 92)" fill="#1F100B" />

        {/* Muzzle */}
        <path d="M 65 125 C 65 110 135 110 135 125 C 145 155 55 155 65 125 Z" fill="#EFEBE9" stroke="#1F100B" strokeWidth="5" strokeLinejoin="round"/>

        {/* Nose */}
        <path d="M 88 115 L 112 115 L 100 125 Z" fill="#EF9A9A" stroke="#1F100B" strokeWidth="4" strokeLinejoin="round"/>

        {/* Frown Mouth */}
        <path d="M 75 145 Q 100 120 125 145" fill="none" stroke="#1F100B" strokeWidth="6" strokeLinecap="round"/>

        {/* Whiskers */}
        <path d="M 25 100 L -15 95 M 25 110 L -15 110 M 30 120 L -10 125" fill="none" stroke="#1F100B" strokeWidth="5" strokeLinecap="round"/>
        <path d="M 175 100 L 215 95 M 175 110 L 215 110 M 170 120 L 210 125" fill="none" stroke="#1F100B" strokeWidth="5" strokeLinecap="round"/>
      </g>
    </svg>
  );
}
