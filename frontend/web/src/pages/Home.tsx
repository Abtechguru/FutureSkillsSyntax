import React from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Code2,
  Heart,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'

/**
 * Editorial imagery licensed via Pexels.
 * These are illustrative stock images, never photos or testimonials of programme participants.
 * Keep stable photo IDs and explicit dimensions so responsive crops can be managed consistently.
 */
const images = {
  hero: 'https://images.pexels.com/photos/10638075/pexels-photo-10638075.jpeg?auto=compress&cs=tinysrgb&w=1600',
  heroInset: 'https://images.pexels.com/photos/14554004/pexels-photo-14554004.jpeg?auto=compress&cs=tinysrgb&w=680',
  digital: 'https://images.pexels.com/photos/5621933/pexels-photo-5621933.jpeg?auto=compress&cs=tinysrgb&w=1050',
  coding: 'https://images.pexels.com/photos/10638065/pexels-photo-10638065.jpeg?auto=compress&cs=tinysrgb&w=1050',
  character: 'https://images.pexels.com/photos/28593054/pexels-photo-28593054.jpeg?auto=compress&cs=tinysrgb&w=1050',
  story: 'https://images.pexels.com/photos/28593054/pexels-photo-28593054.jpeg?auto=compress&cs=tinysrgb&w=1200',
  closing: 'https://images.pexels.com/photos/7742822/pexels-photo-7742822.jpeg?auto=compress&cs=tinysrgb&w=1800',
}

const learningTracks = [
  {
    number: '01',
    eyebrow: 'Discover',
    title: 'Digital confidence.',
    description: 'Learn the essentials of computers, online safety and navigating a digital world.',
    image: images.digital,
    alt: 'Young people learning to use computers in a classroom',
    icon: BookOpen,
    tone: 'bg-[#e8f1ee]',
    badge: 'Digital literacy',
  },
  {
    number: '02',
    eyebrow: 'Create',
    title: 'Make something real.',
    description: 'Turn curious ideas into first coding projects, with guidance at every step.',
    image: images.coding,
    alt: 'Students working with computers during a learning activity',
    icon: Code2,
    tone: 'bg-[#ebeafc]',
    badge: 'Coding & creativity',
  },
  {
    number: '03',
    eyebrow: 'Become',
    title: 'Grow from within.',
    description: 'Build resilience, responsibility and the confidence to make better choices.',
    image: images.character,
    alt: 'Children taking part in a classroom learning activity',
    icon: Lightbulb,
    tone: 'bg-[#fcebdc]',
    badge: 'Life & character',
  },
]

const steps = [
  {
    number: '01',
    icon: Users,
    title: 'A place to belong',
    description: 'Welcoming, age-appropriate small-group learning.',
  },
  {
    number: '02',
    icon: Heart,
    title: 'People who show up',
    description: 'Positive role models and supervised guidance.',
  },
  {
    number: '03',
    icon: Sparkles,
    title: 'Room to become',
    description: 'New skills, projects and everyday confidence.',
  },
]

const Home: React.FC = () => (
  <div className="overflow-hidden bg-[#faf9f6] text-[#162433] dark:bg-[#0d1520] dark:text-white">
    {/* Hero: editorial text on the left; photography tells the rest of the story. */}
    <section className="relative isolate pb-20 pt-10 sm:pt-16 lg:pb-28 lg:pt-20" aria-labelledby="home-title">
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-[#e6eafa] opacity-80 blur-3xl dark:bg-indigo-950/50" />
      <div className="container-custom relative">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)] lg:gap-10 xl:gap-20">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#d7dfd7] bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#3c675b] shadow-sm sm:px-4 sm:text-xs dark:border-emerald-800/60 dark:bg-[#152a2b] dark:text-emerald-200">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#45a58b]" aria-hidden="true" />
              Future Syntax · MCN 2026
            </div>
            <h1 id="home-title" className="mt-7 max-w-[740px] text-[clamp(2.75rem,5.8vw,5.7rem)] font-extrabold leading-[1.055] tracking-[-0.055em] text-[#142436] dark:text-white">
              Every boy
              <span className="block">deserves a</span>
              <span className="relative inline-block text-[#4e56ca] dark:text-indigo-300">
                brighter future.
                <svg className="absolute -bottom-3 left-0 h-4 w-full text-[#f7b96a]" viewBox="0 0 280 16" fill="none" aria-hidden="true" preserveAspectRatio="none">
                  <path d="M3 12C61 3 120 4 157 7C199 9 239 6 277 3" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="mt-9 max-w-[530px] text-base leading-[1.85] text-[#53616d] sm:text-lg dark:text-slate-300">
              Real guidance. Practical tech skills. A community that believes in boys aged 10–15.
            </p>
            <div className="mt-9 flex flex-col items-stretch gap-3 min-[420px]:flex-row min-[420px]:items-center">
              <a href="#programme" className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-[#4e56ca] px-6 py-4 text-sm font-bold text-white shadow-[0_16px_32px_-17px_rgba(78,86,202,0.85)] transition hover:-translate-y-0.5 hover:bg-[#3c46b8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4e56ca]">
                Explore the programme
                <ArrowUpRight aria-hidden="true" className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a href="#story" className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-[#d9dddf] bg-white px-6 py-4 text-sm font-bold text-[#223343] transition hover:border-[#4e56ca] hover:text-[#4e56ca] dark:border-slate-700 dark:bg-[#1a2635] dark:text-white">
                Our story <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </a>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm font-medium text-[#63707a] dark:text-slate-300">
              <span className="inline-flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e8ece9] text-[#4f796a] dark:bg-emerald-950 dark:text-emerald-300">
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                </span>
                Safeguarding-first by design
              </span>
              <span className="inline-flex items-center gap-2 text-[#4e56ca] dark:text-indigo-300">
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
                Meet the mission
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[720px] pb-8 pl-2 pr-0 pt-4 sm:pl-8 lg:pb-12 lg:pt-2">
            <div aria-hidden="true" className="absolute right-0 top-0 h-[85%] w-[81%] rounded-[3rem] bg-[#e6e8ff] dark:bg-[#282b5b]" />
            <div className="relative ml-4 aspect-[4/4.35] overflow-hidden rounded-[2rem] bg-[#d5e1e6] shadow-[0_30px_90px_-38px_rgba(22,36,51,0.45)] sm:ml-6 sm:aspect-[4/3.85] sm:rounded-[2.75rem]">
              <img
                src={images.hero}
                alt="Students engaging in a computer-learning activity"
                width="1100"
                height="825"
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-cover object-center"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#12253b]/75 via-transparent to-transparent" />
              <div className="absolute bottom-7 left-7 right-7 sm:bottom-9 sm:left-9">
                <span className="inline-flex rounded-full border border-white/40 bg-white/20 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-lg">
                  Learn • Build • Belong
                </span>
                <p className="mt-3 max-w-[280px] text-xl font-bold leading-snug text-white sm:text-2xl">
                  Possibility looks good on the next generation.
                </p>
              </div>
            </div>
            <div className="absolute -bottom-2 -left-2 hidden w-[39%] rotate-[-5deg] overflow-hidden rounded-[1.75rem] border-[7px] border-[#faf9f6] bg-white shadow-[0_20px_45px_-20px_rgba(22,36,51,0.5)] sm:block dark:border-[#0d1520]">
              <img src={images.heroInset} alt="Young students learning together in a classroom" width="360" height="270" loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover" />
            </div>
            <div className="absolute right-0 top-0 flex h-[90px] w-[90px] rotate-12 items-center justify-center rounded-[1.8rem] bg-[#f5b864] text-[#253141] shadow-lg sm:-right-4 sm:top-1 sm:h-[118px] sm:w-[118px] sm:rounded-[2.1rem]">
              <span className="text-center text-xs font-extrabold uppercase leading-5 tracking-[0.08em] sm:text-sm">Small<br />steps.<br />Big<br />futures.</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* A visual break from text, without inventing participant statistics. */}
    <section aria-label="Our guiding principles" className="border-y border-[#e5e8e6] bg-white py-6 dark:border-slate-800 dark:bg-[#162231]">
      <div className="container-custom grid gap-4 text-center sm:grid-cols-3 sm:gap-0">
        {[
          { icon: Heart, label: 'Mentorship that matters' },
          { icon: Code2, label: 'Skills for a digital future' },
          { icon: Users, label: 'A place to belong' },
        ].map((item, index) => (
          <div key={item.label} className={'flex items-center justify-center gap-3 py-2 text-sm font-bold text-[#344653] dark:text-slate-200 ' + (index > 0 ? 'sm:border-l sm:border-[#e5e8e6] dark:sm:border-slate-700' : '')}>
            <item.icon className="h-5 w-5 text-[#4e56ca] dark:text-indigo-300" aria-hidden="true" />
            {item.label}
          </div>
        ))}
      </div>
    </section>

    {/* Image-led learning tracks instead of text-heavy feature blocks. */}
    <section id="programme" aria-labelledby="programme-heading" className="scroll-mt-24 py-20 sm:py-24 lg:py-28">
      <div className="container-custom">
        <div className="flex flex-col items-start justify-between gap-7 lg:flex-row lg:items-end">
          <div>
            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-[#4e56ca] dark:text-indigo-300">
              <span className="h-px w-9 bg-current" aria-hidden="true" />
              Our learning pillars
            </div>
            <h2 id="programme-heading" className="mt-5 max-w-3xl text-[clamp(2.2rem,4.5vw,4.1rem)] font-extrabold leading-[1.12] tracking-[-0.045em] text-[#142436] dark:text-white">
              More than lessons.<br />
              <span className="text-[#737e87] dark:text-slate-400">Skills for life.</span>
            </h2>
          </div>
          <p className="max-w-sm text-base leading-7 text-[#64717b] dark:text-slate-300">
            Three connected ways to help young minds explore who they can become.
          </p>
        </div>
        <div className="mt-11 grid gap-6 md:grid-cols-3">
          {learningTracks.map((track) => (
            <article key={track.number} className="group overflow-hidden rounded-[2rem] border border-[#e6e8e5] bg-white shadow-[0_14px_40px_-32px_rgba(20,36,54,0.4)] transition-all duration-300 motion-safe:hover:-translate-y-2 motion-safe:hover:shadow-[0_25px_55px_-33px_rgba(20,36,54,0.38)] dark:border-slate-800 dark:bg-[#172537]">
              <div className={'relative overflow-hidden ' + track.tone}>
                <img
                  src={track.image}
                  alt={track.alt}
                  width="720"
                  height="500"
                  loading="lazy"
                  decoding="async"
                  className="aspect-[1.38] w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-105"
                />
                <span className="absolute left-5 top-5 rounded-full bg-white/95 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#263646] shadow-sm">
                  {track.badge}
                </span>
              </div>
              <div className="p-6 sm:p-7">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#8a96a1]">{track.eyebrow} / {track.number}</span>
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f0f1ff] text-[#4e56ca] dark:bg-indigo-950 dark:text-indigo-200">
                    <track.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>
                <h3 className="mt-3 text-2xl font-extrabold leading-[1.2] tracking-tight text-[#1b2d3b] dark:text-white">{track.title}</h3>
                <p className="mt-3 max-w-[330px] text-sm leading-7 text-[#64717b] sm:text-base dark:text-slate-300">{track.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>

    {/* Founder story, anchored in purpose rather than invented impact data. */}
    <section id="story" aria-labelledby="story-heading" className="scroll-mt-20 bg-[#142536] py-20 text-white sm:py-24 lg:py-28">
      <div className="container-custom grid items-center gap-12 lg:grid-cols-2 lg:gap-24">
        <div className="relative">
          <div className="absolute -left-4 -top-4 h-32 w-32 rounded-[2.25rem] bg-[#f5b864] sm:-left-7 sm:-top-7" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-[2rem] bg-[#395060] sm:rounded-[2.8rem]">
            <img src={images.story} alt="Young African students sharing a classroom learning experience" loading="lazy" decoding="async" width="900" height="740" className="aspect-[5/4.65] w-full object-cover" />
          </div>
          <div className="absolute -bottom-7 right-0 max-w-[240px] rounded-[1.75rem] bg-[#f5b864] p-5 text-[#1a2d3b] shadow-xl sm:-right-5 sm:max-w-[290px] sm:p-7">
            <span className="text-[11px] font-bold uppercase tracking-[0.15em]">Our belief</span>
            <p className="mt-2 text-lg font-extrabold leading-snug sm:text-2xl">Every story can take a different turn.</p>
          </div>
        </div>
        <div className="pt-6 lg:pt-0">
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-[#f5c57a]">
            <span className="h-px w-9 bg-current" aria-hidden="true" />
            The heart behind Future Syntax
          </div>
          <h2 id="story-heading" className="mt-6 text-[clamp(2.4rem,4.3vw,4.4rem)] font-extrabold leading-[1.12] tracking-[-0.045em]">
            Sometimes, one person <span className="text-[#f5bd72]">changes everything.</span>
          </h2>
          <p className="mt-7 max-w-[540px] text-base leading-[1.9] text-[#ccdae5] sm:text-lg">
            Born from a personal experience of growing up without consistent fatherly guidance, Future Syntax is about making encouragement and opportunity easier to find.
          </p>
          <p className="mt-5 max-w-[540px] text-base leading-[1.9] text-[#ccdae5]">
            We believe practical skills and positive role models can help boys imagine more for themselves—and take their first steps toward it.
          </p>
          <a href="#approach" className="mt-8 inline-flex items-center gap-3 border-b border-[#f5bd72] pb-2 text-sm font-bold text-[#f5c57a] transition hover:gap-5">
            See our approach <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>

    {/* Three simple stages; avoids a wall of operational promises. */}
    <section id="approach" aria-labelledby="approach-heading" className="scroll-mt-24 py-20 sm:py-24 lg:py-28">
      <div className="container-custom">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#4e56ca] dark:text-indigo-300">The Future Syntax approach</p>
          <h2 id="approach-heading" className="mt-4 text-[clamp(2.1rem,4vw,3.9rem)] font-extrabold leading-tight tracking-[-0.045em] text-[#142436] dark:text-white">
            A little guidance.<br />A lot of possibility.
          </h2>
        </div>
        <div className="relative mt-12 grid gap-5 lg:grid-cols-3 lg:gap-6">
          <div aria-hidden="true" className="absolute left-[14%] right-[14%] top-12 hidden border-t-2 border-dashed border-[#d8dcf2] lg:block" />
          {steps.map((step) => (
            <article key={step.number} className="relative rounded-[1.85rem] border border-[#e8e9e8] bg-white p-7 sm:p-9 dark:border-slate-800 dark:bg-[#172537]">
              <div className="relative flex items-center justify-between">
                <div className="flex h-16 w-16 items-center justify-center rounded-[1.35rem] bg-[#eceeff] text-[#4e56ca] dark:bg-indigo-950 dark:text-indigo-300">
                  <step.icon className="h-7 w-7" aria-hidden="true" />
                </div>
                <span className="text-2xl font-extrabold tracking-tight text-[#d6dae6] dark:text-slate-600">{step.number}</span>
              </div>
              <h3 className="mt-9 text-xl font-extrabold tracking-tight text-[#142436] dark:text-white sm:text-2xl">{step.title}</h3>
              <p className="mt-3 max-w-[300px] text-base leading-7 text-[#65717b] dark:text-slate-300">{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section id="safeguarding" aria-label="Safeguarding commitment" className="pb-20 sm:pb-24">
      <div className="container-custom">
        <div className="flex flex-col items-start gap-5 rounded-[2rem] border border-[#dce7db] bg-[#eff6ef] px-6 py-8 sm:flex-row sm:items-center sm:px-10 dark:border-emerald-900 dark:bg-[#182b29]">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-[#477c67] dark:bg-[#234038] dark:text-emerald-200">
            <ShieldCheck className="h-7 w-7" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-[#193d31] dark:text-emerald-100">A safe space is the starting point.</h2>
            <p className="mt-2 max-w-4xl text-sm leading-7 text-[#4f6c61] sm:text-base dark:text-emerald-100/80">
              Child enrolment and mentoring will open only after guardian consent, mentor screening and supervised interaction processes have been verified.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Final image-led invitation, with clear non-enrolment messaging. */}
    <section id="join" aria-labelledby="join-heading" className="relative isolate overflow-hidden bg-[#172938] py-24 text-white sm:py-32">
      <img src={images.closing} alt="Learners using computers together with an adult present" loading="lazy" decoding="async" width="1600" height="1050" className="absolute inset-0 -z-20 h-full w-full object-cover object-center" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-[#11263b]/95 via-[#11263b]/85 to-[#11263b]/55" />
      <div className="container-custom">
        <div className="max-w-[770px]">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-[#f5bd72]" aria-hidden="true" />
            Be part of the mission
          </span>
          <h2 id="join-heading" className="mt-7 text-[clamp(2.35rem,4.8vw,4.8rem)] font-extrabold leading-[1.1] tracking-[-0.045em]">
            The future is built with <span className="text-[#f5bd72]">people who care.</span>
          </h2>
          <p className="mt-6 max-w-xl text-base leading-[1.8] text-[#d9e5ee] sm:text-lg">
            Discover our programme, share the vision and help make meaningful guidance possible for more boys.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#programme" className="inline-flex min-h-14 items-center gap-3 rounded-2xl bg-[#f5bd72] px-6 py-4 text-sm font-extrabold text-[#182b3c] transition hover:bg-[#ffd294]">
              Discover Future Syntax <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
            </a>
            <Link to="/register" className="inline-flex min-h-14 items-center gap-3 rounded-2xl border border-white/50 bg-white/10 px-6 py-4 text-sm font-bold text-white transition hover:bg-white/20">
              Adult account <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <p className="mt-5 text-sm leading-6 text-[#d7e3ea]">An adult account is not child enrolment. Programme participation requires safeguarding approval.</p>
        </div>
      </div>
    </section>

    <div className="bg-[#faf9f6] px-5 py-4 text-center text-xs leading-6 text-[#78838b] dark:bg-[#0d1520] dark:text-slate-400">
      Photographs are illustrative stock imagery and do not depict Future Syntax programme participants.
    </div>
  </div>
)

export default Home
