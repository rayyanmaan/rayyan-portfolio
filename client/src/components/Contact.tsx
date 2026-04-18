import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ---------------------------------------------------------------------------
// Unfolding stages  -  paper starts folded, opens to full sheet
// ---------------------------------------------------------------------------
const STAGES = [
  { src: '/contact/stage-1.png', w: 320,  h: 168,  label: 'folded'    },
  { src: '/contact/stage-2.png', w: 360,  h: 290,  label: 'half-open' },
  { src: '/contact/stage-3.png', w: 560,  h: 285,  label: 'wide'      },
  { src: '/contact/stage-4.png', w: 520,  h: 520,  label: 'open'      },
] as const;

// ---------------------------------------------------------------------------
// Clickable hotspots over the fully-open stage-4 image
// Positions tuned to hand-drawn icons: envelope, LinkedIn, GitHub cat, Instagram
// ---------------------------------------------------------------------------
const SOCIALS = [
  { label: 'Email',     href: 'mailto:maan@uni.minerva.edu',                          left: '8%',  top: '29%', w: '22%', h: '20%' },
  { label: 'LinkedIn',  href: 'https://www.linkedin.com/in/rayyan-maan-9a54a9211/',   left: '52%', top: '21%', w: '22%', h: '21%', target: '_blank' },
  { label: 'GitHub',    href: 'https://github.com/rayyanmaan',                        left: '13%', top: '49%', w: '22%', h: '22%', target: '_blank' },
  { label: 'Instagram', href: 'https://www.instagram.com/rayyan.minervauni/',         left: '54%', top: '61%', w: '22%', h: '21%', target: '_blank' },
] as const;

const INTERVAL_MS = 380; // gap between frames

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function Contact() {
  const [stage, setStage]   = useState(0);
  const timerRef            = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isUnfolding         = useRef(false);

  const unfold = () => {
    if (isUnfolding.current || stage > 0) return;
    isUnfolding.current = true;

    let s = 1;
    const tick = () => {
      setStage(s);
      if (s < STAGES.length - 1) {
        s++;
        timerRef.current = setTimeout(tick, INTERVAL_MS);
      } else {
        isUnfolding.current = false;
      }
    };
    timerRef.current = setTimeout(tick, 30); // tiny initial delay for feel
  };

  const cur     = STAGES[stage];
  const isFinal = stage === STAGES.length - 1;

  return (
    <div
      className="w-full flex flex-col items-center justify-center"
      style={{ minHeight: '70vh', position: 'relative' }}
    >
      {/* Container smoothly resizes as paper unfolds */}
      <motion.div
        animate={{ width: cur.w, height: cur.h }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'relative',
          cursor: stage === 0 ? 'pointer' : 'default',
          filter: 'drop-shadow(0 6px 24px rgba(0,0,0,0.16))',
          flexShrink: 0,
        }}
        onClick={unfold}
      >
        {/* Stop-motion image swap  -  quick fade, no 3D */}
        <AnimatePresence mode="wait">
          <motion.img
            key={stage}
            src={cur.src}
            alt="contact note"
            draggable={false}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={  { opacity: 0 }}
            transition={{ duration: 0.07 }}
            style={{
              display: 'block',
              width: '100%',
              height: '100%',
              objectFit: 'fill',  // fill = exact dimensions, no letterboxing
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          />
        </AnimatePresence>

        {/* Start hint under folded note */}
        <AnimatePresence>
          {stage === 0 && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={  { opacity: 0, y: 4 }}
              transition={{ delay: 0.22, duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'absolute',
                bottom: -24,
                left: 0,
                right: 0,
                textAlign: 'center',
                fontFamily: '"League Spartan", sans-serif',
                fontSize: 10,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--muted-foreground)',
                opacity: 0.5,
                pointerEvents: 'none',
              }}
            >
              click on the note
            </motion.p>
          )}
        </AnimatePresence>

        {/* Social link hotspots  -  appear only on fully-open stage */}
        <AnimatePresence>
          {isFinal && SOCIALS.map((s, i) => (
            <motion.a
              key={s.label}
              href={s.href}
              target={'target' in s ? s.target : undefined}
              rel="noopener noreferrer"
              aria-label={s.label}
              title={s.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={  { opacity: 0 }}
              transition={{ delay: 0.14 + i * 0.04, duration: 0.24 }}
              style={{
                position: 'absolute',
                left: s.left, top: s.top,
                width: s.w,   height: s.h,
                cursor: 'pointer',
                // Debug helper  -  uncomment to see hotspot bounds:
                // background: 'rgba(255,0,0,0.15)',
                // outline: '1px solid red',
              }}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Minimal bottom instruction after full open */}
      <AnimatePresence>
        {isFinal && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={  { opacity: 0, y: 4 }}
            transition={{ delay: 0.22, duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute',
              bottom: -14,
              left: 0,
              right: 0,
              textAlign: 'center',
              fontFamily: '"League Spartan", sans-serif',
              fontSize: 10,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--muted-foreground)',
              opacity: 0.52,
              pointerEvents: 'none',
            }}
          >
            click the icons
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
