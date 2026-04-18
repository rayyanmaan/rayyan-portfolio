import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';

interface BuildCard {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  image?: string;
}

const builds: BuildCard[] = [
  { id: 1, slug: 'swapcircle', title: 'SwapCircle', subtitle: 'Campus exchange · Next.js · FastAPI · MongoDB', image: '/builds/swap.jpeg' },
  { id: 2, slug: 'bayesian-sports-attendance-predictions', title: 'Bayesian Sports Predictions', subtitle: 'Hierarchical modelling · PyMC · ArviZ', image: '/builds/bayesian.jpeg' },
  { id: 3, slug: 'connectfour', title: 'Connect Four AI', subtitle: 'Minimax · Alpha-Beta pruning · Pygame', image: '/builds/connect4.jpeg' },
  { id: 4, slug: 'studyspot-finder', title: 'StudySpot Finder', subtitle: 'Logic programming · Python · SWI-Prolog', image: '/builds/studyspot.jpg' },
  { id: 5, slug: 'uhi-explorer', title: 'UHI Explorer', subtitle: 'Satellite analysis · Next.js · Earth Engine', image: '/builds/uhi-platform.jpeg' },
  { id: 6, slug: 'taskflow', title: 'TaskFlow', subtitle: 'Hierarchical tasks · Flask · SQLAlchemy' },
];

const TASKFLOW_DESKTOP_IMAGE = '/builds/task.jpeg';

const AUTO_SPEED_PX = 18;
const WHEEL_SPEED = 0.74;
const DRAG_MOMENTUM = 0.24;
const FRICTION = 0.9;
const DRAG_THRESHOLD = 6;
const HEIGHT_CURVE_POWER = 1.95;
const DEPTH_FAR_PX = -500;
const DEPTH_NEAR_PX = 220;
const EDGE_TURN_DEG = 66;
const SCALE_CENTER = 0.8;
const SCALE_EDGE = 1.08;
const TILT_X_DEG = 7;
const OPACITY_CENTER = 1.0;
const OPACITY_EDGE = 1.0;
const BLUR_MAX_PX = 0;
const CARD_RADIUS_DESKTOP = 16;
const CARD_RADIUS_MOBILE = 14;

function getBuildSlugFromElement(el: Element | null): string | null {
  if (!el) return null;
  const card = (el as HTMLElement).closest('[data-build-slug]') as HTMLElement | null;
  return card?.dataset.buildSlug ?? null;
}

export default function Builds() {
  const [, setLocation] = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isDraggingUi, setIsDraggingUi] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const rafRef = useRef(0);
  const lastTsRef = useRef(0);

  const offsetRef = useRef(0);
  const velocityRef = useRef(0);

  const isDraggingRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);
  const lastXRef = useRef(0);
  const dragStartXRef = useRef(0);
  const suppressClickRef = useRef(false);
  const dragStartSlugRef = useRef<string | null>(null);

  const cardW = isMobile ? 234 : 364;
  const minCardH = isMobile ? 126 : 154;
  const maxCardH = isMobile ? 172 : 208;
  const labelH = isMobile ? 44 : 52;
  const cardGap = isMobile ? -14 : -24;
  const trackOffsetY = isMobile ? 10 : 18;
  const step = cardW + cardGap;
  const loopWidth = step * builds.length;

  const openBuild = useCallback((slug: string) => {
    setLocation(`/project/${slug}?from=builds`);
  }, [setLocation]);

  const slugFromPoint = useCallback((x: number, y: number) => {
    return getBuildSlugFromElement(document.elementFromPoint(x, y));
  }, []);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 840);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const applyTransforms = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerWidth = Math.max(1, container.clientWidth);
    const containerHeight = Math.max(1, container.clientHeight);
    const halfWidth = containerWidth / 2;
    const bandCenterY = containerHeight * (isMobile ? 0.52 : 0.54) + trackOffsetY;

    for (let i = 0; i < builds.length; i++) {
      const item = itemRefs.current[i];
      if (!item) continue;

      let centerOffset = (i + 0.5) * step - offsetRef.current;
      centerOffset = ((centerOffset + loopWidth / 2) % loopWidth + loopWidth) % loopWidth - loopWidth / 2;

      const screenCenterX = halfWidth + centerOffset;
      const edgeNorm = Math.min(1, Math.abs(screenCenterX - halfWidth) / halfWidth);
      const easedEdge = edgeNorm * edgeNorm * (3 - 2 * edgeNorm);
      const curve = Math.pow(easedEdge, HEIGHT_CURVE_POWER);
      const heightMix = 0.35 + 0.65 * curve;
      const dynamicCardH = minCardH + (maxCardH - minCardH) * heightMix;
      const depth = DEPTH_FAR_PX + curve * (DEPTH_NEAR_PX - DEPTH_FAR_PX);
      const signedNorm = (screenCenterX - halfWidth) / halfWidth;
      const turn = -Math.sign(signedNorm) * Math.pow(Math.abs(signedNorm), 1.14) * EDGE_TURN_DEG;

      const scale = SCALE_CENTER + curve * (SCALE_EDGE - SCALE_CENTER);
      const tiltX = curve * TILT_X_DEG;
      const opacity = OPACITY_CENTER + curve * (OPACITY_EDGE - OPACITY_CENTER);
      const blur = BLUR_MAX_PX * (1 - curve);
      const zIndex = Math.round(12 + curve * 26);
      const shadowSpread = 6 + curve * 24;
      const shadowBlur = 14 + curve * 30;
      const shadowOpacity = 0.12 + curve * 0.22;

      const left = Math.round(screenCenterX - cardW / 2);
      const top = Math.round(bandCenterY - dynamicCardH / 2);

      item.style.transform = `translate3d(${left}px, ${top}px, 0)`;
      item.style.opacity = opacity.toFixed(3);
      item.style.zIndex = String(zIndex);
      item.style.setProperty('--stream-depth', `${depth.toFixed(2)}px`);
      item.style.setProperty('--stream-turn', `${turn.toFixed(2)}deg`);
      item.style.setProperty('--stream-scale', scale.toFixed(4));
      item.style.setProperty('--stream-tilt-x', `${tiltX.toFixed(2)}deg`);
      item.style.setProperty('--stream-blur', `${blur.toFixed(2)}px`);
      item.style.setProperty('--stream-shadow', `0 ${shadowSpread.toFixed(1)}px ${shadowBlur.toFixed(1)}px rgba(0,0,0,${shadowOpacity.toFixed(3)})`);
      item.style.setProperty('--stream-card-h', `${dynamicCardH.toFixed(2)}px`);
      item.style.setProperty('--stream-label-y', `${(dynamicCardH + (isMobile ? 7 : 8)).toFixed(2)}px`);
    }
  }, [cardW, isMobile, loopWidth, maxCardH, minCardH, step, trackOffsetY]);

  useEffect(() => {
    const loop = (ts: number) => {
      if (!lastTsRef.current) {
        lastTsRef.current = ts;
      }

      const dt = Math.min(0.05, (ts - lastTsRef.current) / 1000);
      lastTsRef.current = ts;

      if (!isDraggingRef.current) {
        if (!reduceMotion) {
          offsetRef.current += AUTO_SPEED_PX * dt;
        }

        offsetRef.current += velocityRef.current;
        const damping = 1 - Math.pow(FRICTION, dt * 60);
        velocityRef.current += (0 - velocityRef.current) * damping;

        if (Math.abs(velocityRef.current) < 0.002) {
          velocityRef.current = 0;
        }
      }

      offsetRef.current = ((offsetRef.current % loopWidth) + loopWidth) % loopWidth;
      applyTransforms();
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      lastTsRef.current = 0;
    };
  }, [applyTransforms, loopWidth, reduceMotion]);

  useEffect(() => {
    applyTransforms();
  }, [applyTransforms, cardW, labelH, maxCardH, minCardH]);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    dragStartSlugRef.current = getBuildSlugFromElement(e.target as Element);
    isDraggingRef.current = true;
    setIsDraggingUi(true);
    pointerIdRef.current = e.pointerId;
    lastXRef.current = e.clientX;
    dragStartXRef.current = e.clientX;
    velocityRef.current = 0;
    suppressClickRef.current = false;

    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || pointerIdRef.current !== e.pointerId) return;

    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;

    if (Math.abs(e.clientX - dragStartXRef.current) > DRAG_THRESHOLD) {
      suppressClickRef.current = true;
    }

    offsetRef.current -= dx;
    velocityRef.current = -dx * DRAG_MOMENTUM;
    applyTransforms();
  }, [applyTransforms]);

  const onWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();

    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (!Number.isFinite(delta) || delta === 0) return;

    offsetRef.current += delta * WHEEL_SPEED;
    velocityRef.current = delta * 0.16;
    applyTransforms();
  }, [applyTransforms]);

  const endDrag = useCallback((target: HTMLDivElement, pointerId: number) => {
    if (target.hasPointerCapture(pointerId)) {
      target.releasePointerCapture(pointerId);
    }

    isDraggingRef.current = false;
    setIsDraggingUi(false);
    pointerIdRef.current = null;

    if (suppressClickRef.current) {
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    }
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== e.pointerId) return;

    const startedSlug = dragStartSlugRef.current;
    const endedSlug = slugFromPoint(e.clientX, e.clientY);
    const shouldOpen = !suppressClickRef.current && !!startedSlug && startedSlug === endedSlug;

    endDrag(e.currentTarget, e.pointerId);

    if (shouldOpen && startedSlug) {
      openBuild(startedSlug);
    }

    dragStartSlugRef.current = null;
  }, [endDrag, openBuild, slugFromPoint]);

  const onPointerCancel = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== e.pointerId) return;
    endDrag(e.currentTarget, e.pointerId);
    dragStartSlugRef.current = null;
  }, [endDrag]);

  return (
    <div className="w-full flex flex-col items-center">
      <div style={{ width: '100%' }}>
        <div
          ref={containerRef}
          className="relative mx-auto w-full select-none"
          style={{
            height: isMobile ? 316 : 460,
            perspective: isMobile ? 540 : 660,
            perspectiveOrigin: '50% 52%',
            transformStyle: 'preserve-3d',
            touchAction: 'pan-y pinch-zoom',
            cursor: isDraggingUi ? 'grabbing' : 'grab',
            overflow: 'hidden',
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          onWheel={onWheel}
          >
          {builds.map((build, i) => {
            const displayImage = build.slug === 'taskflow' ? (isMobile ? undefined : TASKFLOW_DESKTOP_IMAGE) : build.image;
            const cardRadius = isMobile ? CARD_RADIUS_MOBILE : CARD_RADIUS_DESKTOP;

            return (
            <button
              key={build.id}
              ref={(el) => { itemRefs.current[i] = el; }}
              data-build-slug={build.slug}
              type="button"
              aria-label={`Open ${build.title}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openBuild(build.slug);
                }
              }}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: cardW,
                height: `calc(var(--stream-card-h, ${minCardH}px) + ${labelH}px + 10px)`,
                transform: 'translate3d(0, 0, 0)',
                border: 'none',
                borderRadius: 0,
                background: 'transparent',
                color: 'var(--foreground)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                justifyContent: 'flex-start',
                overflowX: 'hidden',
                overflowY: 'visible',
                padding: 0,
                textAlign: 'center',
                willChange: 'transform, opacity',
                transformStyle: 'preserve-3d',
              }}
            >
              <div
                style={{
                  width: cardW,
                  height: `var(--stream-card-h, ${minCardH}px)`,
                  background: 'var(--card)',
                  border: '1px solid color-mix(in srgb, var(--foreground) 68%, transparent)',
                  borderRadius: cardRadius,
                  clipPath: `inset(0 round ${cardRadius}px)`,
                  boxSizing: 'border-box',
                  position: 'relative',
                  boxShadow: '0 4px 22px rgba(0,0,0,0.09), var(--stream-shadow, 0 10px 24px rgba(0,0,0,0.14))',
                  transformStyle: 'preserve-3d',
                  transform: 'translateZ(var(--stream-depth, 0px)) rotateY(var(--stream-turn, 0deg)) rotateX(var(--stream-tilt-x, 0deg)) scale(var(--stream-scale, 1))',
                  transformOrigin: '50% 50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  padding: 0,
                  backfaceVisibility: 'hidden',
                }}
              >
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt={build.title}
                    draggable={false}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      display: 'block',
                      userSelect: 'none',
                      backfaceVisibility: 'hidden',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(140deg, color-mix(in srgb, var(--card) 86%, var(--background) 14%) 0%, color-mix(in srgb, var(--background) 88%, var(--card) 12%) 100%)',
                    }}
                  />
                )}
              </div>

                <div
                  style={{
                    position: 'absolute',
                    top: `var(--stream-label-y, ${minCardH + 8}px)`,
                    left: 0,
                    width: cardW,
                    height: labelH,
                    paddingTop: isMobile ? 7 : 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: 3,
                    background: 'transparent',
                  }}
                >
                <span
                  style={{
                    fontFamily: '"League Spartan", sans-serif',
                    fontSize: isMobile ? 10 : 11,
                    fontWeight: 700,
                    letterSpacing: '0.11em',
                    textTransform: 'uppercase',
                    color: 'var(--foreground)',
                    lineHeight: 1.1,
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    maxWidth: '92%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {build.title}
                </span>
                <span
                  style={{
                    fontFamily: '"League Spartan", sans-serif',
                    fontSize: isMobile ? 8 : 8.5,
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--muted-foreground)',
                    opacity: 0.82,
                    lineHeight: 1.2,
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    maxWidth: '92%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {build.subtitle}
                </span>
              </div>
            </button>
            );
          })}

        </div>
      </div>

      <p
        style={{
            marginTop: 12,
          textAlign: 'center',
          fontFamily: '"League Spartan", sans-serif',
          fontSize: 9,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--muted-foreground)',
            opacity: 0.5,
        }}
      >
        drag, scroll, or swipe · tap a card to open
      </p>
    </div>
  );
}
