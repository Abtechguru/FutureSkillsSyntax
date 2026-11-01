import React from 'react'
import { Link } from 'react-router-dom'

const Footer: React.FC = () => (
  <footer className="border-t border-gray-200 bg-white py-12 dark:border-gray-700 dark:bg-gray-950">
    <div className="container-custom grid gap-10 md:grid-cols-3">
      <div>
        <Link to="/" className="text-xl font-bold text-gray-950 dark:text-white">Future Syntax</Link>
        <p className="mt-3 max-w-xs text-sm leading-7 text-gray-600 dark:text-gray-300">
          Community-based mentorship, digital literacy, coding and life skills for boys aged 10–15.
        </p>
      </div>
      <div>
        <h2 className="font-semibold text-gray-950 dark:text-white">Explore</h2>
        <div className="mt-4 flex flex-col gap-3 text-sm text-gray-600 dark:text-gray-300">
          <Link to="/" className="hover:underline">Home</Link>
          <a href="/#programme" className="hover:underline">What we teach</a>
          <a href="/#approach" className="hover:underline">Our approach</a>
        </div>
      </div>
      <div>
        <h2 className="font-semibold text-gray-950 dark:text-white">Get involved</h2>
        <div className="mt-4 flex flex-col gap-3 text-sm text-gray-600 dark:text-gray-300">
          <Link to="/register" className="hover:underline">Guardian / adult registration</Link>
          <Link to="/login" className="hover:underline">Sign in</Link>
        </div>
        <p className="mt-5 text-xs leading-6 text-gray-500 dark:text-gray-400">
          Learner enrolment and mentor approval require safeguarding checks and authorised programme review.
        </p>
      </div>
    </div>
    <div className="container-custom mt-10 border-t border-gray-200 pt-6 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
      © {new Date().getFullYear()} Future Syntax. Community-first learning.
    </div>
  </footer>
)

export default Footer
