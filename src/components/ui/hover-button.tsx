"use client";

import React, { useRef, useState, MouseEvent, ReactNode } from 'react';

interface HoverButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  glowColor?: string;
  backgroundColor?: string;
  textColor?: string;
  hoverTextColor?: string;
}

const HoverButton: React.FC<HoverButtonProps> = ({
  children,
  onClick,
  className = '',
  disabled = false,
  glowColor = '#34d399',
  backgroundColor = '#18181b',
  textColor = '#ffffff',
  hoverTextColor = '#a7f3d0',
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setGlowPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative inline-flex items-center justify-center gap-2 border-none
        cursor-pointer overflow-hidden transition-colors duration-300
        rounded-xl font-medium focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-emerald-500 focus-visible:ring-offset-2
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      style={{
        backgroundColor,
        color: isHovered ? hoverTextColor : textColor,
      }}
    >
      <div
        className={`
          absolute w-[200px] h-[200px] rounded-full opacity-40 pointer-events-none
          transition-transform duration-300 ease-out -translate-x-1/2 -translate-y-1/2
          ${isHovered ? 'scale-125' : 'scale-0'}
        `}
        style={{
          left: `${glowPosition.x}px`,
          top: `${glowPosition.y}px`,
          background: `radial-gradient(circle, ${glowColor} 10%, transparent 70%)`,
          zIndex: 0,
        }}
      />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
};

export { HoverButton };
