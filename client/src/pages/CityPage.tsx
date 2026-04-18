import { useRoute } from "wouter";
import { motion } from "framer-motion";
import { useMemo, useRef } from "react";
import Logo from "@/components/Logo";
import { LOGO_SRC } from "@/logoData";
import { useTheme } from "@/contexts/ThemeContext";

interface CityInfo {
    name: string;
    label: string;
    description: string;
    placeholderCount?: number;
}

const cityData: Record<string, CityInfo> = {
    'san-francisco': {
        name: 'San Francisco',
        label: 'Foundation Year City',
        description: 'This was my foundation year and my first full chapter in the US. San Francisco became a second home through classes, late work sessions across the city, and the pace of the Bay Area ecosystem. It is where I started building with real intent, turning ideas into execution and learning to operate at a higher bar. The city taught me range: academic rigor, startup urgency, and everyday resilience.',
        placeholderCount: 8,
    },
    tokyo: {
        name: 'Tokyo',
        label: 'Summer Internship City',
        description: 'Tokyo was a summer chapter centered on my internship with the Nippon Foundation. This is where the urban heat island work matured through applied research, data pipelines, and policy-facing communication. Living in Tokyo also changed how I think about craft: attention to detail, respect for process, and care in everyday execution. It was intense, structured, and deeply formative.',
        placeholderCount: 8,
    },
    'buenos-aires': {
        name: 'Buenos Aires',
        label: 'Year Abroad City',
        description: 'Buenos Aires was a full-year chapter that blended building and cultural immersion. Alongside work with GIDE LATAM, I explored the city through its neighborhoods, language, and rhythm, learning Spanish and picking up tango along the way. It also became a base for traveling across Latin America, which expanded how I think about policy, infrastructure, and regional context. Buenos Aires made me more adaptable, more open, and more grounded in cross-cultural work.',
        placeholderCount: 8,
    },
    islamabad: {
        name: 'Islamabad',
        label: 'Home City',
        description: 'Islamabad is home and the place that shaped my foundations before anything else. It is where I studied at LGS, built my first leadership instincts, and learned to carry responsibility for the people around me. More than a resume line, this city is my grounding point: language, family, faith, and culture all live in how I work. Every project I take on still reflects the discipline, pride, and community mindset I learned here.',
        placeholderCount: 8,
    },
    seoul: {
        name: 'Seoul',
        label: 'Rotation Semester City',
        description: 'Seoul was a Minerva rotation semester defined by speed, ambition, and high standards. I worked with CoBALT and developed work that connected to the early urban heat island direction while taking sustainability-focused classes. The city pushed me to build faster without lowering quality, and Korean culture reinforced precision, consistency, and collective effort. Seoul felt like momentum in its purest form.',
        placeholderCount: 8,
    },
    taipei: {
        name: 'Taipei',
        label: 'Rotation Semester City',
        description: 'Taipei was a Minerva rotation semester and an exchange term at National Taiwan University. I worked with BEARVFX while studying, which let me pair classroom learning with real production constraints. The city\'s warmth stood out immediately: people were open, generous, and deeply community oriented. Taipei sharpened my ability to adapt quickly while staying present in culture, not just work.',
        placeholderCount: 8,
    },
    berlin: {
        name: 'Berlin',
        label: 'Coming Soon',
        description: 'Berlin is next on the journey. Coming soon.',
    },
};

interface GallerySlide {
    id: string;
    stripeAngle: number;
    stripeOpacity: number;
    radius: number;
}

function buildGallerySlides(cityId: string, count = 8): GallerySlide[] {
    const cityBoost = cityId.length % 13;

    return Array.from({ length: count }, (_, index) => ({
        id: `${cityId}-${index}`,
        stripeAngle: 130 + ((index * 11 + cityBoost) % 24),
        stripeOpacity: 0.08 + ((index + cityBoost) % 4) * 0.03,
        radius: 12 + ((index + cityBoost) % 3) * 2,
    }));
}

export default function CityPage() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';
    const pageRef = useRef<HTMLDivElement | null>(null);
    const galleryTrackRef = useRef<HTMLDivElement | null>(null);

    const [, params] = useRoute("/city/:id");
    const cityId = params?.id || "unknown";

    const city = cityData[cityId];
    const cityName = city?.name || cityId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const showCityGallery = cityId !== 'berlin';
    const slides = useMemo(
        () => (showCityGallery ? buildGallerySlides(cityId, city?.placeholderCount ?? 8) : []),
        [cityId, city?.placeholderCount, showCityGallery],
    );

    const shiftSlider = (direction: 1 | -1) => {
        const track = galleryTrackRef.current;
        if (!track) return;

        const step = Math.max(240, Math.round(track.clientWidth * 0.84));
        track.scrollBy({ left: direction * step, behavior: 'smooth' });
    };

    return (
        <div ref={pageRef} className="h-screen overflow-y-auto overflow-x-hidden p-8 bg-background text-foreground transition-colors duration-500">
            <div className="absolute top-8 left-8 md:top-12 md:left-12">
                <a href="/">
                    <Logo
                        onClick={() => { if (toggleTheme) toggleTheme(); }}
                        src={LOGO_SRC}
                        isDark={isDark}
                    />
                </a>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="pt-24 md:pt-28 max-w-[920px] mx-auto pb-20"
            >
                <h1
                    className="text-5xl md:text-8xl font-bold mb-4 text-center"
                    style={{
                        fontFamily: '"League Spartan", sans-serif',
                        letterSpacing: '-0.04em',
                    }}
                >
                    {cityName}
                </h1>

                {city && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="text-xs text-muted-foreground mb-8 text-center"
                        style={{
                            fontFamily: '"League Spartan", sans-serif',
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            fontWeight: 600,
                        }}
                    >
                        {city.label}
                    </motion.p>
                )}

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-base md:text-lg text-muted-foreground leading-relaxed text-left max-w-[820px] mx-auto"
                    style={{ fontFamily: '"League Spartan", sans-serif' }}
                >
                    {city?.description || 'More details coming soon.'}
                </motion.p>

                {showCityGallery ? (
                    <motion.section
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="mt-12 w-full max-w-[980px] mx-auto"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <p
                                className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground"
                                style={{ fontFamily: '"League Spartan", sans-serif' }}
                            >
                                City Gallery
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => shiftSlider(-1)}
                                    aria-label="Previous placeholders"
                                    className="h-8 w-8 border border-border text-foreground hover:bg-foreground hover:text-background transition-colors"
                                >
                                    ←
                                </button>
                                <button
                                    type="button"
                                    onClick={() => shiftSlider(1)}
                                    aria-label="Next placeholders"
                                    className="h-8 w-8 border border-border text-foreground hover:bg-foreground hover:text-background transition-colors"
                                >
                                    →
                                </button>
                            </div>
                        </div>

                        <div
                            ref={galleryTrackRef}
                            className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-3"
                        >
                            {slides.map((slide, index) => (
                                <motion.div
                                    key={slide.id}
                                    initial={{ opacity: 0, y: 18 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.35 }}
                                    transition={{ duration: 0.45, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
                                    className="relative shrink-0 snap-center w-[84%] sm:w-[66%] md:w-[52%] lg:w-[40%] aspect-[16/10] overflow-hidden border border-border"
                                    style={{
                                        borderRadius: slide.radius,
                                        background: 'linear-gradient(165deg, color-mix(in srgb, var(--card) 94%, var(--background) 6%) 0%, color-mix(in srgb, var(--background) 86%, var(--card) 14%) 100%)',
                                    }}
                                >
                                    <div
                                        style={{
                                            position: 'absolute',
                                            inset: 0,
                                            background: `repeating-linear-gradient(${slide.stripeAngle}deg, color-mix(in srgb, var(--foreground) 9%, transparent) 0 12px, transparent 12px 26px)`,
                                            opacity: slide.stripeOpacity,
                                        }}
                                    />
                                    <div
                                        style={{
                                            position: 'absolute',
                                            inset: 0,
                                            background: 'radial-gradient(circle at 20% 12%, color-mix(in srgb, var(--foreground) 11%, transparent) 0%, transparent 42%)',
                                        }}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="mt-12 mx-auto max-w-[520px] rounded-xl border border-border px-6 py-6 text-center"
                        style={{ fontFamily: '"League Spartan", sans-serif' }}
                    >
                        Coming soon - stay tuned.
                    </motion.div>
                )}

                <motion.a
                    href="/"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                    className="mt-12 inline-block px-6 py-3 border border-border text-sm font-medium hover:bg-foreground hover:text-background transition-colors"
                    style={{
                        fontFamily: '"League Spartan", sans-serif',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        fontSize: 11,
                    }}
                >
                    Return Home
                </motion.a>
            </motion.div>
        </div>
    );
}
