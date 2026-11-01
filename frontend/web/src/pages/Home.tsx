import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Code2, HeartHandshake, ShieldCheck, Users, Lightbulb } from 'lucide-react'

const tracks = [
  {
    title: 'Digital foundations',
    description: 'Build confidence with computers, responsible internet use and practical digital literacy.',
    icon: BookOpen,
  },
  {
    title: 'Coding and creation',
    description: 'Explore beginner-friendly programming, projects and simple automation through guided practice.',
    icon: Code2,
  },
  {
    title: 'Life skills and character',
    description: 'Practise responsibility, discipline, financial awareness and a growth mindset.',
    icon: Lightbulb,
  },
]

const Home: React.FC = () => {
  return (
    <div className="space-y-20 pb-16">
      <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-16 text-white sm:px-12 lg:py-24">
        <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" aria-hidden="true" />
        <div className="relative max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">Future Syntax · MCN 2026 community project</p>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            Every boy deserves guidance, skills and room to grow.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-200">
            Future Syntax is a community-based initiative for boys aged 10–15 who lack consistent parental guidance.
            We bring mentorship, foundational technology education and life skills together in a supportive learning environment.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link to="/register" className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-slate-950 transition hover:bg-indigo-100">
              Guardian registration <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a href="#programme" className="inline-flex items-center rounded-xl border border-white/50 px-6 py-3 font-semibold text-white transition hover:bg-white/10">
              Explore the programme
            </a>
          </div>
          <p className="mt-5 text-sm text-slate-300">
            Creating an adult account does not enrol a child. Guardian consent and programme approval are required.
          </p>
        </div>
      </section>

      <section id="programme" aria-labelledby="programme-title" className="scroll-mt-24">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-700 dark:text-indigo-300">What we teach</p>
          <h2 id="programme-title" className="mt-3 text-3xl font-bold text-gray-950 dark:text-white sm:text-4xl">Skills for today. Confidence for tomorrow.</h2>
          <p className="mt-4 leading-7 text-gray-600 dark:text-gray-300">
            Our approach connects practical learning with trusted guidance and personal development.
            Sessions are designed to be age-appropriate and facilitated in small groups.
          </p>
        </div>
        <div className="mt-9 grid gap-6 md:grid-cols-3">
          {tracks.map((track) => (
            <article key={track.title} className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <div className="inline-flex rounded-xl bg-indigo-50 p-3 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200">
                <track.icon className="h-7 w-7" aria-hidden="true" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-950 dark:text-white">{track.title}</h3>
              <p className="mt-3 leading-7 text-gray-600 dark:text-gray-300">{track.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="approach" className="grid gap-8 rounded-3xl bg-indigo-50 px-6 py-12 dark:bg-gray-900 sm:px-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <div className="inline-flex rounded-2xl bg-white p-4 text-indigo-700 dark:bg-gray-800 dark:text-indigo-200">
            <HeartHandshake className="h-9 w-9" aria-hidden="true" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-950 dark:text-white">Mentorship means showing up.</h2>
          <p className="mt-5 leading-8 text-gray-700 dark:text-gray-300">
            Future Syntax was shaped by the experience of growing up without consistent fatherly guidance.
            Its purpose is to make encouragement, patient teaching and positive role models more accessible
            to boys facing similar challenges. The goal is sustained support, not a one-day intervention.
          </p>
        </div>
        <div className="space-y-5">
          <div className="flex items-start gap-4 rounded-xl bg-white p-5 dark:bg-gray-800">
            <Users className="mt-1 h-6 w-6 shrink-0 text-indigo-700 dark:text-indigo-200" aria-hidden="true" />
            <div>
              <h3 className="font-semibold text-gray-950 dark:text-white">Community-based cohorts</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">Small-group activities combining conversation, practical exercises and project work.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-xl bg-white p-5 dark:bg-gray-800">
            <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-indigo-700 dark:text-indigo-200" aria-hidden="true" />
            <div>
              <h3 className="font-semibold text-gray-950 dark:text-white">A safeguarding-first programme</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">Before child enrolment begins, guardian consent, mentor screening and supervised interactions must be in place.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-gray-200 bg-white px-6 py-12 text-center dark:border-gray-700 dark:bg-gray-900 sm:px-12">
        <h2 className="text-3xl font-bold text-gray-950 dark:text-white">Help build a stronger next generation.</h2>
        <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600 dark:text-gray-300">
          Parents and guardians can create an adult account to learn about the programme.
          Applications to mentor must be reviewed through a separate safeguarding process.
        </p>
        <Link to="/register" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-indigo-700 px-6 py-3 font-semibold text-white transition hover:bg-indigo-800">
          Create a guardian account <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </section>
    </div>
  )
}

export default Home
