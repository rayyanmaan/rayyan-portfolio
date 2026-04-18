import { useRoute, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import Logo from '@/components/Logo';
import { LOGO_SRC } from '@/logoData';
import { useTheme } from '@/contexts/ThemeContext';

interface ProjectDetail {
  index: string;      // "01", "02", …
  title: string;
  subtitle: string;
  year: string;
  role: string;
  type: string;
  description: string;
}

const projectDetails: Record<string, ProjectDetail> = {
  'gide-latam': {
    index: '01',
    title: 'GIDE LATAM & UTDT',
    subtitle: 'Data Engineering & NLP for Policy Intelligence',
    year: '2025-Present',
    role: 'Data Engineering / Technical PM Intern',
    type: 'Data Engineering',
    description:
      'Built data infrastructure and NLP tooling for a policy intelligence platform serving Latin American legislatures. Engineered a distributed web scraping system (Python, Scrapy) that extracts and structures 2M+ legislative records from 40+ regional portals  -  replacing what previously took 12+ person-months of manual work. Fine-tuned a BERT classifier on 50K+ policy documents achieving 87% classification accuracy. Redesigned the database to a star-schema architecture with proper indexing, cutting ML workflow query times from 8 seconds to under 50ms. The platform now informs policy decisions affecting 600M+ people across 4 national legislatures.',
  },
  'nippon-foundation': {
    index: '02',
    title: 'Nippon Foundation',
    subtitle: 'AI & Climate Science Research',
    year: '2024-2025',
    role: 'AI & Data Science Researcher / Research Lead',
    type: 'Research',
    description:
      'Led a team of 4 at the intersection of AI, climate science, and urban policy. Analyzed 10TB+ of satellite imagery using XGBoost ensembles and spatial statistics (Moran\'s I, Getis-Ord Gi*) to identify urban heat islands across 2,000+ city blocks with 92% accuracy. Built and automated ETL pipelines that cut researcher data preprocessing time from 10 hours to 4 hours per dataset. The findings were synthesised into policy briefs that directly informed Tokyo\'s city planning infrastructure decisions for 40M+ residents. Conducted 25+ user interviews with city planners to define product features for a geospatial ML dashboard, shipping an MVP in 4 months.',
  },
  'bearvfx': {
    index: '03',
    title: 'BEARVFX',
    subtitle: 'AI Video Generation Pipeline',
    year: '2024',
    role: 'Machine Learning Engineering Intern',
    type: 'ML Engineering',
    description:
      'Built an end-to-end AI video generation pipeline for educational content. Combined computer vision models (YOLO, OpenCV), speech synthesis (OpenAI Whisper, Wav2Lip), and video processing (FFmpeg, AWS S3) to produce 500+ hours of video content at 95% visual accuracy. Automated data preprocessing workflows that cut per-video production time from 8 hours to 2.4 hours. Scaled the pipeline to 50+ parallel jobs with Grafana monitoring, reducing batch failures by 65% and supporting 100+ educators.',
  },
  cobalt: {
    index: '04',
    title: 'CoBALT',
    subtitle: 'B2B SaaS Lead Enrichment Platform',
    year: '2024',
    role: 'Data Science & Full-Stack Engineer Intern',
    type: 'B2B SaaS',
    description:
      'Worked on an early-stage B2B SaaS lead-enrichment platform. Built predictive models to score and prioritise 10K+ daily leads, achieving 99.5% accuracy and serving insights to 500+ users. Designed and optimised a PostgreSQL schema to power the data pipeline and support production-grade uptime. Built 8+ frontend features (dashboards, exports) with React and Node.js, implemented OAuth 2.0, and ran usability testing that drove 85% user adoption within the first sprint cycle.',
  },
  'gdg-minerva': {
    index: '05',
    title: 'Google Developers Group',
    subtitle: 'Program Director & President',
    year: '2024-Present',
    role: 'Program Director & President',
    type: 'Community',
    description:
      'Scaled a Google-affiliated developer community from near-zero to 230+ active members across 5 cities  -  185% membership growth  -  earning recognition as a top-performing chapter by Google DevRel. Led cross-functional teams executing AI hackathons in partnership with AWS, Samsung, and Perplexity, and hosted workshops with professionals from Google, Meta, and LinkedIn. Ran structured feedback loops and engagement analytics to iterate event formats, cutting delivery timelines by 35% and achieving a 4.6/5 satisfaction score. Managed programming across Seoul and San Francisco simultaneously, coaching 100+ members on technical projects.',
  },
  breakthrough: {
    index: '06',
    title: 'Breakthrough Pittsburgh',
    subtitle: 'CS Education & Youth Mentorship',
    year: '2024',
    role: 'Lead Teaching Fellow & CS Instructor',
    type: 'Education',
    description:
      'Taught Python, statistics, and 3D modeling to 40+ 9th and 10th graders from low-income backgrounds as part of a residential-style summer fellowship. Designed 30+ lesson plans across 100+ instructional hours, adapting curriculum for diverse learners and achieving 100% course completion. Coordinated fellow TAs across the programme and balanced classroom management with individual student support throughout a full daily schedule.',
  },
  'ai-tech-society': {
    index: '07',
    title: 'AI & Tech Society',
    subtitle: 'Founder & President  -  LGS Islamabad',
    year: '2021-2023',
    role: 'Founder & President',
    type: 'Leadership',
    description:
      'Founded the AI & Tech Society at LGS Islamabad and scaled it to 120+ members  -  a 4× growth. Delivered 20+ workshops on coding, introductory AI, and tech ethics using curricula from CS50, Girls Who Code, and UIC Cybersecurity. Partnered with Learnobots to run robotics classes, and designed and launched the LGSIMUN front-end website for 1,000+ users within a 2-week deadline. Conducted 10+ sessions on responsible AI, digital safety, and equity in technology.',
  },
  'lgs-islamabad': {
    index: '08',
    title: 'LGS Islamabad',
    subtitle: 'Senior TA  -  A-Level Mathematics',
    year: '2021-2023',
    role: 'Senior Teaching Assistant',
    type: 'Education',
    description:
      'Tutored 200+ students across 10+ A-Level mathematics topics, maintaining records across 5+ sections. Designed and graded tests, shared daily notes and worksheet solutions, and helped 40% of students achieve A* grades. Operated as a direct extension of the classroom teacher, handling individual queries, small-group sessions, and progress tracking.',
  },
  edgur: {
    index: '09',
    title: 'Edgur',
    subtitle: 'Programming & Statistics Content Creator',
    year: '2025',
    role: 'Content Creator',
    type: 'Education',
    description:
      'Created 50+ short-form (3-minute) educational videos on Python, R, and statistics for learners across 15+ countries. Shaped content design and learner experience end-to-end  -  scripting, recording, and iterating based on audience feedback. Focused on making technical concepts accessible and engaging for beginners.',
  },
  swapcircle: {
    index: '10',
    title: 'SwapCircle',
    subtitle: 'Campus Clothing Exchange Platform',
    year: '2025',
    role: 'Team Lead / Lead PM',
    type: 'Full-Stack Product',
    description:
      'A campus-based clothing exchange platform that lets students buy, sell, and swap items within their university community. Led a 6-person agile team through 49+ releases and 200+ commits. Built 9 REST API modules covering authentication, item listings, swap requests, ratings, and a credit system. The platform ran at 99.8% data integrity with 95%+ uptime. Validated demand through research with 50+ students, defined MVP scope, and executed a campus-wide GTM strategy that drove sustained adoption. Built analytics infrastructure tracking activation, retention (65%), session depth (8 min), and satisfaction (4.3/5).',
  },
  'bayesian-sports-attendance-predictions': {
    index: '11',
    title: 'Bayesian Sports Predictions',
    subtitle: 'Statistical Modelling & Data Science',
    year: '2025',
    role: 'Data Scientist',
    type: 'Analytics',
    description:
      'Applied Bayesian hierarchical modelling to analyze attendance patterns across 240 professional football games from 12 Argentinian teams. Built two models (complete pooling baseline vs. hierarchical partial pooling) and used LOO cross-validation to compare them. The hierarchical model won decisively (ELPD +18). Team popularity accounts for ~90% of attendance variance. Used MCMC sampling and posterior predictive distributions to impute 22 missing values with ±11% uncertainty. Translated results into concrete marketing recommendations.',
  },
  connectfour: {
    index: '12',
    title: 'Connect Four AI',
    subtitle: 'AI & Game Theory',
    year: '2025',
    role: 'Developer',
    type: 'AI Build',
    description:
      'Built an intelligent Connect Four game with an AI opponent powered by the Minimax algorithm with Alpha-Beta pruning. The AI evaluates board positions using multiple heuristics  -  four-in-a-row detection, center control, threat blocking  -  and supports three difficulty levels. Implemented in Python with a Pygame GUI featuring smooth piece-drop animations and visual feedback. Alpha-Beta pruning significantly reduces the search space, enabling real-time play even at higher difficulty settings.',
  },
  'studyspot-finder': {
    index: '13',
    title: 'StudySpot Finder',
    subtitle: 'Logic Programming & Desktop UI',
    year: '2025',
    role: 'Developer',
    type: 'AI / Logic',
    description:
      'A conversational desktop app that recommends study cafés based on user preferences, powered by a Prolog logic engine. Users select a study vibe (Classes, Grind, Chill, Friends), answer follow-up questions, and the system reasons over a knowledge base of café attributes  -  Wi-Fi quality, distance, price, hours, seating type. The key engineering challenge was thread-safe communication between the Tkinter GUI and the Prolog reasoning engine, solved with a custom read_py/3 foreign predicate that blocks in Prolog without freezing the UI.',
  },
  'uhi-explorer': {
    index: '14',
    title: 'UHI Explorer',
    subtitle: 'Global Urban Heat Island Platform',
    year: '2025',
    role: 'Full-Stack Developer',
    type: 'Climate Tech',
    description:
      'A web application for analysing Urban Heat Islands in any city worldwide using four integrated satellite datasets: Land Surface Temperature (MODIS, 1km), NDVI (250m), Land Use/Land Cover (500m), and Nighttime Lights (500m). The backend runs on FastAPI and Google Earth Engine, applying spatial statistics (Getis-Ord Gi*, Moran\'s I) and multi-variable convergence analysis to identify hotspots. The frontend provides interactive maps, temporal trend charts, and PDF report generation. Built as an extension of the Nippon Foundation research.',
  },
  taskflow: {
    index: '15',
    title: 'TaskFlow',
    subtitle: 'Multi-User Hierarchical Task Manager',
    year: '2025',
    role: 'Full-Stack Developer',
    type: 'Web App',
    description:
      'A multi-user hierarchical to-do list web application built with Flask and SQLAlchemy. Supports multiple lists per user, tasks nested up to 3 levels deep, task completion, collapse/expand state saved per session, and moving top-level tasks between lists. Features secure multi-user authentication with full data isolation between users, and durable SQLite storage.',
  },
};

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

export default function ProjectPage() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [, setLocation] = useLocation();
  const [match, params] = useRoute('/project/:slug');
  const slug = params?.slug || '';
  const project = projectDetails[slug];
  const fromParam = new URLSearchParams(window.location.search).get('from');
  const fromSection = fromParam === 'builds' ? 'builds' : 'work';
  const fromLabel = fromSection === 'builds' ? 'Builds' : 'Work';
  const totalProjects = Object.keys(projectDetails).length;

  if (!project || !match) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <h1
            className="text-4xl font-bold mb-4"
            style={{ fontFamily: '"League Spartan", sans-serif' }}
          >
            Project not found
          </h1>
          <button
            onClick={() => setLocation('/')}
            className="text-muted-foreground hover:text-foreground transition-colors underline"
            style={{ fontFamily: '"League Spartan", sans-serif' }}
          >
            Go home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 overflow-y-auto">

      {/* ── Fixed nav bar ─────────────────────────────────────────────── */}
      <div className="fixed top-8 left-8 md:top-10 md:left-12 z-50">
        <a href="/">
          <Logo onClick={toggleTheme ?? (() => {})} src={LOGO_SRC} isDark={isDark} />
        </a>
      </div>

      <div className="fixed top-8 right-8 md:top-10 md:right-12 z-50">
        <button
          onClick={() => setLocation(`/?from=${fromSection}`)}
          className="text-muted-foreground hover:text-foreground transition-colors duration-200"
          style={{
            fontFamily: '"League Spartan", sans-serif',
            fontSize: 12,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          ← {fromLabel}
        </button>
      </div>

      {/* ── Page content ──────────────────────────────────────────────── */}
      <div className="max-w-[780px] mx-auto px-8 md:px-12 pt-32 pb-24">

        {/* Index number  -  large background accent */}
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: '"League Spartan", sans-serif',
            fontSize: 'clamp(80px, 14vw, 140px)',
            fontWeight: 800,
            lineHeight: 1,
            color: 'var(--border)',
            letterSpacing: '-0.04em',
            marginBottom: -24,
            userSelect: 'none',
          }}
        >
          {project.index}
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: '"League Spartan", sans-serif',
            fontSize: 'clamp(36px, 6vw, 62px)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            color: 'var(--foreground)',
            marginBottom: 16,
          }}
        >
          {project.title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: '"League Spartan", sans-serif',
            fontSize: 13,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontWeight: 500,
            color: 'var(--muted-foreground)',
            marginBottom: 40,
          }}
        >
          {project.subtitle}
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: 1, background: 'var(--border)', marginBottom: 36 }}
        />

        {/* Metadata row */}
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
            marginBottom: 40,
          }}
        >
          {[
            { label: 'Role', value: project.role },
            { label: 'Year', value: project.year },
            { label: 'Type', value: project.type },
          ].map(({ label, value }) => (
            <div key={label}>
              <p
                style={{
                  fontFamily: '"League Spartan", sans-serif',
                  fontSize: 9,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  color: 'var(--muted-foreground)',
                  marginBottom: 6,
                }}
              >
                {label}
              </p>
              <p
                style={{
                  fontFamily: '"League Spartan", sans-serif',
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                  color: 'var(--foreground)',
                }}
              >
                {value}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Divider */}
        <div style={{ height: 1, background: 'var(--border)', marginBottom: 36 }} />

        {/* Description */}
        <motion.p
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: '"League Spartan", sans-serif',
            fontSize: 17,
            lineHeight: 1.75,
            color: 'var(--foreground)',
            opacity: 0.82,
            marginBottom: 48,
          }}
        >
          {project.description}
        </motion.p>

        {/* Divider */}
        <div style={{ height: 1, background: 'var(--border)', marginBottom: 36 }} />

        {/* Footer nav */}
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <button
            onClick={() => setLocation(`/?from=${fromSection}`)}
            className="hover:text-foreground transition-colors duration-200"
            style={{
              fontFamily: '"League Spartan", sans-serif',
              fontSize: 11,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontWeight: 600,
              color: 'var(--muted-foreground)',
            }}
          >
            {fromSection === 'builds' ? '← All builds' : '← All work'}
          </button>

          <span
            style={{
              fontFamily: '"League Spartan", sans-serif',
              fontSize: 10,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--muted-foreground)',
              opacity: 0.4,
            }}
          >
            {project.index} / {String(totalProjects).padStart(2, '0')}
          </span>
        </motion.div>
      </div>
    </div>
  );
}
