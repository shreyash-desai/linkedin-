import { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Loader2, Sparkles, Mail, Lock, User as UserIcon } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function Auth() {
  const { isAuthenticated } = useAuthStore();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  // If already logged in, redirect to app
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        if (error) throw error;
        // The trigger we created in DB will automatically create the profile row
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-[36px] shadow-large p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <Sparkles className="w-24 h-24 text-text-main" />
        </div>
        
        <div className="relative z-10">
          <div className="w-12 h-12 rounded-xl bg-text-main flex items-center justify-center text-white font-bold text-2xl mb-8">
            P
          </div>
          
          <h1 className="text-3xl font-bold text-text-main mb-2">
            {isSignUp ? 'Create an account' : 'Welcome back'}
          </h1>
          <p className="text-text-secondary mb-8">
            {isSignUp ? 'Start writing better LinkedIn posts today.' : 'Sign in to access your Postly workspace.'}
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div>
                <label className="text-sm font-semibold text-text-main mb-1.5 block">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={isSignUp}
                    placeholder="Shreyash Desai"
                    className="w-full bg-cream-light border border-border-subtle rounded-2xl py-3 pl-12 pr-4 text-text-main placeholder:text-text-muted focus:ring-4 focus:ring-pastel-blue/30 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-semibold text-text-main mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full bg-cream-light border border-border-subtle rounded-2xl py-3 pl-12 pr-4 text-text-main placeholder:text-text-muted focus:ring-4 focus:ring-pastel-blue/30 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-text-main mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-cream-light border border-border-subtle rounded-2xl py-3 pl-12 pr-4 text-text-main placeholder:text-text-muted focus:ring-4 focus:ring-pastel-blue/30 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-text-main text-white py-4 rounded-full font-semibold text-lg hover:bg-black hover:scale-[1.01] active:scale-[0.99] transition-all shadow-soft flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:hover:scale-100"
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              {isSignUp ? 'Sign up' : 'Sign in'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              className="text-text-secondary font-medium hover:text-text-main transition-colors text-sm"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
