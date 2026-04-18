import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Matter from 'matter-js';
import { MousePointer2 } from 'lucide-react';

const DI = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';
const SI = 'https://cdn.simpleicons.org';

const sections = [
  {
    label: 'Languages',
    items: [
      { logo: `${DI}/python/python-original.svg`,           name: 'Python'     },
      { logo: `${DI}/typescript/typescript-original.svg`,   name: 'TypeScript' },
      { logo: `${DI}/javascript/javascript-original.svg`,   name: 'JavaScript' },
      { logo: `${DI}/java/java-original.svg`,               name: 'Java'       },
      { logo: `${DI}/scala/scala-original.svg`,             name: 'Scala'      },
      { logo: `${DI}/r/r-original.svg`,                     name: 'R'          },
      { logo: `${DI}/rust/rust-original.svg`,               name: 'Rust'       },
      { logo: `${DI}/go/go-original-wordmark.svg`,          name: 'Go'         },
      { logo: `${DI}/cplusplus/cplusplus-original.svg`,     name: 'C++'        },
      { logo: `${DI}/ruby/ruby-original.svg`,               name: 'Ruby'       },
      { logo: `${DI}/php/php-original.svg`,                 name: 'PHP'        },
    ],
  },
  {
    label: 'Frontend & Design',
    items: [
      { logo: `${DI}/react/react-original.svg`,             name: 'React'      },
      { logo: `${DI}/nextjs/nextjs-original.svg`,           name: 'Next.js'    },
      { logo: `${DI}/figma/figma-original.svg`,             name: 'Figma'      },
      { logo: `${DI}/tailwindcss/tailwindcss-original.svg`, name: 'Tailwind'   },
      { logo: `${DI}/svelte/svelte-original.svg`,           name: 'Svelte'     },
      { logo: `${SI}/framer/000000`,                        name: 'Framer'     },
      { logo: `${DI}/vuejs/vuejs-original.svg`,             name: 'Vue.js'     },
      { logo: `${SI}/greensock/000000`,                     name: 'GSAP'       },
      { logo: `${SI}/webflow/000000`,                       name: 'Webflow'    },
    ],
  },
  {
    label: 'Backend & Infrastructure',
    items: [
      { logo: `${DI}/postgresql/postgresql-original.svg`,   name: 'PostgreSQL' },
      { logo: `${DI}/mongodb/mongodb-original.svg`,         name: 'MongoDB'    },
      { logo: `${DI}/redis/redis-original.svg`,             name: 'Redis'      },
      { logo: `${DI}/docker/docker-original.svg`,           name: 'Docker'     },
      { logo: `${DI}/kubernetes/kubernetes-plain.svg`,      name: 'Kubernetes' },
      { logo: `${DI}/amazonwebservices/amazonwebservices-original-wordmark.svg`, name: 'AWS' },
      { logo: `${DI}/graphql/graphql-plain.svg`,            name: 'GraphQL'    },
      { logo: `${DI}/terraform/terraform-original.svg`,     name: 'Terraform'  },
      { logo: `${DI}/fastapi/fastapi-original.svg`,         name: 'FastAPI'    },
      { logo: `${DI}/git/git-original.svg`,                 name: 'Git'        },
      { logo: `${DI}/firebase/firebase-plain.svg`,          name: 'Firebase'   },
      { logo: `${DI}/supabase/supabase-original.svg`,       name: 'Supabase'   },
      { logo: `${DI}/vercel/vercel-original.svg`,           name: 'Vercel'     },
    ],
  },
  {
    label: 'Data & Analytics',
    items: [
      { logo: `${DI}/pandas/pandas-original.svg`,           name: 'Pandas'     },
      { logo: `${DI}/numpy/numpy-original.svg`,             name: 'NumPy'      },
      { logo: `${SI}/scikitlearn/000000`,                   name: 'Scikit-learn'},
      { logo: `${SI}/scipy/000000`,                         name: 'SciPy'      },
      { logo: `${SI}/googleanalytics/000000`,               name: 'Analytics'  },
      { logo: `/stack/excel.png`,                            name: 'Excel'      },
      { logo: `${SI}/qgis/000000`,                          name: 'QGIS'       },
    ],
  },
  {
    label: 'AI & Dev Tools',
    items: [
      { logo: `${SI}/anthropic/000000`,                     name: 'Claude'     },
      { logo: `${SI}/cursor/000000`,                        name: 'Cursor'     },
      { logo: `${DI}/vscode/vscode-original.svg`,           name: 'VS Code'    },
      { logo: `${SI}/githubcopilot/000000`,                 name: 'Copilot'    },
      { logo: `/stack/openai.png`,                           name: 'OpenAI'     },
      { logo: `${SI}/huggingface/000000`,                   name: 'HuggingFace'},
    ],
  },
  {
    label: 'Creative & Productivity',
    items: [
      { logo: `${DI}/photoshop/photoshop-original.svg`,     name: 'Adobe CC'   },
      { logo: `/stack/canva.png`,                            name: 'Canva'      },
      { logo: `${DI}/blender/blender-original.svg`,         name: 'Blender'    },
      { logo: `/stack/capcut.png`,                          name: 'CapCut'     },
      { logo: `${SI}/notion/000000`,                        name: 'Notion'     },
      { logo: `${DI}/jira/jira-original.svg`,               name: 'Jira'       },
      { logo: `${SI}/miro/000000`,                          name: 'Miro'       },
      { logo: `/stack/powerpoint.png`,                      name: 'PowerPoint' },
    ],
  },
];

const allItems = sections.flatMap((s, si) =>
  s.items.map((item, ii) => ({
    ...item,
    globalIndex: sections.slice(0, si).reduce((acc, sec) => acc + sec.items.length, 0) + ii,
  }))
);

const RADIUS   = 26;
const LOGO_PX  = RADIUS * 2;
const FOOTER_H = 56;

export default function Stack() {
  const [phase, setPhase]                 = useState<0 | 1 | 2>(0);
  const [snapshots, setSnapshots]         = useState<{ x: number; y: number }[]>([]);

  const logoRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const overlayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const canvasRef   = useRef<HTMLCanvasElement | null>(null);
  const hasDragged  = useRef(false);
  const engineRef   = useRef<Matter.Engine | null>(null);
  const rafRef      = useRef<number>(0);

  const handleClick = () => {
    if (hasDragged.current) return;
    if (phase === 0) {
      setPhase(1);
    } else if (phase === 1) {
      const snaps = allItems.map(item => {
        const el = logoRefs.current[item.globalIndex];
        if (!el) return { x: 0, y: 0 };
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
      setSnapshots(snaps);
      setPhase(2);
    }
  };

  useEffect(() => {
    if (phase !== 2 || snapshots.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width  = W;
    canvas.height = H;

    const { Engine, Bodies, Composite, Mouse, MouseConstraint, Events, Body } = Matter;

    const engine = Engine.create({ gravity: { y: 2.2 } });
    engineRef.current = engine;

    const viewTop = 80 + RADIUS;
    let groundY = H - FOOTER_H + 10;
    const viewBottom = groundY - RADIUS;
    const groundThickness = 50;
    const ground  = Bodies.rectangle(W / 2, groundY + groundThickness / 2, W * 3, groundThickness, {
      isStatic: true, friction: 0.6, restitution: 0.25, label: 'ground',
    });

    // Normalize spawn positions so off-screen icons still enter the simulation.
    // Any icon outside the viewport starts above the page while preserving its x-lane.
    let offscreenIndex = 0;
    const spawnData = snapshots.map((snap, i) => {
      let x = Math.max(RADIUS, Math.min(W - RADIUS, snap.x));
      let y = snap.y;
      let vx = 0;
      let vy = 0;

      if (snap.y > viewBottom || snap.y < viewTop) {
        const lane = offscreenIndex++;

        if (snap.x === 0 && snap.y === 0) {
          // Fallback lane when snapshot ref was missing.
          x = RADIUS + (lane % 8) * (RADIUS * 2.2);
        }

        x = Math.max(RADIUS, Math.min(W - RADIUS, x));

        y = viewTop - 60 - lane * 10;
        vy = 3 + (lane % 4) * 0.35;
        vx = ((lane % 5) - 2) * 0.12;
      }

      return { x, y, vx, vy };
    });

    const bodies = spawnData.map(({ x, y }) =>
      Bodies.circle(x, y, RADIUS, {
        restitution: 0.35,
        friction:    0.55,
        frictionAir: 0.006,
        density:     0.003,
      })
    );

    bodies.forEach((body, i) => {
      const s = spawnData[i];
      if (!s) return;
      Body.setVelocity(body, { x: s.vx, y: s.vy });
    });

    Composite.add(engine.world, [ground, ...bodies]);

    const mouse = Mouse.create(canvas);
    const mc    = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.18, damping: 0.1, render: { visible: false } },
    });
    Composite.add(engine.world, mc);

    const syncViewport = () => {
      const nextW = window.innerWidth;
      const nextH = window.innerHeight;
      if (nextW === W && nextH === H) return;

      const prevGroundY = groundY;
      W = nextW;
      H = nextH;
      groundY = H - FOOTER_H + 10;

      canvas.width = W;
      canvas.height = H;
      Body.setPosition(ground, { x: W / 2, y: groundY + groundThickness / 2 });

      const deltaY = groundY - prevGroundY;
      if (deltaY !== 0) {
        bodies.forEach((body) => {
          Body.setPosition(body, { x: body.position.x, y: body.position.y + deltaY });
        });
      }
    };
    window.addEventListener('resize', syncViewport);

    Events.on(mc, 'startdrag', () => { hasDragged.current = true; });
    Events.on(mc, 'enddrag',   () => { setTimeout(() => { hasDragged.current = false; }, 80); });

    let last = performance.now();
    const tick = () => {
      const now = performance.now();
      Engine.update(engine, Math.min(now - last, 32));
      last = now;

      bodies.forEach((body, i) => {
        const el = overlayRefs.current[i];
        if (!el) return;
        let { x, y } = body.position;

        if (x > W + RADIUS) {
          Body.setPosition(body, { x: -RADIUS, y });
          x = -RADIUS;
        } else if (x < -RADIUS) {
          Body.setPosition(body, { x: W + RADIUS, y });
          x = W + RADIUS;
        }

        el.style.transform = `translate(${x - RADIUS}px, ${y - RADIUS}px) rotate(${body.angle}rad)`;
      });

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', syncViewport);
      Engine.clear(engine);
      Matter.World.clear(engine.world, false);
    };
  }, [phase, snapshots]);

  return (
    <div onClick={handleClick} style={{ width: '100%', position: 'relative' }}>

      {/* ── Instruction note  -  right side ──────────────────────────────── */}
      <motion.div
        animate={{ opacity: phase === 2 ? 0 : 1, y: phase === 2 ? -4 : 0 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed',
          right: '4%',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          zIndex: 5,
          width: 220,
        }}
      >
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          fontFamily: '"League Spartan", sans-serif',
          fontSize: 12,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.14em',
          color: 'var(--muted-foreground)',
          opacity: 0.9,
          margin: 0,
          userSelect: 'none',
        }}>
          <MousePointer2 size={14} strokeWidth={1.7} />
          <span>double click</span>
        </div>
      </motion.div>

      <motion.div
        animate={{ opacity: phase === 2 ? 0.9 : 0, y: phase === 2 ? 0 : 6 }}
        transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          zIndex: 6,
          userSelect: 'none',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: '"League Spartan", sans-serif',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.14em',
            color: 'var(--muted-foreground)',
            opacity: 0.92,
          }}
        >
          We could build something. Or just throw stuff around.
        </p>
      </motion.div>

      {/* ── Phase 0 & 1: grid ───────────────────────────────────────────── */}
      {phase < 2 && (
        <div style={{ paddingBottom: 80 }}>
          {sections.map((section, si) => {
            const offset = sections.slice(0, si).reduce((acc, s) => acc + s.items.length, 0);
            return (
              <div key={section.label} style={{ marginTop: si > 0 ? 44 : 0 }}>
                <p style={{
                  fontSize: 9,
                  textTransform: 'uppercase',
                  letterSpacing: '0.22em',
                  fontWeight: 700,
                  color: 'var(--muted-foreground)',
                  fontFamily: '"League Spartan", sans-serif',
                  marginBottom: 20,
                  height: 14,
                  opacity: phase === 0 ? 1 : 0,
                  transition: 'opacity 0.22s ease',
                  pointerEvents: 'none',
                }}>
                  {section.label}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28 }}>
                  {section.items.map((item, ii) => {
                    const gi = offset + ii;
                    return (
                      <motion.div
                        key={item.name}
                        ref={el => { logoRefs.current[gi] = el; }}
                        drag
                        dragMomentum={false}
                        dragElastic={0.04}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: gi * 0.015 }}
                        onDragStart={() => { hasDragged.current = true; }}
                        onDragEnd={() => { setTimeout(() => { hasDragged.current = false; }, 100); }}
                        onClick={e => e.stopPropagation()}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 6,
                          cursor: 'grab',
                          touchAction: 'none',
                        }}
                        whileDrag={{ cursor: 'grabbing', scale: 1.1, zIndex: 50 }}
                      >
                        <img
                          src={item.logo} alt={item.name} draggable={false}
                          style={{ width: LOGO_PX, height: LOGO_PX, objectFit: 'contain', pointerEvents: 'none', userSelect: 'none' }}
                        />
                        <span style={{
                          fontSize: 10,
                          fontFamily: '"League Spartan", sans-serif',
                          letterSpacing: '0.04em',
                          color: 'var(--muted-foreground)',
                          textAlign: 'center',
                          whiteSpace: 'nowrap',
                          display: 'block',
                          pointerEvents: 'none',
                          height: 14,
                          opacity: phase === 0 ? 1 : 0,
                          transition: 'opacity 0.22s ease',
                        }}>
                          {item.name}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Phase 2: physics overlay ─────────────────────────────────────── */}
      {phase === 2 && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 10, pointerEvents: 'none' }}>
          <canvas
            ref={canvasRef}
            style={{
              position: 'absolute',
              top: 80, left: 0, right: 0, bottom: 0,
              width: '100%',
              height: 'calc(100% - 80px)',
              pointerEvents: 'all',
              opacity: 0,
              cursor: 'default',
            }}
          />
          {allItems.map((item, i) => (
            <div
              key={item.name}
              ref={el => { overlayRefs.current[i] = el; }}
              style={{
                position: 'absolute',
                top: 0, left: 0,
                width: LOGO_PX,
                height: LOGO_PX,
                pointerEvents: 'none',
                willChange: 'transform',
                transform: snapshots[i]
                  ? `translate(${snapshots[i].x - RADIUS}px, ${snapshots[i].y - RADIUS}px)`
                  : 'none',
              }}
            >
              <img
                src={item.logo} alt={item.name} draggable={false}
                style={{ width: LOGO_PX, height: LOGO_PX, objectFit: 'contain', userSelect: 'none', pointerEvents: 'none' }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
