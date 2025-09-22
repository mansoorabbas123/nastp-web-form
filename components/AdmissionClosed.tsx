import React from "react";

interface AdmissionClosedProps {
  /** Optional date string when admissions reopen */
  reopenDate?: string;
  /** Optional email address for notify button */
  notifyEmail?: string;
}

export default function AdmissionClosed({ reopenDate, notifyEmail }: AdmissionClosedProps) {
  const mailto = notifyEmail ? `mailto:${notifyEmail}?subject=Notify%20me%20when%20admissions%20open` : undefined;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <section className="max-w-2xl w-full bg-white rounded-xl border border-gray-200 p-8 sm:p-12 text-center shadow-sm">
        {/* Header */}
        <div className="mx-auto w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10 text-[#00308F]"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11V5a1 1 0 10-2 0v2a1 1 0 002 0zm0 4a1 1 0 10-2 0v3a1 1 0 002 0v-3z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Admissions Closed</h1>
        <p className="mt-3 text-gray-600 text-base">
          Thank you for your interest. Admissions are currently closed.
        </p>

        {/* Message about reopening date */}
        {reopenDate ? (
          <div className="mt-6">
            <span className="block text-sm text-gray-500 mb-1">Estimated reopening date:</span>
            <div className="inline-flex items-center rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700">
              {new Date(reopenDate).toLocaleDateString()}
            </div>
          </div>
        ) : null}

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="https://niest.nivt.edu.pk/"
            className="inline-flex items-center justify-center px-5 py-2 rounded-md bg-[#00308F] text-white text-sm font-medium hover:bg-[#003aad] focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Explore Courses
          </a>

          {/* {mailto ? (
            <a
              href={mailto}
              className="inline-flex items-center justify-center px-5 py-2 rounded-md border border-indigo-600 bg-white text-indigo-600 text-sm font-medium hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Notify Me
            </a>
          ) : (
            <button
              type="button"
              onClick={() => alert("We'll notify you when admissions reopen.")}
              className="inline-flex items-center justify-center px-5 py-2 rounded-md border border-indigo-600 bg-white text-indigo-600 text-sm font-medium hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Notify Me
            </button>
          )} */}
        </div>

        <p className="mt-6 text-xs text-gray-400">
          For urgent questions, please <a href="mailto:mgr.sep.khrn@nastp.gov.pk" className="underline">contact admissions</a>.
        </p>
      </section>
    </main>
  );
}