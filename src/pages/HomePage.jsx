
import { useRef, useMemo, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { ROUTES } from '../app/routeConstants';
import PrivacyPolicyModal from '../components/legal/PrivacyPolicyModal.jsx';
import TermsOfServiceModal from '../components/legal/TermsOfServiceModal.jsx';
import ContactModal from '../components/ContactModal.jsx';
import logoCustom from '../assets/logo_custom.jpg';
import {
    Bot,
    Zap,
    Database,
    Users,
    FileText,
    BarChart,
    ChevronRight,
    Github,
    Twitter,
    Linkedin,
    Code2,
    Server,
    Wind,
    Box,
    Cloud,
    Layers,
    Phone,
    Hexagon,
    TrendingUp,
    LayoutGrid,
    PhoneCall,
    Library,
    GraduationCap,
    Presentation
} from 'lucide-react';

// --- Background Particles Component ---
const ParticleBackground = () => {
    // Particles removed as requested
    const particles = [];

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black">
            {/* Stronger Nebula/Cosmic Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(59,130,246,0.15),_rgba(0,0,0,0)_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(124,58,237,0.1),_rgba(0,0,0,0)_40%)]" />

            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full bg-blue-500/20 blur-[1px]"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: p.size,
                        height: p.size,
                    }}
                    animate={{
                        y: [0, -100, 0],
                        opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    );
};

// --- Magnetic Button Component ---
const MagneticButton = ({ children, className, onClick }) => {
    const ref = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        const x = (clientX - (left + width / 2)) * 0.2; // Move 20% of cursor distance
        const y = (clientY - (top + height / 2)) * 0.2;
        setPosition({ x, y });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    const { x, y } = position;

    return (
        <motion.button
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            animate={{ x, y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            className={className}
        >
            {children}
        </motion.button>
    );
};

// --- Sticky Glass Navbar ---
const Navbar = () => {
    const { scrollY } = useScroll();
    const [hidden, setHidden] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        return scrollY.onChange((latest) => {
            if (latest > 500) setHidden(false);
            else setHidden(true);
        });
    }, [scrollY]);

    return (
        <motion.nav
            variants={{
                visible: { y: 0, opacity: 1 },
                hidden: { y: -100, opacity: 0 }
            }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/50 backdrop-blur-xl border-b border-white/5 shadow-lg"
        >
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Bot className="text-white w-5 h-5" />
                </div>
                <span className="text-lg font-bold text-white tracking-tight">AICC NAVIGATOR</span>
            </div>

            <MagneticButton
                className="px-5 py-2 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/10 rounded-full transition-colors backdrop-blur-md"
                onClick={() => navigate(ROUTES.LOGIN)}
            >
                Login
            </MagneticButton>
        </motion.nav>
    );
};

// --- Animated Text Component ---
const ScrollRevealText = ({ children, className }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const opacity = useTransform(scrollYProgress, [0, 0.35, 0.45, 0.6, 0.8], [0, 1, 1, 1, 0]);
    const y = useTransform(scrollYProgress, [0, 0.3, 0.8], [50, 0, -50]);

    return (
        <motion.div ref={ref} style={{ opacity, y }} className={className}>
            {children}
        </motion.div>
    );
};

// --- 3D Dashboard Preview Component ---
const DashboardPreview = () => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [5, -5]);
    const rotateY = useTransform(x, [-100, 100], [-5, 5]);

    function handleMouse(event) {
        const rect = event.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set((event.clientX - centerX) / 40); // Slower tilt
        y.set((event.clientY - centerY) / 40);
    }

    return (
        <motion.div
            style={{ perspective: 1200 }}
            className="w-full max-w-7xl mx-auto mt-12 px-4 z-20 relative"
            onMouseMove={handleMouse}
            onMouseLeave={() => { x.set(0); y.set(0); }}
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1 }}
        >
            <motion.div
                style={{ rotateX, rotateY }}
                className="relative rounded-3xl bg-slate-50 border border-slate-200 shadow-2xl overflow-hidden aspect-[16/10] transform-style-3d will-change-transform flex"
            >
                {/* --- MOCKED SIDEBAR --- */}
                <div className="w-64 bg-white/50 backdrop-blur-sm border-r border-slate-100 p-6 flex flex-col justify-between shrink-0 z-10">
                    <div>
                        <div className="mb-8">
                            <div className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                                CS-Navigator
                            </div>
                            <div className="text-xs text-slate-400 font-bold uppercase mt-1">Console</div>
                        </div>

                        <div className="space-y-2">
                            {/* Active Link */}
                            <div className="flex items-center gap-3 rounded-2xl px-4 py-3 bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm cursor-default">
                                <div className="grid place-items-center h-8 w-8 rounded-lg bg-white border border-indigo-100">
                                    <LayoutGrid size={18} />
                                </div>
                                <span className="font-bold text-sm">Dashboard</span>
                            </div>

                            {/* Inactive Links */}
                            {[{ icon: Users, label: "Assistant" }, { icon: PhoneCall, label: "Call History" }, { icon: Library, label: "Library" }, { icon: GraduationCap, label: "Training" }].map((bg, idx) => (
                                <div key={idx} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-slate-500 hover:bg-slate-50/50 cursor-default opacity-80">
                                    <div className="grid place-items-center h-8 w-8 rounded-lg bg-white border border-slate-100">
                                        <bg.icon size={18} />
                                    </div>
                                    <span className="font-semibold text-sm">{bg.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar Footer */}
                    <div className="pt-6 border-t border-slate-200/50">
                        <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-200">
                                AD
                            </div>
                            <div>
                                <div className="text-sm font-extrabold text-slate-800">Admin</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase">Administrator</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- MOCKED ADMIN DASHBOARD BODY --- */}
                <div className="flex-1 p-6 md:p-8 overflow-hidden bg-slate-50/50 relative z-0">
                    {/* Header Section */}
                    <div className="mb-6 flex justify-between items-end">
                        <div>
                            <div className="text-sm text-slate-500 font-semibold mb-1">Overview</div>
                            <div className="text-2xl font-extrabold text-slate-900">관리자 대시보드</div>
                        </div>
                        <div className="flex gap-2">
                            <div className="bg-white p-2 rounded-full border border-slate-100 shadow-sm"><Users className="w-4 h-4 text-slate-400" /></div>
                        </div>
                    </div>

                    {/* KPI Section */}
                    <div className="grid grid-cols-4 gap-3 mb-6">
                        {[
                            { title: "FCR", val: "94.2%", trend: "+1.2%", up: true },
                            { title: "CSAT", val: "4.8", trend: "+0.3", up: true },
                            { title: "NPS", val: "72", trend: "+2.5", up: true },
                            { title: "Sense", val: "Good", trend: "0.0", up: true }
                        ].map((kpi, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
                                <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">{kpi.title}</div>
                                <div className="text-xl font-black text-slate-800 mb-1">{kpi.val}</div>
                                <div className={`flex items-center gap-1 text-[10px] font-bold ${kpi.up ? 'text-emerald-500' : 'text-slate-400'}`}>
                                    {kpi.up && <TrendingUp size={12} />} <span>{kpi.trend}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-[1fr_1.5fr] gap-4 h-full">
                        {/* List Card */}
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
                            <div className="flex justify-between items-center mb-4">
                                <div className="font-bold text-slate-800 text-sm">이탈 징후</div>
                                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                            </div>
                            <div className="space-y-2">
                                {[
                                    { name: "김지민", team: "배송", risk: 82 },
                                    { name: "정유진", team: "기술", risk: 77 },
                                    { name: "이현우", team: "결제", risk: 53 },
                                    { name: "박수아", team: "배송", risk: 31 },
                                ].map((c, i) => (
                                    <div key={i} className="flex justify-between items-center p-2 rounded-xl border border-slate-50 bg-slate-50/50 hover:bg-slate-100 transition-colors">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center font-bold text-xs text-slate-500 shadow-sm">{c.name[0]}</div>
                                            <div>
                                                <div className="font-bold text-slate-700 text-xs">{c.name}</div>
                                                <div className="text-[10px] text-slate-400">{c.team}</div>
                                            </div>
                                        </div>
                                        <div className={`text-sm font-black ${c.risk > 80 ? 'text-rose-500' : c.risk > 50 ? 'text-amber-500' : 'text-emerald-500'}`}>{c.risk}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Detail Card */}
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 relative overflow-hidden flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-lg font-black text-slate-900">김지민</div>
                                    <div className="text-xs text-slate-500 font-medium">A-1021 · 배송/반품</div>
                                </div>
                                <span className="px-2 py-1 rounded bg-rose-100 text-rose-600 text-[10px] font-bold">Risk High</span>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-3 bg-rose-50 rounded-xl">
                                    <div className="text-[10px] text-rose-400 font-bold uppercase">Risk</div>
                                    <div className="text-lg font-black text-rose-500">82</div>
                                </div>
                                <div className="p-3 bg-indigo-50 rounded-xl">
                                    <div className="text-[10px] text-indigo-400 font-bold uppercase">Stress</div>
                                    <div className="text-lg font-black text-indigo-500">Avg</div>
                                </div>
                            </div>

                            <div className="flex-1 bg-slate-50 rounded-xl relative overflow-hidden border border-slate-100">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={[
                                        { d: 'M', v: 30 }, { d: 'T', v: 45 }, { d: 'W', v: 35 },
                                        { d: 'T', v: 60 }, { d: 'F', v: 75 }, { d: 'S', v: 50 }, { d: 'S', v: 65 }
                                    ]}>
                                        <defs>
                                            <linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <Area type="monotone" dataKey="v" stroke="#f43f5e" strokeWidth={3} fill="url(#colorV)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reflection Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none rounded-3xl z-20" />
            </motion.div>
        </motion.div>
    );
};

// --- Hero Section ---
// --- Hero Section ---
const HeroSection = () => {
    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 800], [1, 0]);
    const y = useTransform(scrollY, [0, 800], [0, -100]);
    const blurVal = useTransform(scrollY, [0, 800], [0, 10]);
    const filter = useTransform(blurVal, (v) => `blur(${v}px)`);

    return (
        <section className="relative min-h-screen z-0">
            {/* Sticky Container for Text */}
            <motion.div
                style={{ opacity, y, filter }}
                className="fixed top-0 left-0 right-0 h-screen flex flex-col items-center justify-center pointer-events-none z-0 will-change-transform"
            >
                <div className="text-center px-4 max-w-5xl mx-auto mb-10">

                    {/* 1. Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5, duration: 0.8, ease: "easeOut" }}
                        className="mb-6"
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-bold tracking-wide backdrop-blur-md">
                            Next Generation Contact Center
                        </span>
                    </motion.div>

                    {/* 2. Main Title Line 1 */}
                    <motion.h1
                        className="text-6xl md:text-8xl font-black tracking-tight leading-tight text-white shadow-2xl mb-2"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
                    >
                        미래형 AI 고객센터
                    </motion.h1>

                    {/* 3. Main Title Line 2 */}
                    <motion.div
                        className="text-6xl md:text-8xl font-black tracking-tight leading-tight mb-10"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9, duration: 0.8, ease: "easeOut" }}
                    >
                        <motion.span
                            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            style={{ backgroundSize: "200% auto" }}
                            className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400"
                        >
                            AICC NAVIGATOR
                        </motion.span>
                    </motion.div>

                    {/* 0. Bottom Text (Appears First, then Shimmers) */}
                    {/* 0. Bottom Text (Layered Shimmer with Bloom) */}
                    <div className="relative inline-block">
                        {/* Base Layer (Dimmed) */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="text-xl md:text-2xl font-light tracking-widest text-gray-600"
                        >
                            스크롤하여 AI의 가능성을 탐험하세요
                        </motion.p>

                        {/* Shimmer Overlay (Extreme Brightness + Double Bloom) */}
                        <motion.p
                            initial={{ backgroundPosition: "200% 0", opacity: 0 }}
                            animate={{ backgroundPosition: "-200% 0", opacity: [0, 1, 1, 0] }}
                            transition={{
                                backgroundPosition: {
                                    delay: 1.0,
                                    duration: 7,
                                    repeat: Infinity,
                                    repeatType: "loop",
                                    ease: "linear",
                                    repeatDelay: 1
                                },
                                opacity: {
                                    delay: 1.0,
                                    duration: 7,
                                    repeat: Infinity,
                                    repeatType: "loop",
                                    ease: "easeInOut",
                                    times: [0, 0.4, 0.6, 1],
                                    repeatDelay: 1
                                }
                            }}
                            style={{
                                backgroundSize: "200% auto",
                                filter: "brightness(3) drop-shadow(0 0 10px rgba(255,255,255,1)) drop-shadow(0 0 50px rgba(255,255,255,0.8))"
                            }}
                            className="absolute inset-0 text-xl md:text-2xl font-light tracking-widest bg-gradient-to-r from-transparent via-white via-50% to-transparent bg-clip-text text-transparent will-change-[background-position]"
                        >
                            스크롤하여 AI의 가능성을 탐험하세요
                        </motion.p>
                    </div>
                </div>
            </motion.div>

            {/* Spacer */}
            <div className="h-screen w-full bg-transparent relative z-0" />

            {/* Rising Cosmic Mask */}
            <div className="h-[200px] w-full bg-gradient-to-b from-transparent to-black relative z-10 flex justify-center">
                <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-blue-500 to-transparent opacity-80" />
            </div>
        </section>
    );
};

// --- Feature Card Component (Grid Item) ---
const FeatureCard = ({ icon: Icon, title, desc, idx, scrollYProgress, colorClass, iconColorClass, gradientClass }) => {
    const isRow1 = idx < 3;
    const xRange = isRow1 ? [250, 0, 0, -250] : [-250, 0, 0, 250];

    const rawX = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], xRange);
    const x = useSpring(rawX, { stiffness: 30, damping: 30, mass: 2 });
    const opacity = useTransform(scrollYProgress, [0.05, 0.25, 0.75, 0.95], [0, 1, 1, 0]);
    const blur = useTransform(scrollYProgress, [0.05, 0.25, 0.75, 0.95], [8, 0, 0, 8]);
    const filter = useTransform(blur, (v) => `blur(${v}px)`);

    return (
        <motion.div
            style={{ x, opacity, filter, willChange: "transform, filter" }}
            className="relative group p-8 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/20 backdrop-blur-lg shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] hover:shadow-[0_8px_32px_0_rgba(255,255,255,0.2)] transition-all hover:scale-105 min-h-[320px] flex flex-col justify-between overflow-hidden"
        >
            {/* Glossy Overlay for Glass Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-30 pointer-events-none rounded-2xl" />

            {/* Alive Icon Container */}
            <div className={`relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors border border-white/10 bg-black/20 ${colorClass}`}>
                <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Icon className={`w-7 h-7 transition-colors ${iconColorClass} group-hover:text-white`} />
                </motion.div>
            </div>

            <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">{title}</h3>
                <p className="text-gray-300 leading-relaxed font-light drop-shadow-md">
                    {desc}
                </p>
            </div>

            {/* Explicit Gradient Line */}
            <div className={`relative z-10 w-full h-[2px] mt-6 opacity-40 group-hover:opacity-100 transition-opacity bg-gradient-to-r ${gradientClass} to-transparent`} />
        </motion.div>
    );
};

// --- Infinite Marquee Component ---
const InfiniteMarquee = () => {
    const techStack = [
        { name: "React", icon: Code2 },
        { name: "Spring Boot", icon: Server },
        { name: "FastAPI", icon: Wind },
        { name: "Python", icon: Layers },
        { name: "OpenAI", icon: Bot },
        { name: "Docker", icon: Box },
        { name: "AWS", icon: Cloud },
        { name: "Qdrant", icon: Database },
        { name: "Asterisk", icon: Phone },
        { name: "Kubernetes", icon: Hexagon }
    ];

    return (
        // Added sticky background to cover the Hero Text
        <div className="relative w-full overflow-hidden py-10 bg-black z-20 border-y border-white/5">


            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black via-black/80 to-transparent z-10" />

            <motion.div
                className="flex whitespace-nowrap relative z-10"
                animate={{ x: [0, -1000] }}
                transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
            >
                {[...techStack, ...techStack, ...techStack].map((tech, i) => (
                    <div key={i} className="mx-8 flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity cursor-default group">
                        <tech.icon className="w-6 h-6 text-blue-500 group-hover:text-white transition-colors" />
                        <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-300 group-hover:from-white group-hover:to-white transition-all">
                            {tech.name}
                        </span>
                        {/* Dot separator */}
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50 ml-6" />
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

// --- Features Section ---
const FeatureSection = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });

    const features = [
        {
            icon: Bot,
            title: "실시간 상담 가이던스",
            desc: "고객의 발화 의도를 즉시 파악하고, 최적의 스크립트를 실시간 추천합니다.",
            colorClass: "group-hover:bg-blue-500/20",
            iconColorClass: "text-blue-400",
            gradientClass: "from-blue-500"
        },
        {
            icon: Zap,
            title: "AI 맞춤 마케팅 추천",
            desc: "구매 전환율이 가장 높은 타이밍에 고객에게 맞는 최적의 상품을 실시간으로 제안합니다.",
            colorClass: "group-hover:bg-purple-500/20",
            iconColorClass: "text-purple-400",
            gradientClass: "from-purple-500"
        },
        {
            icon: Database,
            title: "AI 규정/지식 자동 검색",
            desc: "Qdrant VectorDB를 기반으로, 대화 상황에 맞는 사내 규정과 상품 정보를 AI가 실시간으로 찾아 띄워줍니다.",
            colorClass: "group-hover:bg-indigo-500/20",
            iconColorClass: "text-indigo-400",
            gradientClass: "from-indigo-500"
        },
        {
            icon: Users,
            title: "AI 롤플레잉 교육",
            desc: "가상 고객과의 무제한 모의 훈련으로 신입 상담원을 빠르게 육성합니다.",
            colorClass: "group-hover:bg-pink-500/20",
            iconColorClass: "text-pink-400",
            gradientClass: "from-pink-500"
        },
        {
            icon: FileText,
            title: "자동 상담 요약",
            desc: "통화 종료 즉시 핵심 내용과 후속 조치를 자동 기록합니다.",
            colorClass: "group-hover:bg-amber-500/20",
            iconColorClass: "text-amber-400",
            gradientClass: "from-amber-500"
        },
        {
            icon: Presentation,
            title: "PPT 기반 AI 교육/콘텐츠 생성",
            desc: "업로드한 매뉴얼(PPT)을 분석하여, AI 강사의 진행이 담긴 몰입형 교육 영상과 평가 퀴즈를 자동으로 생성합니다.",
            colorClass: "group-hover:bg-emerald-500/20",
            iconColorClass: "text-emerald-400",
            gradientClass: "from-emerald-500"
        }
    ];

    return (
        <section className="relative z-20 bg-black py-40 px-4 min-h-screen flex flex-col justify-center border-t border-white/5">
            <div className="mb-32 text-center">
                <ScrollRevealText className="text-4xl md:text-6xl font-bold text-gray-200">
                    비즈니스를 위한<br />
                    <span className="text-blue-500">핵심 AI 솔루션</span>
                </ScrollRevealText>
            </div>

            <div ref={containerRef} className="container mx-auto max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((f, i) => (
                        <FeatureCard
                            key={i}
                            {...f}
                            idx={i}
                            scrollYProgress={scrollYProgress}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- Preview & CTA Section ---
const PreviewCTASection = () => {
    const navigate = useNavigate();

    return (
        <section className="relative z-10 bg-black min-h-screen py-20 px-4 relative overflow-hidden border-t border-white/5">
            {/* Background Glow */}
            <div className="absolute top-[20%] left-[20%] w-[800px] h-[800px] bg-blue-900/20 rounded-full blur-[120px] animate-pulse pointer-events-none" />

            <div className="text-center mb-10 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        경험이 증명합니다
                    </h2>
                    <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                        실제 운영 환경과 동일한 대시보드를 확인하세요.<br />
                        로그인하고 모든 데이터를 직접 제어해볼 수 있습니다.
                    </p>

                    <MagneticButton
                        className="bg-white text-black text-lg font-bold py-4 px-10 rounded-full inline-flex items-center gap-2 shadow-xl hover:shadow-2xl hover:bg-gray-100 transition-all mb-12"
                        onClick={() => navigate(ROUTES.LOGIN)}
                    >
                        지금 바로 시작하기 <ChevronRight size={20} />
                    </MagneticButton>
                </motion.div>
            </div>

            {/* The 3D Dashboard Preview */}
            <DashboardPreview />
        </section>
    );
};

// --- Footer ---
const Footer = () => {
    const [privacyOpen, setPrivacyOpen] = useState(false);
    const [termsOpen, setTermsOpen] = useState(false);
    const [contactOpen, setContactOpen] = useState(false);

    return (
        <footer className="relative z-20 bg-[#050510] border-t border-white/5 text-gray-400 text-sm">
            <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">

                {/* Brand */}
                <div className="flex-1 text-center md:text-left flex flex-col items-center md:items-start">
                    <div className="flex items-center gap-2 mb-2">
                        {/* Custom Logo Container */}
                        <div className="w-8 h-8 rounded-md overflow-hidden relative border border-white/20 shadow-sm shrink-0 flex items-center justify-center bg-white">
                            <img
                                src={logoCustom}
                                alt="Logo"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className="font-extrabold text-white text-lg tracking-tight">AICC NAVIGATOR</span>
                    </div>
                    <p className="opacity-70 text-sm mb-4">Experience the future of customer service.</p>

                    <div className="flex flex-col gap-1 text-xs text-gray-500 font-medium">
                        <span>서울특별시 강남구 개포로 310 (개포동)</span>
                        <span>Tel. 010-5609-3387</span>
                        <span>Email. daegyuchang@gmail.com</span>
                    </div>
                </div>

                {/* Links */}
                <div className="flex-1 flex justify-center gap-8 font-medium">
                    <button onClick={() => setPrivacyOpen(true)} className="hover:text-white transition-colors">Privacy Policy</button>
                    <button onClick={() => setTermsOpen(true)} className="hover:text-white transition-colors">Terms of Service</button>
                    <button onClick={() => setContactOpen(true)} className="hover:text-white transition-colors">Contact</button>
                </div>

                {/* Socials */}
                <div className="flex-1 flex justify-end gap-4">
                    <a href="https://github.com/twelevegg" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-full hover:bg-white/10 hover:text-white transition-all"><Github className="w-5 h-5" /></a>
                </div>
            </div>
            <div className="bg-black/20 py-6 text-center text-xs opacity-40">
                &copy; 2026 TwelveGG AICC. All rights reserved.
            </div>

            {/* Render Modals */}
            {createPortal(
                <>
                    <PrivacyPolicyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
                    <TermsOfServiceModal open={termsOpen} onClose={() => setTermsOpen(false)} />
                    <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
                </>,
                document.body
            )}
        </footer>
    );
};

export default function HomePage() {
    return (
        <div className="bg-black min-h-screen">
            <ParticleBackground />

            <Navbar />
            <HeroSection />
            <InfiniteMarquee />
            <FeatureSection />
            <PreviewCTASection />  {/* Combined CTA and Preview */}
            <Footer />

            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
        </div>
    );
}
