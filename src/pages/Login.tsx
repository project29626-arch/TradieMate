import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F4F4F6] px-4 py-12 sm:px-6 lg:px-8 font-body relative overflow-hidden">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-xl border-2 border-graphite border-t-8 border-t-hi-vis z-10">
        <div className="text-center">
          <h2 className="text-5xl font-display uppercase tracking-tight text-graphite">
            Tradie<span className="text-hi-vis">Mate</span>
          </h2>
          <p className="mt-2 text-sm text-concrete font-medium uppercase tracking-widest">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>
        
        {error && (
          <div className="bg-alert-orange/10 text-alert-orange border border-alert-orange/30 p-4 rounded-md text-sm font-bold uppercase tracking-wider">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full rounded-md border-0 bg-gray-50 py-3.5 px-4 text-graphite shadow-sm ring-1 ring-inset ring-steel placeholder:text-concrete focus:bg-white focus:ring-2 focus:ring-inset focus:ring-hi-vis sm:text-sm sm:leading-6 transition-all"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full rounded-md border-0 bg-gray-50 py-3.5 px-4 text-graphite shadow-sm ring-1 ring-inset ring-steel placeholder:text-concrete focus:bg-white focus:ring-2 focus:ring-inset focus:ring-hi-vis sm:text-sm sm:leading-6 transition-all"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-graphite px-3 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-md transition-all hover:bg-concrete hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-graphite disabled:opacity-50"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-steel" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-concrete">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleGoogleSignIn}
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-3.5 text-sm font-bold uppercase tracking-wide text-graphite shadow-sm border-2 border-steel hover:bg-gray-50 hover:border-concrete transition-all focus-visible:ring-transparent"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </button>
          </div>
        </div>

        <div className="text-center mt-4">
          <button
            type="button"
            className="text-sm font-bold uppercase tracking-wider text-concrete hover:text-graphite transition-colors underline decoration-2 underline-offset-4"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 w-full h-32 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjRDZEN0Q5IiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')] opacity-20 border-t-4 border-hi-vis"></div>
    </div>
  );
}
