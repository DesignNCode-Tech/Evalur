"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom" // Added for redirection logic

interface Feature {
  title: string
  description: string
  icon: React.FC<{ className?: string }>
  colorClass: string
}

interface Tier {
  num: string
  title: string
  desc: string
  tag: string
  tagColor: string
  numColor: string
}

interface Stat {
  value: string
  label: string
}

interface Step {
  title: string
  desc: string
}


const IconDoc: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
)

const IconCode: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
    <polyline points="7 8 10 11 7 14" />
    <line x1="13" y1="14" x2="17" y2="14" />
  </svg>
)

const IconShield: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
)

const IconSparkles: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="2,12 6,7 9,10 14,4" />
    <circle cx="14" cy="4" r="1.5" fill="white" stroke="none" />
  </svg>
)

const IconArrow: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS: Stat[] = [
  { value: "70%", label: "Faster onboarding" },
  { value: "3×", label: "Better-fit hires" },
  { value: "95%", label: "Candidate satisfaction" },
]

const TIERS: Tier[] = [
  {
    num: "01",
    title: "Knowledge layer",
    desc: "MCQs verify comprehension of internal APIs, compliance rules, and system architecture derived from your own docs.",
    tag: "Knowledge",
    tagColor: "bg-indigo-100 text-indigo-600",
    numColor: "bg-indigo-100 text-indigo-600",
  },
  {
    num: "02",
    title: "Judgment layer",
    desc: "Debugging scenarios test how candidates respond to simulated production issues using your company's policies.",
    tag: "Judgment",
    tagColor: "bg-sky-100 text-sky-600",
    numColor: "bg-sky-100 text-sky-600",
  },
  {
    num: "03",
    title: "Execution layer",
    desc: "Coding tasks require building or fixing real features using your actual corporate boilerplate and internal test cases.",
    tag: "Execution",
    tagColor: "bg-emerald-100 text-emerald-600",
    numColor: "bg-emerald-100 text-emerald-600",
  },
]

const FEATURES: Feature[] = [
  {
    title: "Proprietary knowledge ingestion",
    description:
      "Upload PDFs and Markdown docs or connect your GitHub repository. The LangChain4j RAG pipeline parses, vectorizes, and creates company-specific challenges automatically — no manual test creation needed.",
    icon: IconDoc,
    colorClass: "bg-indigo-100 text-indigo-500",
  },
  {
    title: "Multi-layered assessment engine",
    description:
      "A three-tier evaluation covers knowledge, judgment, and execution. Each layer is calibrated to your codebase so you measure real-world readiness, not abstract problem-solving ability.",
    icon: IconCode,
    colorClass: "bg-amber-100 text-amber-500",
  },
  {
    title: "Open-book secure sandbox",
    description:
      "A split-screen environment lets candidates access your internal documentation alongside a live code execution runtime. Submissions are validated in real time against your actual internal test cases.",
    icon: IconShield,
    colorClass: "bg-emerald-100 text-emerald-600",
  },
]

const STEPS: Step[] = [
  {
    title: "Ingest your documentation",
    desc: "Upload internal docs or link your GitHub repo. The RAG engine indexes your architecture and generates contextual challenges.",
  },
  {
    title: "Configure your assessment",
    desc: "Select the knowledge, judgment, and execution tiers relevant to the role. Evalur generates the questions and coding tasks.",
  },
  {
    title: "Candidates work in a real environment",
    desc: "A sandboxed IDE pre-loaded with your boilerplate, docs alongside. Submissions validate against your internal test suite.",
  },
  {
    title: "Review AI-scored results",
    desc: "Get ranked readiness scores with reasoning traces. Know exactly where a candidate is strong before their first commit.",
  },
]

const NAV_LINKS = ["Features", "How it works", "Pricing"]

// ─── Sub-components ──────────────────────────────────────────────────────────

const EyebrowBadge: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <span
    className={`inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-600 ${className}`}
  >
    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
    {children}
  </span>
)

const TierCard: React.FC<{ tier: Tier; index: number }> = ({ tier, index }) => {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: hovered ? "translateX(5px)" : "translateX(0)",
        transition: "transform 0.2s ease, border-color 0.2s ease",
        animationDelay: `${index * 0.1}s`,
      }}
      className="relative flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5 cursor-default"
    >
      <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-xs font-medium mt-0.5 ${tier.numColor}`}>
        {tier.num}
      </div>
      <div className="flex-1 min-w-0">
        <p className="mb-1 text-sm font-medium text-gray-900">{tier.title}</p>
        <p className="text-sm leading-relaxed text-gray-500">{tier.desc}</p>
      </div>
      <span className={`absolute right-4 top-4 rounded-full px-2 py-0.5 text-xs font-medium ${tier.tagColor}`}>
        {tier.tag}
      </span>
    </div>
  )
}

const FeatureCard: React.FC<{ feature: Feature; index: number }> = ({ feature, index }) => {
  const [hovered, setHovered] = useState(false)
  const Icon = feature.icon

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "transform 0.2s ease, border-color 0.2s ease",
        animationDelay: `${index * 0.1 + 0.2}s`,
      }}
      className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-7"
    >
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${feature.colorClass}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="mb-2 text-base font-medium text-gray-900">{feature.title}</h3>
        <p className="text-sm leading-relaxed text-gray-500">{feature.description}</p>
      </div>
    </div>
  )
}

const SandboxVisual: React.FC = () => (
  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
    {/* Title bar */}
    <div className="mb-3 flex h-8 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3">
      <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
      <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
      <span className="ml-2 text-xs text-gray-400">evalur — candidate sandbox</span>
    </div>

    {/* Split panes */}
    <div className="grid h-52 grid-cols-2 gap-2.5">
      {/* Docs pane */}
      <div className="rounded-lg border border-gray-200 bg-white p-3">
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-gray-400">Internal docs</p>
        {[90, 70, 85, 60, 80, 50, 70, 85, 60].map((w, i) => (
          <div key={i} className="mb-1.5 h-1.5 rounded-full bg-gray-200" style={{ width: `${w}%` }} />
        ))}
      </div>

      {/* Code pane */}
      <div className="rounded-lg border border-gray-200 bg-white p-3">
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-gray-400">Code editor</p>
        <div className="mb-1.5 h-1.5 w-4/5 rounded-full bg-indigo-100" />
        <div className="mb-1.5 ml-3 h-1.5 w-3/5 rounded-full bg-gray-200" />
        <div className="mb-1.5 ml-3 h-1.5 w-11/12 rounded-full bg-indigo-100" />
        <div className="mb-1.5 ml-6 h-1.5 w-2/5 rounded-full bg-gray-200" />
        <div className="mb-1.5 ml-6 h-1.5 w-3/4 rounded-full bg-sky-100" />
        <div className="mb-1.5 ml-3 h-1.5 w-4/5 rounded-full bg-gray-200" />
        <div className="mb-1.5 h-1.5 w-3/5 rounded-full bg-gray-200" />
        <div className="h-1.5 w-1/4 rounded-full bg-emerald-100" />
      </div>
    </div>

    {/* Status badges */}
    <div className="mt-3 flex flex-wrap gap-2">
      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
        12 / 12 tests passing
      </span>
      <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
        Architecture score: 94%
      </span>
      <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700">
        Time: 38 min
      </span>
    </div>
  </div>
)

// ─── Main Component ───────────────────────────────────────────────────────────

export const HomePage: React.FC = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate() // Initialize navigate

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden bg-white text-gray-900"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        .font-display { font-family: 'DM Serif Display', serif; }
        .font-body { font-family: 'DM Sans', sans-serif; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fadeUp 0.55s ease both; }
      `}</style>

      {/* ── Navbar ── */}
      <header
        className={`sticky top-0 z-50 border-b transition-shadow duration-200 ${
          scrolled ? "shadow-sm" : ""
        } bg-white/90 backdrop-blur-md border-gray-100`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2.5 font-medium text-[17px] tracking-tight"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-gradient-to-br from-indigo-500 to-sky-500">
              <IconSparkles />
            </div>
            Evalur
          </button>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                className="rounded-lg px-4 py-2 text-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                {link}
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <button 
              onClick={() => navigate("/auth/login")}
              className="rounded-lg px-4 py-2 text-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              Sign in
            </button>
            <button 
              onClick={() => navigate("/auth/register")}
              className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Get started
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="flex flex-col gap-1.5 p-2 md:hidden"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span className={`block h-0.5 w-5 bg-gray-700 transition-transform ${mobileMenuOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 bg-gray-700 transition-opacity ${mobileMenuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-gray-700 transition-transform ${mobileMenuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-100 bg-white px-5 py-4 md:hidden">
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                className="block w-full rounded-lg px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                {link}
              </button>
            ))}
            <div className="mt-3 flex gap-2">
              <button 
                onClick={() => navigate("/auth/login")}
                className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm text-gray-700"
              >
                Sign in
              </button>
              <button 
                onClick={() => navigate("/auth/register")}
                className="flex-1 rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white"
              >
                Get started
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ── NEW Top Hero Section ── */}
      <section className="bg-white pt-20 pb-12 overflow-hidden border-b border-gray-50">
        <div className="mx-auto max-w-4xl px-5 text-center">
          <div className="animate-fade-up" style={{ animationDelay: "0s" }}>
            <EyebrowBadge className="mb-8">Announcing Evalur 2.0</EyebrowBadge>
          </div>
          <h1 
            className="font-display text-6xl md:text-8xl mb-8 tracking-tighter text-gray-900 animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            The future of <span className="text-indigo-600">engineering readiness.</span>
          </h1>
          <p 
            className="text-xl md:text-2xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-up font-body"
            style={{ animationDelay: "0.2s" }}
          >
            Skip the generic LeetCode puzzles. Evalur builds adaptive skill verification environments based on your actual codebase.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <button 
              onClick={() => navigate("/auth/register")}
              className="bg-indigo-600 text-white px-10 py-5 rounded-2xl text-lg font-bold shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 group"
            >
              Get Started for Free
              <IconArrow className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="bg-white text-gray-700 border-2 border-gray-200 px-10 py-5 rounded-2xl text-lg font-bold hover:bg-gray-50 transition-all">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* ── Original Hero ── */}
      <section className="min-h-[calc(100vh-64px)] border-b border-gray-100">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-0 lg:grid-cols-2 lg:divide-x lg:divide-gray-100">

          {/* Left */}
          <div className="flex flex-col justify-center px-5 py-16 lg:px-10 lg:py-20">
            <EyebrowBadge className="animate-fade-up mb-6 w-fit" style={{ animationDelay: "0s" } as React.CSSProperties}>
              AI-Powered Engineering Readiness
            </EyebrowBadge>

            <h1
              className="font-display animate-fade-up mb-6 text-5xl leading-[1.1] tracking-tight text-gray-900 lg:text-6xl"
              style={{ animationDelay: "0.08s" } as React.CSSProperties}
            >
              Hire engineers who{" "}
              <em className="text-indigo-500 not-italic font-display">actually</em>{" "}
              ship on day one
            </h1>

            <p
              className="animate-fade-up mb-8 max-w-lg text-lg leading-relaxed text-gray-500"
              style={{ animationDelay: "0.16s" } as React.CSSProperties}
            >
              Evalur assesses real-world engineering capability using your proprietary
              architecture, internal docs, and live coding environments — not generic
              algorithm tests.
            </p>

            <div
              className="animate-fade-up flex flex-wrap gap-3"
              style={{ animationDelay: "0.22s" } as React.CSSProperties}
            >
              <button 
                onClick={() => navigate("/auth/register")}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-[15px] font-medium text-white transition-opacity hover:opacity-90"
              >
                Start free trial
                <IconArrow className="h-4 w-4" />
              </button>
              <button className="rounded-xl border-2 border-gray-200 px-7 py-3.5 text-[15px] font-medium text-gray-700 transition-colors hover:border-indigo-300 hover:bg-indigo-50">
                Watch demo
              </button>
            </div>

            {/* Stats */}
            <div
              className="animate-fade-up mt-12 grid grid-cols-3 gap-6 border-t border-gray-100 pt-10"
              style={{ animationDelay: "0.3s" } as React.CSSProperties}
            >
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="font-display text-3xl text-gray-900">{s.value}</p>
                  <p className="mt-1 text-sm text-gray-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Tier cards */}
          <div className="flex flex-col justify-center gap-4 bg-gray-50 px-5 py-12 lg:px-10">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
              Three-tier evaluation
            </p>
            {TIERS.map((tier, i) => (
              <TierCard key={tier.num} tier={tier} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mx-auto mb-14 max-w-xl text-center">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-indigo-500">
              Core capabilities
            </p>
            <h2 className="font-display mb-4 text-4xl tracking-tight text-gray-900">
              Everything you need to evaluate engineering readiness
            </h2>
            <p className="text-base leading-relaxed text-gray-500">
              Built around your company's real architecture, not synthetic puzzles.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {FEATURES.map((f, i) => (
              <FeatureCard key={f.title} feature={f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-5 lg:grid-cols-2">
          {/* Left — steps */}
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-indigo-500">
              How it works
            </p>
            <h2 className="font-display mb-4 text-4xl tracking-tight text-gray-900">
              From docs to assessment in minutes
            </h2>
            <p className="mb-10 text-base leading-relaxed text-gray-500">
              Evalur connects to your existing knowledge base and builds a realistic
              working environment for candidates.
            </p>

            <div className="space-y-0 divide-y divide-gray-100">
              {STEPS.map((step, i) => (
                <div key={i} className="flex gap-5 py-5">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-sm font-medium text-gray-400">
                    {i + 1}
                  </div>
                  <div>
                    <p className="mb-1 text-[15px] font-medium text-gray-900">{step.title}</p>
                    <p className="text-sm leading-relaxed text-gray-500">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — sandbox visual */}
          <SandboxVisual />
        </div>
      </section>

 
      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 px-5 py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-sm font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-gradient-to-br from-indigo-500 to-sky-500">
              <IconSparkles />
            </div>
            Evalur
          </div>

          <div className="flex gap-6">
            {["Features", "Pricing", "Docs", "Blog", "Privacy"].map((l) => (
              <a key={l} href="#" className="text-sm text-gray-400 transition-colors hover:text-gray-700">
                {l}
              </a>
            ))}
          </div>

          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Evalur. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default HomePage