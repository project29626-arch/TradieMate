import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 text-center sm:px-6 lg:px-8 font-body">
      <div className="w-full max-w-md space-y-8 z-10">
        <div>
          {/* Logo Placeholder */}
          <div className="mx-auto h-24 w-24 rounded-full bg-graphite flex items-center justify-center shadow-lg border-2 border-hi-vis">
            <svg
              className="h-12 w-12 text-hi-vis"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h1 className="mt-8 text-5xl font-display uppercase tracking-tight sm:text-6xl text-[#0E0E10]">
            Tradie<span className="text-hi-vis">Mate</span>
          </h1>
          <p className="mt-4 text-lg text-concrete font-medium uppercase tracking-widest">
            AI-powered admin for Australian tradies
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4">
          <Link
            to="/login"
            className="w-full rounded-md bg-graphite px-8 py-4 text-lg font-bold text-white shadow-md transition-colors hover:bg-concrete focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-graphite flex items-center justify-center gap-2"
          >
            GET STARTED <span>→</span>
          </Link>
          <p className="text-sm text-concrete font-mono uppercase mt-2">
            Create an account or log in to continue
          </p>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="fixed bottom-0 left-0 w-full h-32 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjRDZEN0Q5IiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')] opacity-20 border-t-4 border-hi-vis"></div>
    </div>
  );
}
