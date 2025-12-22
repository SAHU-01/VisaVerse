'use client';

import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import './BubbleMenu.css';

interface MenuItem {
  label: string;
  href?: string;
  ariaLabel?: string;
  rotation?: number;
  hoverStyles?: {
    bgColor?: string;
    textColor?: string;
  };
}

interface BubbleMenuProps {
  items: MenuItem[];
  menuBg?: string;
  menuContentColor?: string;
  animationEase?: string;
  animationDuration?: number;
  staggerDelay?: number;
  onItemClick?: (item: MenuItem) => void;
  selectedItems?: string[];
}

const DEFAULT_ITEMS: MenuItem[] = [
  { label: 'home', rotation: -9, hoverStyles: { bgColor: '#10b981', textColor: '#fff' } },
  { label: 'about', rotation: 5, hoverStyles: { bgColor: '#10b981', textColor: '#fff' } },
  { label: 'projects', rotation: -3, hoverStyles: { bgColor: '#10b981', textColor: '#fff' } },
  { label: 'blog', rotation: 7, hoverStyles: { bgColor: '#ef4444', textColor: '#fff' } },
  { label: 'contact', rotation: -5, hoverStyles: { bgColor: '#a78bfa', textColor: '#111' } },
];

export default function BubbleMenu({
  items = DEFAULT_ITEMS,
  menuBg = '#fff',
  menuContentColor = '#111',
  animationEase = 'back.out(1.5)',
  animationDuration = 0.5,
  staggerDelay = 0.12,
  onItemClick,
  selectedItems = [],
}: BubbleMenuProps) {
  const [isOpen, setIsOpen] = useState(true);
  const navRef = useRef<HTMLElement>(null);
  const bubblesRef = useRef<(HTMLDivElement | null)[]>([]);
  const labelsRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Animate bubbles in
      bubblesRef.current.forEach((bubble, i) => {
        if (bubble) {
          gsap.fromTo(
            bubble,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: animationDuration,
              delay: i * staggerDelay + Math.random() * 0.05,
              ease: animationEase,
            }
          );
        }
      });

      // Animate labels
      labelsRef.current.forEach((label, i) => {
        if (label) {
          gsap.fromTo(
            label,
            { opacity: 0, y: 10 },
            {
              opacity: 1,
              y: 0,
              duration: animationDuration * 0.8,
              delay: i * staggerDelay + 0.1,
              ease: 'power2.out',
            }
          );
        }
      });
    }
  }, [isOpen, animationDuration, staggerDelay, animationEase]);

  const handleItemClick = (item: MenuItem) => {
    if (onItemClick) {
      onItemClick(item);
    }
  };

  const handleHover = (index: number, isEntering: boolean) => {
    const bubble = bubblesRef.current[index];
    const item = items[index];

    if (bubble && item.hoverStyles) {
      gsap.to(bubble, {
        backgroundColor: isEntering ? item.hoverStyles.bgColor : menuBg,
        color: isEntering ? item.hoverStyles.textColor : menuContentColor,
        scale: isEntering ? 1.05 : 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  // Grid positions for 5 items (like the React Bits layout)
  const positions = [
    { gridArea: '1 / 1 / 2 / 2', rotation: items[0]?.rotation || -9 },
    { gridArea: '1 / 2 / 2 / 3', rotation: items[1]?.rotation || 5 },
    { gridArea: '1 / 3 / 2 / 4', rotation: items[2]?.rotation || -3 },
    { gridArea: '2 / 1 / 3 / 2', rotation: items[3]?.rotation || 7, marginLeft: '60px' },
    { gridArea: '2 / 2 / 3 / 3', rotation: items[4]?.rotation || -5, marginLeft: '40px' },
  ];

  return (
    <nav ref={navRef} className="bubble-menu-nav">
      <div className="bubble-menu-container">
        {items.map((item, index) => {
          const isSelected = selectedItems.includes(item.label);
          const pos = positions[index] || { gridArea: 'auto', rotation: 0 };

          return (
            <div
              key={item.label}
              ref={(el) => { bubblesRef.current[index] = el; }}
              className={`bubble-item ${isSelected ? 'selected' : ''}`}
              style={{
                gridArea: pos.gridArea,
                transform: `rotate(${pos.rotation}deg)`,
                marginLeft: (pos as any).marginLeft || 0,
                backgroundColor: isSelected ? item.hoverStyles?.bgColor : menuBg,
                color: isSelected ? item.hoverStyles?.textColor : menuContentColor,
                boxShadow: isSelected
                  ? `0 0 30px ${item.hoverStyles?.bgColor}80, 0 0 60px ${item.hoverStyles?.bgColor}40`
                  : '0 4px 20px rgba(0, 0, 0, 0.15)',
              }}
              onClick={() => handleItemClick(item)}
              onMouseEnter={() => !isSelected && handleHover(index, true)}
              onMouseLeave={() => !isSelected && handleHover(index, false)}
            >
              <span
                ref={(el) => { labelsRef.current[index] = el; }}
                className="bubble-label"
              >
                {item.label}
              </span>
              {isSelected && (
                <span className="bubble-check">✓</span>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}