# CP192 Mini Capstone: Personal Portfolio Website

**Rayyan Maan**
Minerva University, Class of 2027
April 2025

---

## 1. Executive Summary

I spent one semester building a personal portfolio website from scratch. Not a template. Not a drag-and-drop page builder. A custom React application with interactive 3D carousels, a physics-based skills page, a WebGL globe, and a stop-motion contact section. The goal was to create something that a recruiter scrolling through fifty portfolios in an afternoon would actually stop and interact with. I wanted it to feel like a product, not a PDF someone put on the internet.

The portfolio is deployed on Netlify and is live. It is not finished, and I do not think it will ever be finished in the way a homework assignment gets finished. It is a working product that has reached a meaningful milestone: every section is navigable, every interaction works, the content is real, and the design is intentional. I learned more about frontend engineering, animation math, and my own design instincts than I expected. I also learned that I spend too much time iterating on things that do not need another iteration.

---

## 2. Work Product Description

### What it is

The portfolio is a single-page React application with five main sections: a hero page with an interactive globe, a work section displaying my professional experiences as a rotating 3D polygonal ring, a builds section showing my personal projects on a perspective-warped horizontal carousel, a tech stack page where skill icons fall with real physics, and a contact section that unfolds like a piece of paper. There are also individual detail pages for each experience and project, and dedicated city pages for the seven cities I have lived in during my time at Minerva.

The site is deployed at [Netlify URL]. It works on desktop and mobile. It supports dark mode with a full CSS variable system that smoothly transitions every color on the page.

### The stack and why each piece exists

Every dependency in this project exists because a specific feature demanded it. I did not install things to pad a package.json.

**React 19 with TypeScript 5.6** is the foundation. React handles the component model, state management for section switching, and the context system for theming. TypeScript catches the kinds of errors that would otherwise show up as broken transforms or NaN values in animation math. When you are computing translateZ values from smoothstep easing functions, type safety is not optional.

**Vite 7** handles the build. It compiles the client into optimized ES modules, and esbuild bundles the Express server separately. The dev server runs with hot module replacement, which matters when you are tweaking animation constants and need to see the result in under a second.

**Framer Motion 12** powers the discrete animations: the staggered hero entrance (120ms between children), the globe reveal (1.2s scale from 0.82 to 0.88), the contact page unfold transitions, the AnimatePresence crossfades between sections. Critically, Framer Motion is not used for any of the real-time 3D animations. Those run on raw requestAnimationFrame loops because Framer Motion's React reconciliation cycle introduces too much latency for 60fps transforms.

**cobe 0.6.5** renders the interactive WebGL globe on the hero page. It draws 16,000 map samples with configurable diffuse lighting, and I overlay city markers on top using manual 3D projection math that converts latitude/longitude coordinates to screen positions through two rotation matrices. The globe responds to scroll: it scales from 0.88 to 1.18 over 950 pixels of scroll distance and drifts upward by 40px.

**Matter.js 0.20.0** is the 2D rigid body physics engine behind the Stack page. When you click through from the initial grid layout to the physics phase, each skill icon becomes a physics body with mass, friction (0.55), restitution (0.35), and air resistance (0.006). They fall under gravity (2.2 m/s squared), bounce off a ground plane, collide with each other, and wrap horizontally when they exit the viewport. You can grab and throw them. This is not decorative. It was a deliberate decision to make the skills section feel playful and tactile rather than being yet another grid of logos.

**wouter 3.3.5** handles routing. It is 300 bytes gzipped. I chose it over React Router because the routing needs are simple: a home route, a dynamic city route (`/city/:id`), a dynamic project route (`/project/:slug`), and a 404 page. Section switching within the home page is state-based, not URL-based, which means clicking between Work, Builds, Stack, and Contact does not add to browser history. That was intentional. Navigating between sections should feel like flipping pages in a book, not navigating between websites.

**Tailwind CSS v4** with the Vite plugin handles utility styling. I use it for layout, spacing, responsive breakpoints, and simple transitions. But most of the interesting styling is inline, because the 3D transforms and physics positions are computed per-frame in JavaScript and applied directly to DOM elements. Tailwind cannot do `translateZ(var(--stream-depth))` with a value that changes 60 times per second.

**Express 4** serves the production build. The server is 33 lines: serve the static directory, catch all unmatched routes, send index.html for client-side routing. It exists because Netlify handles this natively, but I wanted the option to self-host.

### Key features and design decisions

**The Builds Carousel (3D Concave Arch)**

This is probably the most technically complex visual on the site. Six project cards scroll horizontally in an infinite loop, but they are not flat. The cards exist on a concave surface: cards near the center of the viewport are pushed 500 pixels into the screen along the Z-axis, while cards at the edges are pulled 220 pixels toward the viewer. Each card rotates up to 66 degrees on the Y-axis and 7 degrees on the X-axis as it moves toward the edges, creating a warping effect that makes the reel feel curved, not flat.

The math behind this involves several layers. First, each card's position is calculated using modulo arithmetic for infinite wrapping. Then I compute an edge normalization value (how far the card is from the center, 0 to 1), smooth it with a Hermite smoothstep function (3t squared minus 2t cubed), and raise it to the power of 1.95 to create a sharp transition curve. This curve drives everything: the card height interpolates between 154px and 208px, the Z-depth interpolates between negative 500px and positive 220px, the scale goes from 0.8 to 1.08, and the shadow spread goes from 6px to 30px. Cards closer to you cast bigger, darker shadows. Cards further away are smaller with lighter shadows. The perspective is set to 660px, which makes the depth difference dramatic enough to feel three-dimensional.

The cards overlap by 24 pixels on desktop (negative gap) so the reel feels continuous rather than discrete. The auto-scroll runs at 18 pixels per second, and you can drag or scroll to control it. Drag momentum applies velocity with 0.9 friction decay per frame. The entire animation loop runs on requestAnimationFrame, not React state updates, because updating React state 60 times per second would destroy performance.

I went through several versions before landing on this. The first version was a simple horizontal scroll with flat cards. It looked like every other portfolio. The second version added basic perspective, but the depth difference was too subtle to notice. The current version pushed everything further: deeper Z-values, more aggressive rotation, lower perspective camera, scale variation, and overlapping cards. Each of these parameters was tuned individually until the whole thing felt right.

**The Stack Page (Physics Simulation)**

The tech stack section has three phases, and the transition between them is what makes it interesting.

Phase 0 is a clean grid. Six categories (Languages, Frontend and Design, Backend and Infrastructure, Data and Analytics, AI and Dev Tools, Creative and Productivity) with 61 total skill icons arranged in a standard layout. Each icon enters with a staggered animation: 15 milliseconds between items, fading up from 8 pixels below.

Phase 1 activates when you click. The grid stays, but now each icon is individually draggable. You can pick them up, move them around, rearrange them. The section labels fade out over 220 milliseconds. This is built with Framer Motion's drag constraint system with 0.04 elasticity so items snap back gently if you drag them.

Phase 2 is where it gets interesting. Click again and every icon becomes a Matter.js physics body. The component captures each icon's current screen position, creates a circular body at that location with initial velocity (a spray pattern: horizontal velocity varies by lane position, vertical velocity is 3 to 3.35 px/s), and lets gravity take over. Icons fall, bounce off a ground plane (friction 0.6, restitution 0.25), collide with each other, and settle into a pile at the bottom. You can still grab and throw them using a mouse constraint with 0.18 stiffness. Icons that exit the left edge reappear on the right.

The technical challenge was the handoff between Phase 1 (React-managed positions) and Phase 2 (physics-managed positions). I had to snapshot each icon's bounding rectangle, normalize any off-screen positions into viewport lanes, inject them as Matter.js bodies with appropriate initial velocities, and then run a RAF loop that reads body positions and applies them as CSS transforms every frame. The physics engine updates with a capped 32ms delta to prevent explosions on tab-switch.

I chose this approach because a grid of logos with "Python, React, Docker, AWS" is the most generic thing a portfolio can have. Everyone has one. Mine lets you throw the logos around. It is memorable, and it communicates something about how I think about design: functionality does not have to be boring.

**The Globe and City System**

The hero section features a WebGL globe rendered by the cobe library. Seven cities are plotted on it: Islamabad, San Francisco, Taipei, Seoul, Tokyo, Buenos Aires, and Berlin. Each city has a marker that is projected from latitude/longitude to screen coordinates using manual 3D math. The projection converts spherical coordinates to a unit sphere, applies two rotation matrices (one for phi, one for theta), and determines visibility using a back-face culling threshold of z > 0.13. Cities on the far side of the globe are hidden.

Each city also has a "sticker" that appears next to the globe as you scroll. The stickers reveal progressively, each one 80 pixels of scroll apart. Hovering a sticker triggers a 2.5-second infinite rotation animation at 1.05 scale. Clicking a city navigates to a dedicated city page with a description of what I did there.

The city pages now include a procedurally generated gallery layout. A deterministic PRNG (mulberry32, seeded by an FNV-1a hash of the city name) generates 15 tiles with varying aspect ratios, random rotations (plus or minus 8 degrees), and border radii (10 to 20 pixels). The tiles are placed on a 12-column by 42-row occupancy grid using a two-pass algorithm: first, 240 random placement attempts per tile, then a sequential scan if random placement fails. This produces a scattered, organic-feeling layout that is reproducible (same seed, same layout) but unique to each city.

**The Contact Section (Stop-Motion Unfold)**

The contact page simulates a piece of paper being unfolded in four stages. Each stage is a separate PNG image. On click, the component cycles through them at 380-millisecond intervals while simultaneously animating the container dimensions. The container smoothly resizes from 320x168 pixels (folded) to 520x520 pixels (fully open) using Framer Motion with the standard easing curve. The image swaps happen with a 70-millisecond crossfade, fast enough to feel like a stop-motion flip rather than a smooth morph.

When fully unfolded, four social link hotspots (email, LinkedIn, GitHub, Instagram) appear with a staggered reveal: each one 40 milliseconds after the previous, starting at 140 milliseconds.

**What I left out and why**

The portfolio does not include my high school extracurriculars, volunteer work, or personal hobbies. I have those experiences, but the audience for this portfolio is recruiters and hiring managers evaluating me for data science and product management roles. Including a robotics club from 2019 or a debate trophy would dilute the signal. Every item on the portfolio earns its place by being directly relevant to the roles I am targeting. This was a deliberate curation choice, not laziness.

I also have not written detailed case studies for each project yet. The project detail pages have canonical descriptions and metadata, but they do not include process documentation, screenshots, or architecture diagrams. That is the next major milestone. The current versions tell you what I built and what my role was. The next versions will show you how I think.

---

## 3. Process Documentation

### Planning and scope

I started the project in late January 2025 with a simple goal: have a deployed, functional portfolio by the end of the semester. I did not write a formal project plan. I opened Figma, looked at twenty portfolios I admired (mostly found through Framer, Webflow showcases, and Readymag templates), and started sketching what mine could look like.

My early references shared some patterns: minimal color palettes, strong typography, lots of whitespace, and one or two interactive elements that made the site feel alive. I noticed that the portfolios I kept coming back to were the ones where something moved or responded. A spinning object, a parallax effect, a cursor that changed shape. The ones that felt like products rather than documents.

I set rough milestones in my head, not on paper:

- **End of January**: Basic structure decided. Technology chosen. First components roughed out.
- **Mid-February**: First deployed version on Netlify. Ugly, but navigable.
- **Early March**: Major design overhaul. The first version looked too much like a template. I ripped out the flat gallery approach for projects and started building the 3D carousel.
- **Mid-March**: First class presentation. Got feedback. Started rethinking the skills page.
- **Late March**: Second major pivot. Replaced the static skills grid with the Matter.js physics system.
- **Early April**: Content population. Real project descriptions, real images, real city data.
- **Mid-April**: Second class presentation. Final feedback round. Polish pass.
- **April 18**: Submission milestone. Deployed, navigable, content populated.

This timeline looks neat in retrospect. In practice, the middle six weeks were messy. I would work on the globe projection math for three hours, get frustrated, switch to tweaking the hero typography, realize I hated the font weight, change it, change it back, and end the day having committed nothing. The planning fallacy was real. I consistently underestimated how long animation tuning would take. Writing the code to make something move took an hour. Making it move well took a week.

### The design iteration process

The first deployed version was embarrassing. It had five sections, but they looked like wireframes with real text pasted in. The projects were displayed in a flat horizontal scroll. The skills were a grid. The contact was a list of links. Everything worked, and none of it was interesting.

The turning point was when I showed it to Yahya in mid-February. He scrolled through the whole thing in about twelve seconds and said, "It looks like a class project." That was not the feedback I wanted, but it was the feedback I needed. He was right. There was nothing on the page that would make someone stop scrolling.

I went back to the portfolios I admired and tried to figure out what they had that mine did not. The answer was dimensionality. The good portfolios created a sense of space. Elements had depth, movement, and weight. Mine was flat text on a flat background.

That realization drove the first major pivot: the Projects carousel. Instead of a horizontal scroll of flat cards, I built a polygonal ring. Nine project cards arranged in a regular nonagon, positioned using trigonometry (apothem times 1.06 for the circumradius, each card rotated by 40 degrees). The ring starts tilted at negative 30 degrees and scaled to 52%, looking like a coin viewed from an angle. As you scroll, it tilts upward to negative 5 degrees and scales to full size. You can drag to spin it. Hovering adds a slow cinematic parallax (lerp factor 0.022, which means the tilt tracks your mouse position very slowly, like a heavy object drifting).

The cosine-based depth opacity was a detail I am proud of. Each card's opacity is computed from its angle relative to the camera: `opacity = 0.40 + (cos(angle) + 1) / 2 * 0.60`. Cards facing the viewer are bright. Cards on the back of the ring fade to 40%. It is a small thing, but it makes the ring feel three-dimensional rather than just rotating.

### The Builds pivot

The Builds section went through a similar evolution. The first version was a simple horizontal scroll. Then I added perspective and Z-depth. Then I realized the depth was not dramatic enough: a 220px translateZ difference with a 940px perspective barely registers visually. So I pushed everything further.

The final version uses a 660px perspective (lower means more aggressive foreshortening), a depth range of negative 500 to positive 220 pixels, 66 degrees of Y-axis rotation at the edges, and overlapping cards (negative 24px gap on desktop). I also added scale variation (0.8 at the center, 1.08 at the edges) and dynamic shadows that grow as cards come closer. Each of these changes was made one at a time, visually evaluated, and either kept or reverted.

The smoothstep easing function was critical. Without it, the transition from center to edge would be linear, which looks mechanical. The smoothstep (3t squared minus 2t cubed) creates an S-curve that starts and ends gently but transitions quickly in the middle. Raising that to the 1.95 power makes the transition even sharper, so most of the depth change happens in a narrow band. This makes cards feel like they are flowing around a curve rather than sliding along a line.

One specific technical problem I spent days on: the card click behavior. Because the cards are draggable, I needed to distinguish between a click (short tap, no movement) and a drag (pointer moved more than 6 pixels). The solution was tracking the pointer ID, recording the start position, checking displacement on pointer-up, and only navigating if the displacement was below threshold and the pointer started and ended on the same card. This sounds simple but required careful coordination between React's synthetic events and the RAF-based transform system.

### The Stack page pivot

The skills page was the last major feature to change. The original version was a categorized grid. Yahya and Aiman both said it was fine, which in feedback language means forgettable.

The idea for the physics system came from a portfolio I saw that had floating elements. I thought: what if instead of elements floating decoratively, you could actually interact with them? What if the logos had physical properties?

Implementing it required solving the Phase 1 to Phase 2 handoff problem. In Phase 1, the icons are positioned by React's flexbox layout. In Phase 2, they need to be positioned by Matter.js. The bridge is a snapshot function that captures each icon's bounding rectangle (using getBoundingClientRect), maps it to a physics body position, and injects it into the engine. Icons that are scrolled off-screen get repositioned into a stacked formation above the viewport with staggered initial velocities, so they rain down naturally rather than appearing from nowhere.

The ground plane is positioned at the viewport height minus 56 pixels (the footer height), with a width of 3x the viewport width so bodies cannot fall off the sides. The engine runs at 60fps with a capped 32ms delta time to prevent physics explosions when the browser tab loses focus and requestAnimationFrame pauses.

I tuned the physics constants for several hours. Too much restitution (bounce) and the icons hop around forever. Too little and they thud to a stop immediately. The final values (0.35 restitution, 0.55 friction, 0.006 air friction) produce a satisfying bounce-settle behavior: two or three bounces, then rest. Gravity at 2.2 m/s squared is slightly above Earth-normal (9.8 m/s squared scaled to pixels), which makes the fall feel weighty without being slow.

### Feedback and how I used it

**Yahya**: My most consistent feedback source. His "it looks like a class project" comment in February drove the first major redesign. Later, he gave specific feedback on typography: the letter spacing on the hero name was too tight, and the muted foreground color was too dark in light mode. I adjusted both. He also pointed out that the builds carousel cards were blurry in the center (from the depth-of-field blur effect I had added). I removed the blur entirely because he was right: it made the cards look broken, not atmospheric.

**Aiman**: Focused more on content and narrative. He asked why my high school experiences were on the portfolio and whether a recruiter would care. That conversation led to the curation decision to remove everything pre-university. He also suggested that the project detail pages needed more depth, which they do. That is ongoing work.

**Class presentations**: Two formal presentations to classmates. The first (mid-March) was useful for catching interaction bugs I had not noticed: the wheel scrolling on the Builds carousel was not being prevented correctly, causing the entire page to scroll underneath. The second presentation (mid-April) gave me feedback on content: several classmates said the project descriptions were too generic and did not show what I actually did. I rewrote all of them with specific metrics and technical details.

### What went wrong

**Time allocation**: I spent too much time on animation tuning and not enough on content. The Builds carousel constants alone (depth, rotation, scale, shadow, perspective, gap) went through probably thirty iterations. Each iteration required visually evaluating the result, which meant waiting for hot reload, scrolling to the right section, dragging the carousel, and deciding if it felt better or worse. I did not have a systematic way to evaluate "better." I was going on instinct, and instinct is slow.

**Scope creep**: The physics simulation on the Stack page was not in any original plan. It emerged from dissatisfaction with a static grid. The same happened with the globe projection math, the city sticker system, the stop-motion contact page, and the procedural gallery layout on city pages. Each of these features was individually worth building, but together they meant I spent the semester on interactions and spent insufficient time on written content.

**Mobile optimization**: I tested on desktop primarily. The responsive breakpoints exist (840px for Builds, 768px for Projects) and the layouts adapt, but I have not done thorough mobile testing. Some of the 3D transforms probably look odd on small screens where the perspective differences are compressed.

### What I would do differently

I would establish evaluation criteria before starting to iterate. "Does this carousel feel good?" is not actionable. "Do the cards overlap enough that the reel looks continuous?" is. "Is the depth difference visible at a glance?" is. I spent hours iterating without clear criteria, which meant I was optimizing by feel rather than by measurement.

I would also timebox animation tuning more aggressively. Two hours to get the physics constants right. If it is not right in two hours, ship what I have and revisit later. The marginal improvement from hour three to hour six of tweaking restitution values is not worth it at this stage.

I would write content first. The project descriptions, city pages, and hero tagline should have been written in February, not April. Building features on top of placeholder content means you do not notice when the feature does not serve the content until the content arrives. Several of my design decisions would have been different if I had been looking at real text instead of lorem ipsum.

### How I evaluated my own work

I did not use formal metrics for most of the project. The signals I relied on were:

**Engagement test**: When I show the portfolio to someone, do they scroll past the hero page? If they stop at the globe and interact with it, the hero is working. If they scroll straight to the content, it is not interesting enough.

**Differentiation test**: If I swap out my name and content, does this look like it could be anyone's portfolio? If yes, it is too generic. The 3D carousel, the physics simulation, and the stop-motion contact section all pass this test. The project detail pages do not yet.

**Recruiter-relevance test**: If a hiring manager at a data science or PM role spends 90 seconds on this site, what do they learn? They learn what I built, what tools I know, what roles I have held, and that I care about craft. They do not yet learn how I think, which is the gap the case studies will fill.

**Technical integrity test**: Does everything work? No console errors from my code. No broken interactions. No jank at 60fps. I run TypeScript type checking before every deployment.

For the 3D animations specifically, I evaluated by comparing to reference material. The Builds carousel was inspired by Apple's product carousels, which use similar concave-arch perspective effects. I watched slow-motion recordings of those carousels to understand how the depth transition should feel and tuned my smoothstep curve power (1.95) and edge rotation (66 degrees) to approximate that feel.

### References and inspiration

I looked at dozens of portfolios during the planning phase. The ones that influenced my design most:

- **Framer templates**: Clean, editorial layouts. Strong typography. Lots of whitespace. Influenced my decision to use League Spartan as the primary typeface with tight letter spacing.
- **Readymag showcases**: Scroll-driven storytelling. Influenced the hero-to-globe scroll reveal.
- **Apple product pages**: Perspective-warped carousels. Directly inspired the Builds carousel concave arch.
- **Physics-based portfolio experiments**: Inspired the Matter.js stack page. The specific idea of making a standard grid become interactive came from seeing portfolios where elements had weight and movement.
- **Minimalist editorial portfolios**: Influenced the decision to keep the color palette to two colors per theme mode (foreground and background) with one muted gray for secondary text.

### What I learned about my process

I care about design more than I expected. I thought of myself primarily as a technical builder: someone who writes code, builds systems, ships features. This project revealed that I also have strong opinions about visual design and interaction quality. I spent more time deciding whether the card gap should be negative 20 or negative 24 pixels than I spent writing the entire Express server.

That instinct for design is valuable, but it needs to be managed. Without constraints, I will iterate forever on visual details while neglecting content and narrative. The most important thing I learned this semester is that taste without deadlines produces incomplete work. I need structured evaluation criteria and timeboxes to channel my design instincts productively.

I also learned that I work in bursts. I would have a three-hour session where I built the entire Matter.js integration from scratch, then spend the next two days making minor CSS adjustments. The productive pattern was clear: solve the hard problem in a focused session, then let the polish happen over time. I was most inefficient when I tried to polish without having solved the underlying problem first.

Finally, I learned that showing work-in-progress to real people is uncomfortable but essential. Every major improvement in this project came from feedback I did not want to hear. Yahya's "class project" comment hurt. Aiman's suggestion to cut high school content felt like erasing part of my story. The classmate who said my project descriptions were generic was right, and I had been avoiding that work for weeks. The discomfort is the signal.

---

## 4. HC and LO Descriptions

### #qualitydeliverables

The portfolio delivers a production-grade interactive web application with five distinct section-level features (3D project carousel, perspective-warped builds stream, physics-based skills page, WebGL globe with city markers, and stop-motion contact animation), each involving custom animation math and real-time rendering. The work product is deployed, navigable, responsive to two breakpoint ranges, and populated with canonical content grounded in real experiences and projects with verified metrics.

### #navigation

The project was planned as a semester-long iterative build, moving from wireframes (late January) through a first deployment (mid-February), two major design pivots (March), content population (April), and two in-class presentation checkpoints. I responded to setbacks, including a mid-project realization that the original flat-gallery design was too generic, by pivoting to the 3D carousel approach. I sought and acted on feedback from two peers (Yahya and Aiman) throughout the process, incorporating specific changes like removing a blur effect that degraded card readability and cutting content that did not serve the target audience.

### #outcomeanalysis

I evaluated the portfolio using four informal but specific criteria: engagement (do people interact with the globe and carousel, or scroll past?), differentiation (would this portfolio be recognizable without my name on it?), recruiter relevance (does a 90-second visit communicate role, skills, and craft?), and technical integrity (TypeScript compiles cleanly, animations hold 60fps, no broken interactions). These criteria are qualitative, which is appropriate for a design-forward portfolio where the work product is the experience itself. I recognize the gap: no formal user testing with actual recruiters has been conducted yet.

### #curation

The portfolio includes only experiences and projects that are directly relevant to the data science and product management roles I am targeting. High school extracurriculars, volunteer work, and unrelated activities were deliberately excluded despite being real parts of my background. Within the included content, I structured information in two tiers: short-form card descriptions on the main page for scanning, and detailed canonical descriptions on project pages for reading. The city section was curated to show professional work done in each location rather than personal travel narratives. Every inclusion and exclusion was evaluated against the question: does this help a recruiter understand what I can do?

---

## 5. Reflection

This mini capstone taught me three things that will shape how I approach my Year 4 capstone.

First, I know now that I can build complex interactive systems from scratch. Before this project, I had written React components and styled pages, but I had never computed 3D projection matrices, implemented a physics simulation, or built an animation system that runs at 60fps on requestAnimationFrame. The Globe component alone required me to learn spherical-to-Cartesian coordinate conversion, Euler angle rotation matrices, and back-face culling. The Builds carousel required smoothstep interpolation, power curves, and an understanding of how CSS perspective affects perceived depth. These are not skills I expected to develop in a portfolio project, but they are skills I now have and will carry forward.

Second, I learned that how you present work changes how you understand it. Writing the canonical descriptions for each experience forced me to ask: what did I actually do, and why did it matter? Some experiences that felt significant in the moment turned out to be hard to articulate concretely. Others that felt routine turned out to have impressive metrics when I looked at them honestly. The process of curating my own work taught me to evaluate it more objectively, which will be valuable when I scope my actual capstone project.

Third, I identified a specific weakness in my process: I iterate without criteria. I will change something, evaluate it by gut feeling, change it again, and repeat until I run out of time or energy. For the Year 4 capstone, I plan to establish explicit evaluation criteria before starting any design work, timebox iteration cycles, and use structured feedback rather than asking people "what do you think?" I want to arrive at my capstone with both the technical skills and the process discipline to produce work that is excellent without being over-polished.

The portfolio itself will keep growing. The next priorities are detailed case studies for each project (with screenshots, architecture decisions, and lessons learned), better mobile optimization, and more personality in the written voice. The infrastructure is solid. The interactions work. Now I need to fill the space with thinking, not just with motion.

What I am most proud of is not any individual feature. It is that someone can visit this site, interact with it for two minutes, and understand three things: I build real products, I care about how things feel, and I am not done getting better at either.
