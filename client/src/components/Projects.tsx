import { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation } from 'wouter';

// ---------------------------------------------------------------------------
// Project data
// ---------------------------------------------------------------------------
interface Project {
  id: number;
  slug: string;
  title: string;
  year: string;
  image?: string;
  imgFit?: 'cover' | 'contain';
  imgBg?: string; // background color when using contain
}

const projects: Project[] = [
  { id: 1,  slug: 'gide-latam',         title: 'GIDE LATAM & UTDT',    year: '2025',    image: '/projects/gide-latam.png'         },
  { id: 2,  slug: 'nippon-foundation',   title: 'Nippon Foundation',    year: '2024',    image: '/projects/nippon-foundation.jpg'  },
  { id: 3,  slug: 'bearvfx',            title: 'BEARVFX',              year: '2024',    image: '/projects/bearvfx.jpg?v=20260418' },
  { id: 4,  slug: 'cobalt',             title: 'CoBALT',               year: '2024',    image: '/projects/cobalt.png'             },
  { id: 5,  slug: 'gdg-minerva',        title: 'Google Dev Group',     year: '2024',    image: '/projects/gdg-minerva.jpg'        },
  { id: 6,  slug: 'breakthrough',       title: 'Breakthrough Pittsburgh', year: '2024', image: '/projects/breakthrough.png'       },
  { id: 7,  slug: 'ai-tech-society',    title: 'AI & Tech Society',    year: '2021-23', image: '/projects/ai-tech-society.jpg'    },
  { id: 8,  slug: 'lgs-islamabad',      title: 'LGS Islamabad',        year: '2021-23', image: '/projects/lgs-islamabad.png',      imgFit: 'contain', imgBg: '#ffffff' },
  { id: 9,  slug: 'edgur',              title: 'Edgur',                year: '2025',    image: '/projects/edgur.png'              },
];

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const N          = projects.length;
const ANGLE_STEP = 360 / N;

// Scroll phases
const PHASE1_RANGE = 700; // scroll units to transition camera

// Camera bounds (from scroll phase)
const TILT_START  = -30;
const TILT_END    = -5;
const SCALE_START = 0.52;
const SCALE_END   = 1.0;

// Motion
const LERP           = 0.065;
const FRICTION       = 0.92;
const DRAG_SENS      = 0.22;
const SCROLL_SENS    = 0.02;
const DRAG_THRESHOLD = 7;

// Hover parallax
const HOVER_LERP       = 0.022; // slow, cinematic
const HOVER_TILT_RANGE = 60;    // ±30° rotateX from cursor Y
const HOVER_ROT_RANGE  = 24;    // ±12° rotateY from cursor X

// Card dimensions (desktop)
const CARD_W_D  = 300;
const CARD_H_D  = 158;
const LABEL_H_D = 44;
const PERSP_D   = 1600;

// Card dimensions (mobile)
const CARD_W_M  = 190;
const CARD_H_M  = 100;
const LABEL_H_M = 32;
const PERSP_M   = 1000;

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------
function computeRadius(cardWidth: number): number {
  // Apothem × 1.06 → tight gap, clearly polygonal
  return (cardWidth / (2 * Math.tan(Math.PI / N))) * 1.06;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function Projects() {
  const [, setLocation] = useLocation();

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const cardW  = isMobile ? CARD_W_M  : CARD_W_D;
  const cardH  = isMobile ? CARD_H_M  : CARD_H_D;
  const labelH = isMobile ? LABEL_H_M : LABEL_H_D;
  const persp  = isMobile ? PERSP_M   : PERSP_D;
  const radius = computeRadius(cardW);

  // ── Scroll accumulator ────────────────────────────────────────────────────
  const scrollTargetRef  = useRef(0);
  const scrollDisplayRef = useRef(0);
  const scrollVelRef     = useRef(0);

  // ── Spin (phase-2 scroll → rotation) ─────────────────────────────────────
  const spinTargetRef  = useRef(0);
  const spinDisplayRef = useRef(0);

  // ── Drag ──────────────────────────────────────────────────────────────────
  const dragAngleRef    = useRef(0);
  const dragVelRef      = useRef(0);
  const isDragging      = useRef(false);
  const lastPtrX        = useRef(0);
  const dragStartX      = useRef(0);
  const hasDraggedRef   = useRef(false);
  const clickSlugRef    = useRef<string | null>(null);

  // ── Hover parallax ────────────────────────────────────────────────────────
  const mousePosRef   = useRef({ x: 0.5, y: 0.5 }); // normalized, center default
  const hoverTiltXRef = useRef(0); // lerped rotateX contribution
  const hoverRotYRef  = useRef(0); // lerped rotateY contribution

  // ── Warp (upward drift on scroll) ─────────────────────────────────────────
  const warpDisplayRef = useRef(0);

  // ── DOM refs ──────────────────────────────────────────────────────────────
  const wrapperRef   = useRef<HTMLDivElement>(null);
  const sceneRef     = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef       = useRef(0);

  // ── RAF loop ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const loop = () => {
      // 1. Scroll accumulator (clamp ≥ 0)
      scrollTargetRef.current  += scrollVelRef.current;
      scrollTargetRef.current   = Math.max(0, scrollTargetRef.current);
      scrollVelRef.current     *= FRICTION;

      // 2. Lerp display scroll
      scrollDisplayRef.current += (scrollTargetRef.current - scrollDisplayRef.current) * LERP;
      const sd = scrollDisplayRef.current;

      // 3. Camera from scroll phase 1
      const progress = Math.min(1, sd / PHASE1_RANGE);
      const baseTilt = TILT_START + progress * (TILT_END - TILT_START);
      const scale    = SCALE_START + progress * (SCALE_END - SCALE_START);

      // 4. Phase-2 spin from scroll overflow
      spinTargetRef.current   = Math.max(0, sd - PHASE1_RANGE) * SCROLL_SENS;
      spinDisplayRef.current += (spinTargetRef.current - spinDisplayRef.current) * LERP;

      // 5. Drag momentum
      if (!isDragging.current) {
        dragAngleRef.current += dragVelRef.current;
        dragVelRef.current   *= FRICTION;
      }

      // 6. Hover parallax - slow cinematic lerp
      const targetHoverTiltX = (0.5 - mousePosRef.current.y) * HOVER_TILT_RANGE;
      hoverTiltXRef.current  += (targetHoverTiltX - hoverTiltXRef.current) * HOVER_LERP;

      const targetHoverRotY = (mousePosRef.current.x - 0.5) * HOVER_ROT_RANGE;
      hoverRotYRef.current  += (targetHoverRotY - hoverRotYRef.current) * HOVER_LERP;

      // 7. Final camera tilt = scroll phase + hover tilt
      //    Clamp: max 2° (nearly horizontal), min baseTilt-25°
      const rawTilt    = baseTilt + hoverTiltXRef.current;
      const finalTilt  = Math.max(baseTilt - 25, Math.min(2, rawTilt));

      // 8. Final rotation = spin + drag + hover X nudge
      const totalRot = spinDisplayRef.current + dragAngleRef.current + hoverRotYRef.current;

      // 9. Apply scene transform
      if (sceneRef.current) {
        sceneRef.current.style.transform =
          `scale(${scale.toFixed(4)}) rotateX(${finalTilt.toFixed(3)}deg) rotateY(${totalRot.toFixed(3)}deg)`;
      }

      // 10. Warp: ring drifts upward as scroll accumulates (max −28px)
      const warpTarget = -Math.min(28, sd * 0.04);
      warpDisplayRef.current += (warpTarget - warpDisplayRef.current) * 0.05;
      if (wrapperRef.current) {
        wrapperRef.current.style.transform =
          `translateY(${warpDisplayRef.current.toFixed(2)}px)`;
      }

      // 11. Per-card depth opacity
      for (let i = 0; i < N; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;
        const rawAngle = (i * ANGLE_STEP - totalRot % 360 + 360) % 360;
        const depth    = (Math.cos((rawAngle * Math.PI) / 180) + 1) / 2;
        el.style.opacity = String(0.40 + depth * 0.60);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // ── Wheel ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      scrollVelRef.current += e.deltaY;
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // ── Mouse position for hover parallax ─────────────────────────────────────
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    mousePosRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top)  / rect.height,
    };
  }, []);

  const onMouseLeave = useCallback(() => {
    // Reset to center so tilt returns to neutral
    mousePosRef.current = { x: 0.5, y: 0.5 };
  }, []);

  // ── Pointer drag + tap ────────────────────────────────────────────────────
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current    = true;
    lastPtrX.current      = e.clientX;
    dragStartX.current    = e.clientX;
    hasDraggedRef.current = false;
    dragVelRef.current    = 0;
    const cardEl = (e.target as HTMLElement).closest('[data-slug]');
    clickSlugRef.current  = cardEl ? (cardEl as HTMLElement).dataset.slug ?? null : null;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    if (Math.abs(e.clientX - dragStartX.current) > DRAG_THRESHOLD) {
      hasDraggedRef.current = true;
    }
    const dx    = e.clientX - lastPtrX.current;
    lastPtrX.current = e.clientX;
    const delta = dx * DRAG_SENS;
    dragAngleRef.current += delta;
    dragVelRef.current    = delta;
  }, []);

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
    if (!hasDraggedRef.current && clickSlugRef.current) {
      setLocation(`/project/${clickSlugRef.current}`);
    }
    clickSlugRef.current = null;
  }, [setLocation]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="w-full flex flex-col items-center">

      {/* Warp wrapper - subtle upward drift on scroll */}
      <div ref={wrapperRef} style={{ width: '100%', willChange: 'transform' }}>

        {/* Perspective camera */}
        <div
          ref={containerRef}
          className="relative w-full flex items-center justify-center select-none"
          style={{
            height: '78vh',
            perspective: persp,
            perspectiveOrigin: '50% 50%',
            touchAction: 'none',
            cursor: 'grab',
            overflow: 'visible',
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
        >
          {/* 3D scene */}
          <div
            ref={sceneRef}
            style={{
              width: cardW,
              height: cardH + labelH,
              transformStyle: 'preserve-3d',
              transform: `scale(${SCALE_START}) rotateX(${TILT_START}deg) rotateY(0deg)`,
              willChange: 'transform',
              position: 'relative',
            }}
          >
            {projects.map((project, i) => (
              <div
                key={project.id}
                ref={(el) => { cardRefs.current[i] = el; }}
                data-slug={project.slug}
                className="absolute top-0 left-0"
                style={{
                  width: cardW,
                  height: cardH + labelH,
                  transform: `rotateY(${i * ANGLE_STEP}deg) translateZ(${radius}px)`,
                  willChange: 'opacity',
                  cursor: 'pointer',
                }}
              >
                {/* Card - clipPath inset for guaranteed rounded corners */}
                <div
                  style={{
                    width: cardW,
                    height: cardH,
                    background: project.imgBg ?? 'var(--card)',
                    border: '1px solid color-mix(in srgb, var(--foreground) 70%, transparent)',
                    borderRadius: 12,
                    boxShadow: '0 4px 22px rgba(0,0,0,0.09)',
                    clipPath: 'inset(0 round 12px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    backfaceVisibility: 'hidden',
                  }}
                >
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      draggable={false}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: project.imgFit ?? 'cover',
                        objectPosition: 'center',
                        display: 'block',
                        userSelect: 'none',
                        background: project.imgBg ?? 'transparent',
                      }}
                    />
                  ) : (
                    <svg
                      width="26" height="26" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor"
                      strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
                      style={{ color: 'var(--muted-foreground)', opacity: 0.22 }}
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="m21 15-5-5L5 21" />
                    </svg>
                  )}
                </div>

                {/* Label below card */}
                <div style={{
                  width: cardW, height: labelH,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  paddingTop: 8, gap: 2,
                }}>
                  <span style={{
                    fontFamily: '"League Spartan", sans-serif',
                    textTransform: 'uppercase', letterSpacing: '0.07em',
                    fontSize: isMobile ? 8 : 10, fontWeight: 600,
                    color: 'var(--foreground)', whiteSpace: 'nowrap',
                  }}>
                    {project.title}
                  </span>
                  <span style={{
                    fontFamily: '"League Spartan", sans-serif',
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                    fontSize: isMobile ? 7 : 8, fontWeight: 500,
                    color: 'var(--muted-foreground)', opacity: 0.6,
                  }}>
                    {project.year}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hint */}
      <p style={{
        marginTop: 8, fontSize: 9, letterSpacing: '0.14em',
        textTransform: 'uppercase', fontFamily: '"League Spartan", sans-serif',
        color: 'var(--muted-foreground)', opacity: 0.3,
      }}>
        scroll or drag · tap any card
      </p>
    </div>
  );
}
