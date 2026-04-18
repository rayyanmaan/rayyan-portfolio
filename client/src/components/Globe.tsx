import { useEffect, useRef, useState } from 'react';
import createGlobe from 'cobe';
import { MotionValue } from 'framer-motion';
import { useLocation } from 'wouter';

/**
 * TransparentImage
 * ----------------
 * Removes the background of a sticker PNG by sampling the edge color and
 * flood-filling contiguous pixels within a small tolerance.
 *
 * Why this exists: some source PNGs (matcha, fernsehturm, tshirts) ship with
 * a light-grey or off-white background that clashes with dark mode. A naive
 * "make all whites transparent" threshold eats interior white content (e.g.
 * the whites on the Buenos Aires tshirt). Edge-seeded flood-fill only removes
 * pixels that are actually *connected* to the outer edge, so interior whites
 * are preserved.
 */
function TransparentImage({
  src,
  alt,
  className,
  style,
}: {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [dataUrl, setDataUrl] = useState(src);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const W = canvas.width;
      const H = canvas.height;

      // Sample the average color of the 4 corners  -  that's our "background".
      const sampleIdx = [0, (W - 1) * 4, (H - 1) * W * 4, ((H - 1) * W + (W - 1)) * 4];
      let sr = 0, sg = 0, sb = 0;
      for (const i of sampleIdx) {
        sr += data[i];
        sg += data[i + 1];
        sb += data[i + 2];
      }
      sr = Math.round(sr / 4);
      sg = Math.round(sg / 4);
      sb = Math.round(sb / 4);

      // Only run if the background is actually light (>= ~200 avg).
      // For dark/colored backgrounds, leave the image alone.
      const avg = (sr + sg + sb) / 3;
      if (avg < 200) {
        setDataUrl(src);
        return;
      }

      const TOL = 10; // how close a pixel must be to the sampled bg to be considered background
      const matches = (idx: number) =>
        Math.abs(data[idx] - sr) <= TOL &&
        Math.abs(data[idx + 1] - sg) <= TOL &&
        Math.abs(data[idx + 2] - sb) <= TOL;

      const visited = new Uint8Array(W * H);
      const queue = new Int32Array(W * H);
      let head = 0;
      let tail = 0;

      // Seed BFS from every edge pixel that matches the background color.
      const pushIfBg = (px: number) => {
        const p4 = px * 4;
        if (!visited[px] && matches(p4)) {
          visited[px] = 1;
          queue[tail++] = px;
        }
      };
      for (let x = 0; x < W; x++) {
        pushIfBg(x);
        pushIfBg((H - 1) * W + x);
      }
      for (let y = 0; y < H; y++) {
        pushIfBg(y * W);
        pushIfBg(y * W + (W - 1));
      }

      while (head < tail) {
        const idx = queue[head++];
        const x = idx % W;
        const y = Math.floor(idx / W);
        const p4 = idx * 4;

        // Soft edge: fully transparent if it's essentially the bg color,
        // slight alpha otherwise.
        const dr = Math.abs(data[p4] - sr);
        const dg = Math.abs(data[p4 + 1] - sg);
        const db = Math.abs(data[p4 + 2] - sb);
        const dist = Math.max(dr, dg, db);
        if (dist <= 3) {
          data[p4 + 3] = 0;
        } else {
          data[p4 + 3] = Math.max(0, Math.floor((dist - 3) * 30));
        }

        // 4-connected flood-fill
        if (x > 0) {
          const n = idx - 1;
          if (!visited[n] && matches(n * 4)) {
            visited[n] = 1;
            queue[tail++] = n;
          }
        }
        if (x < W - 1) {
          const n = idx + 1;
          if (!visited[n] && matches(n * 4)) {
            visited[n] = 1;
            queue[tail++] = n;
          }
        }
        if (y > 0) {
          const n = idx - W;
          if (!visited[n] && matches(n * 4)) {
            visited[n] = 1;
            queue[tail++] = n;
          }
        }
        if (y < H - 1) {
          const n = idx + W;
          if (!visited[n] && matches(n * 4)) {
            visited[n] = 1;
            queue[tail++] = n;
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);
      setDataUrl(canvas.toDataURL('image/png'));
    };
  }, [src]);

  return <img src={dataUrl} alt={alt} className={className} style={style} draggable={false} />;
}

interface CityInfo {
  name: string;
  slug: CitySlug;
  coords: [number, number];
  symbol: string;
  folderLabel: string;
}

type CitySlug =
  | 'islamabad'
  | 'san-francisco'
  | 'taipei'
  | 'seoul'
  | 'tokyo'
  | 'buenos-aires'
  | 'berlin';

type FolderPosition =
  | { side: 'left'; top: string; left: string }
  | { side: 'right'; top: string; right: string };

interface CityLabelLayout {
  offsetX: string;
  offsetY: string;
  rotate: string;
  fontSize: string;
  letterSpacing: string;
  fontWeight: number;
}

interface CityIconLayout {
  offsetX: string;
  offsetY: string;
  rotate: string;
  transformOrigin: string;
}

interface CityStickerLayout {
  position: FolderPosition;
  sizeClass: string;
  icon?: Partial<CityIconLayout>;
  label: CityLabelLayout;
}

const defaultIconLayout: CityIconLayout = {
  offsetX: '0px',
  offsetY: '0px',
  rotate: '0deg',
  transformOrigin: '50% 50%',
};

const cities: CityInfo[] = [
  {
    name: 'Islamabad',
    slug: 'islamabad',
    coords: [33.6844, 73.0479],
    symbol: '/symbols/islamabad.png',
    folderLabel: 'islamabad',
  },
  {
    name: 'San Francisco',
    slug: 'san-francisco',
    coords: [37.7749, -122.4194],
    symbol: '/symbols/san-francisco.png',
    folderLabel: 'san francisco',
  },
  {
    name: 'Taipei',
    slug: 'taipei',
    coords: [25.033, 121.5654],
    symbol: '/symbols/taipei.png',
    folderLabel: 'taipei',
  },
  {
    name: 'Seoul',
    slug: 'seoul',
    coords: [37.5665, 126.978],
    symbol: '/symbols/seoul.png',
    folderLabel: 'seoul',
  },
  {
    name: 'Tokyo',
    slug: 'tokyo',
    coords: [35.6762, 139.6503],
    symbol: '/symbols/tokyo.png',
    folderLabel: 'tokyo',
  },
  {
    name: 'Buenos Aires',
    slug: 'buenos-aires',
    coords: [-34.6037, -58.3816],
    symbol: '/symbols/buenos-aires.png',
    folderLabel: 'buenos aires',
  },
  {
    name: 'Berlin',
    slug: 'berlin',
    coords: [52.52, 13.405],
    symbol: '/symbols/berlin.png',
    folderLabel: 'berlin',
  },
];

// Manual per-city controls.
// Edit each city here to change:
// 1) sticker position around the globe (`position`)
// 2) sticker size (`sizeClass`)
// 3) icon axis independently from text (`icon.offsetX` / `icon.offsetY` / `icon.transformOrigin`)
// 4) city-name placement under each sticker (`label.offsetX` / `label.offsetY` / `label.rotate`)
const cityStickerLayout: Record<CitySlug, CityStickerLayout> = {
  islamabad: {
    position: { side: 'left', top: '25%', left: '10%' },
    sizeClass: 'w-14 h-28 sm:w-20 sm:h-36 md:w-40 md:h-40',
    label: {
      offsetX: '2px',
      offsetY: '1px',
      rotate: '0deg',
      fontSize: 'clamp(10px, 1.2vw, 13px)',
      letterSpacing: '0.02em',
      fontWeight: 600,
    },
  },
  'san-francisco': {
    position: { side: 'left', top: '40%', left: '-7%' },
    sizeClass: 'w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32',
    label: {
      offsetX: '0px',
      offsetY: '20px',
      rotate: '0deg',
      fontSize: 'clamp(10px, 1.2vw, 13px)',
      letterSpacing: '0.02em',
      fontWeight: 600,
    },
  },
  taipei: {
    position: { side: 'left', top: '54%', left: '5%' },
    sizeClass: 'w-20 h-20 sm:w-28 sm:h-28 md:w-50 md:h-50',
    // Taipei: adjust spin axis + icon shift without changing label anchor.
    icon: {
      offsetX: '0px',
      offsetY: '30px',
      transformOrigin: '50% 46%',
    },
    label: {
      offsetX: '0px',
      offsetY: '-8px',
      rotate: '0deg',
      fontSize: 'clamp(10px, 1.2vw, 13px)',
      letterSpacing: '0.02em',
      fontWeight: 600,
    },
  },
  seoul: {
    position: { side: 'left', top: '70%', left: '-10%' },
    sizeClass: 'w-18 h-18 sm:w-26 sm:h-26 md:w-40 md:h-40',
    label: {
      offsetX: '0px',
      offsetY: '-10px',
      rotate: '0deg',
      fontSize: 'clamp(10px, 1.2vw, 13px)',
      letterSpacing: '0.02em',
      fontWeight: 600,
    },
  },
  tokyo: {
    position: { side: 'right', top: '25%', right: '5%' },
    sizeClass: 'w-22 h-22 sm:w-30 sm:h-30 md:w-42 md:h-42',
    label: {
      offsetX: '0px',
      offsetY: '-10px',
      rotate: '0deg',
      fontSize: 'clamp(10px, 1.2vw, 13px)',
      letterSpacing: '0.02em',
      fontWeight: 600,
    },
  },
  'buenos-aires': {
    position: { side: 'right', top: '50%', right: '-10%' },
    sizeClass: 'w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36',
    label: {
      offsetX: '0px',
      offsetY: '8px',
      rotate: '0deg',
      fontSize: 'clamp(10px, 1.2vw, 13px)',
      letterSpacing: '0.02em',
      fontWeight: 600,
    },
  },
  berlin: {
    position: { side: 'right', top: '60%', right: '10%' },
    sizeClass: 'w-14 h-28 sm:w-20 sm:h-36 md:w-24 md:h-44',
    label: {
      offsetX: '0px',
      offsetY: '15px',
      rotate: '0deg',
      fontSize: 'clamp(10px, 1.2vw, 13px)',
      letterSpacing: '0.02em',
      fontWeight: 600,
    },
  },
};

// Replaces the bright white glow in dark mode with a darker atmospheric halo.
const darkStickerHaloFilter =
  'drop-shadow(0 0 4px rgba(8,10,18,0.9)) drop-shadow(0 0 14px rgba(30,38,68,0.62))';

function latLngToXYZ(lat: number, lng: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(Math.sin(phi) * Math.cos(theta));
  const y = Math.cos(phi);
  const z = Math.sin(phi) * Math.sin(theta);
  return [x, y, z];
}

function project3D(
  lat: number,
  lng: number,
  phi: number,
  theta: number,
  size: number,
): { x: number; y: number; visible: boolean } {
  const [x, y, z] = latLngToXYZ(lat, lng);

  const cosP = Math.cos(phi);
  const sinP = Math.sin(phi);
  const cosT = Math.cos(theta);
  const sinT = Math.sin(theta);

  const x1 = x * cosP + z * sinP;
  const z1 = -x * sinP + z * cosP;
  const y1 = y * cosT - z1 * sinT;
  const z2 = y * sinT + z1 * cosT;

  const halfSize = size / 2;
  return {
    x: halfSize + x1 * halfSize * 0.9,
    y: halfSize - y1 * halfSize * 0.9,
    visible: z2 > 0.13,
  };
}

interface GlobeProps {
  isDark: boolean;
  scrollProgress?: MotionValue<number>;
}

export default function Globe({ isDark, scrollProgress }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const phiRef = useRef(0);
  const widthRef = useRef(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const cityRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const folderRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!canvasRef.current) return;

    let phi = phiRef.current;

    const onResize = () => {
      if (containerRef.current) {
        const w = Math.min(containerRef.current.offsetWidth * 0.56, 620);
        widthRef.current = w;
      }
    };

    window.addEventListener('resize', onResize);
    onResize();

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: widthRef.current * 2 || 980,
      height: widthRef.current * 2 || 980,
      phi: phiRef.current,
      theta: 0.25,
      dark: isDark ? 1 : 0,
      diffuse: isDark ? 2.5 : 1.6,
      mapSamples: 16000,
      mapBrightness: isDark ? 6 : 1.8,
      baseColor: isDark ? [0.2, 0.2, 0.22] : [0.95, 0.95, 0.95],
      markerColor: isDark ? [1, 1, 1] : [0.1, 0.1, 0.1],
      glowColor: isDark ? [0.15, 0.15, 0.22] : [0.88, 0.88, 0.88],
      markers: [],
      onRender: (state) => {
        if (pointerInteracting.current === null) {
          phi += 0.003;
        }

        state.phi = phi + pointerInteractionMovement.current;
        state.theta = 0.25;
        state.width = (widthRef.current || 490) * 2;
        state.height = (widthRef.current || 490) * 2;
        phiRef.current = phi;

        const sizeToUse = widthRef.current || 490;
        const progressValue = scrollProgress?.get() ?? 0;

        cities.forEach((city, i) => {
          const dotEl = cityRefs.current[i];
          const folderEl = folderRefs.current[i];
          // Consistent timing: each icon reveals 80px of scroll apart
          const revealStart = 120 + i * 80;
          const isRevealed = progressValue >= revealStart;

          if (folderEl) {
            folderEl.style.opacity = isRevealed ? '1' : '0';
            folderEl.style.transform = isRevealed ? 'translateY(0px) scale(1)' : 'translateY(14px) scale(0.92)';
            folderEl.style.pointerEvents = isRevealed ? 'auto' : 'none';
          }

          if (!dotEl) return;

          const pos = project3D(city.coords[0], city.coords[1], state.phi, state.theta, sizeToUse);
          dotEl.style.left = `${pos.x}px`;
          dotEl.style.top = `${pos.y}px`;

          if (isRevealed && pos.visible) {
            dotEl.style.opacity = '1';
            dotEl.style.pointerEvents = 'auto';
          } else {
            dotEl.style.opacity = '0';
            dotEl.style.pointerEvents = 'none';
          }
        });
      },
    });

    return () => {
      globe.destroy();
      window.removeEventListener('resize', onResize);
    };
  }, [isDark, scrollProgress]);

  return (
    <div ref={containerRef} className="relative w-[min(70%,1100px)] min-h-screen">
      <div
        className="absolute pointer-events-none"
        style={{
          width: '52%',
          height: '78%',
          top: '9%',
          left: '24%',
          borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(180,180,240,0.15) 0%, rgba(120,120,200,0.06) 40%, transparent 70%)'
            : 'radial-gradient(circle, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.02) 40%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />

      <div className="absolute left-1/2 top-[62%] -translate-x-1/2 -translate-y-1/2 w-[56%] max-w-[620px] aspect-square">
        <canvas
          ref={canvasRef}
          className="w-full h-full globe-canvas cursor-grab active:cursor-grabbing"
          style={{ contain: 'layout paint size', opacity: 1 }}
          onPointerDown={(e) => {
            pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
            if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing';
          }}
          onPointerUp={() => {
            pointerInteracting.current = null;
            if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
          }}
          onPointerOut={() => {
            pointerInteracting.current = null;
            if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
          }}
          onPointerMove={(e) => {
            if (pointerInteracting.current !== null) {
              const delta = e.clientX - pointerInteracting.current;
              pointerInteractionMovement.current = delta / 100;
            }
          }}
        />

        {cities.map((city, i) => (
          <button
            key={`${city.name}-dot`}
            ref={(el) => {
              cityRefs.current[i] = el;
            }}
            className="absolute select-none z-20 group"
            style={{
              left: 0,
              top: 0,
              transform: 'translate(-50%, -50%)',
              transition: 'opacity 0.2s ease',
              pointerEvents: 'none',
              opacity: 0,
              background: 'transparent',
              border: 0,
              padding: 0,
            }}
            onClick={() => setLocation(`/city/${city.slug}`)}
            aria-label={`Open ${city.name}`}
          >
            <div className="flex items-center gap-1.5 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none group-hover:-translate-y-[1px] group-hover:scale-[1.04] group-focus-visible:-translate-y-[1px] group-focus-visible:scale-[1.04]">
              <span
                className="transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none group-hover:scale-[1.22] group-focus-visible:scale-[1.22]"
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: isDark ? '#ffffff' : '#000000',
                  boxShadow: isDark ? '0 0 4px rgba(255,255,255,0.8)' : '0 0 2px rgba(0,0,0,0.18)',
                }}
              />
              <span
                className="transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none group-hover:translate-x-[1px] group-focus-visible:translate-x-[1px]"
                style={{
                  fontSize: '10px',
                  lineHeight: 1,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                  letterSpacing: '0.01em',
                  color: isDark ? '#ffffff' : '#000000',
                  fontWeight: 400,
                  textShadow: isDark ? '0 1px 4px rgba(0,0,0,0.8)' : '0 1px 4px rgba(255,255,255,0.8)'
                }}
              >
                {city.name}
              </span>
            </div>
          </button>
        ))}
      </div>

      {cities.map((city, i) => {
        const layout = cityStickerLayout[city.slug];
        const position = layout.position;
        const sizeClass = layout.sizeClass;
        const iconLayout = {
          ...defaultIconLayout,
          ...layout.icon,
        };
        const labelLayout = layout.label;
        const stickerHalo = isDark ? darkStickerHaloFilter : '';

        return (
          <button
            key={`${city.name}-folder`}
            ref={(el) => {
              folderRefs.current[i] = el;
            }}
            onClick={() => setLocation(`/city/${city.slug}`)}
            className="absolute z-30 bg-transparent border-0 p-0 text-left group hover:z-50 hidden sm:block"
            style={{
              opacity: 0,
              transform: 'translateY(14px) scale(0.92)',
              transition: 'opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1), transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
              pointerEvents: 'none',
              ...(position.side === 'left'
                ? { left: position.left as string, top: position.top as string }
                : { right: position.right as string, top: position.top as string }),
            }}
            aria-label={`Open ${city.name}`}
          >
            <div className="flex flex-col items-center gap-0.5">
              <div
                style={{
                  transform: `translate(${iconLayout.offsetX}, ${iconLayout.offsetY}) rotate(${iconLayout.rotate})`,
                  transformOrigin: iconLayout.transformOrigin,
                  display: 'inline-flex',
                }}
              >
                {city.slug === 'buenos-aires' ? (
                  <img
                    src={city.symbol}
                    alt={city.name}
                    className={`${sizeClass} object-contain sticker-img`}
                    style={{
                      '--sticker-halo': stickerHalo,
                      transformOrigin: iconLayout.transformOrigin,
                    } as React.CSSProperties}
                    draggable={false}
                  />
                ) : (
                  <TransparentImage
                    src={city.symbol}
                    alt={city.name}
                    className={`${sizeClass} object-contain sticker-img`}
                    style={{
                      '--sticker-halo': stickerHalo,
                      transformOrigin: iconLayout.transformOrigin,
                    } as React.CSSProperties}
                  />
                )}
              </div>
              <span
                style={{
                  fontFamily: '"League Spartan", sans-serif',
                  fontWeight: labelLayout.fontWeight,
                  fontSize: labelLayout.fontSize,
                  lineHeight: 1,
                  letterSpacing: labelLayout.letterSpacing,
                  color: isDark ? '#ffffff' : '#000000',
                  textShadow: isDark ? '0 0 8px rgba(255,255,255,0.6)' : 'none',
                  transform: `translate(${labelLayout.offsetX}, ${labelLayout.offsetY}) rotate(${labelLayout.rotate})`,
                  display: 'inline-block',
                }}
              >
                {city.folderLabel}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
