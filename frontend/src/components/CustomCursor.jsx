import { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const ringRef = useRef(null);
  const lightRef = useRef(null);

  const [hovered, setHovered] = useState(false);
  const [hoverType, setHoverType] = useState('default'); // 'button', 'card', 'link'
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Check if touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true);
      return;
    }

    let targetX = -100;
    let targetY = -100;
    let ringX = -100;
    let ringY = -100;
    let animId = null;

    const onMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (lightRef.current) {
        lightRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;
      }

      // Check hover targets
      const target = e.target.closest('button, a, input, select, textarea, [data-magnetic], .card-hover, .cursor-hover');
      if (target) {
        setHovered(true);
        if (target.tagName === 'BUTTON' || target.hasAttribute('data-magnetic')) {
          setHoverType('button');
        } else if (target.classList.contains('card-hover')) {
          setHoverType('card');
        } else {
          setHoverType('link');
        }
      } else {
        setHovered(false);
        setHoverType('default');
      }
    };

    const render = () => {
      // Lerp ring for smooth delayed follow physics
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }

      animId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', onMouseMove);
    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  if (isTouch) return null;

  return (
    <>
      {/* Ambient Cursor-Following Radial Light */}
      <div
        ref={lightRef}
        className="pointer-events-none fixed top-0 left-0 z-30 h-[500px] w-[500px] rounded-full opacity-60 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 45%, transparent 70%)',
          willChange: 'transform',
        }}
      />

      {/* Smooth Ring Cursor (Inner dot removed) */}
      <div
        ref={ringRef}
        className={`pointer-events-none fixed top-0 left-0 z-50 rounded-full border border-zinc-400/80 transition-all duration-200 ease-out ${
          hovered
            ? hoverType === 'button'
              ? 'h-11 w-11 border-zinc-200 bg-zinc-200/10 scale-100'
              : hoverType === 'card'
              ? 'h-14 w-14 border-zinc-500/50 bg-zinc-500/5 scale-100'
              : 'h-9 w-9 border-zinc-300 scale-100'
            : 'h-7 w-7 border-zinc-500/60 opacity-80'
        }`}
        style={{ willChange: 'transform' }}
      />
    </>
  );
}
