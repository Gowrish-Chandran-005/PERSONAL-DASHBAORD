import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { user, profile, signIn, signUp, signOut, loading, authError } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);

    try {
      if (isSignUp) {
        const { error, unconfirmed } = await signUp(email, password, displayName);
        if (error) {
          setMessage(error.message);
        } else if (unconfirmed) {
          setMessage('Account created! Please check your email to confirm your account before signing in.');
        } else {
          setMessage('Account created and signed in successfully!');
          setTimeout(() => onClose(), 1200);
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setMessage(error.message);
        } else {
          setMessage('Signed in successfully!');
          setTimeout(() => onClose(), 800);
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    setSubmitting(true);
    try {
      await signOut();
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 bg-[#fbfbfa] rounded-3xl border border-black/10 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-[#77777b] hover:text-[#151618] hover:bg-black/5 transition-colors cursor-pointer"
          title="Close modal"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {user ? (
          /* Authenticated User Card */
          <div className="flex flex-col gap-5 pt-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#151618] text-white flex items-center justify-center font-outfit font-bold text-lg shadow-sm">
                {(profile?.display_name || user.email || 'G')[0].toUpperCase()}
              </div>
              <div>
                <h3 className="font-outfit font-bold text-lg text-[#151618]">
                  {profile?.display_name || 'GOWRISH OS User'}
                </h3>
                <p className="font-outfit text-xs text-[#52606c]">{user.email}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-black/5 space-y-2 text-xs font-outfit">
              <div className="flex justify-between items-center">
                <span className="text-[#52606c]">Database Role</span>
                <span className="px-2.5 py-0.5 rounded-full font-semibold uppercase text-[10px] bg-[#d5e4f3] text-[#0f1d27]">
                  {profile?.role || 'member'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#52606c]">User ID</span>
                <span className="font-mono text-[11px] text-[#151618] truncate max-w-[180px]" title={user.id}>
                  {user.id}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#52606c]">Timezone</span>
                <span className="text-[#151618]">{profile?.timezone_name || 'UTC'}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSignOut}
                disabled={submitting}
                className="flex-1 py-2.5 rounded-full bg-[#151618] hover:bg-black text-white font-sora font-semibold text-xs transition-colors shadow-sm cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Signing out...' : 'Sign Out'}
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-full bg-[#eeeeec] hover:bg-[#e0e0de] text-[#151618] font-sora font-medium text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          /* Sign In / Sign Up Form */
          <div className="flex flex-col gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d5e4f3] text-[#0f1d27] text-[10px] font-sora font-bold uppercase tracking-wider mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]"></span>
                Supabase Auth
              </div>
              <h2 className="font-outfit font-bold text-2xl text-[#151618]">
                {isSignUp ? 'Create your Account' : 'Sign in to GOWRISH OS'}
              </h2>
              <p className="font-outfit text-xs text-[#52606c] mt-0.5">
                Connect your live Supabase cloud backend to persist your tasks and projects.
              </p>
            </div>

            {/* Mode Switch Tabs */}
            <div className="flex p-1 bg-[#eeeeec] rounded-full">
              <button
                type="button"
                onClick={() => { setIsSignUp(false); setMessage(null); }}
                className={`flex-1 py-1.5 rounded-full font-sora text-xs font-semibold transition-all cursor-pointer ${
                  !isSignUp ? 'bg-[#151618] text-white shadow-xs' : 'text-[#52606c] hover:text-[#151618]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setIsSignUp(true); setMessage(null); }}
                className={`flex-1 py-1.5 rounded-full font-sora text-xs font-semibold transition-all cursor-pointer ${
                  isSignUp ? 'bg-[#151618] text-white shadow-xs' : 'text-[#52606c] hover:text-[#151618]'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Error or Notice Message */}
            {(message || authError) && (
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-outfit">
                {message || authError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {isSignUp && (
                <div>
                  <label className="block text-[11px] font-sora font-semibold text-[#52606c] mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Gowrish Chandran"
                    className="w-full px-4 py-2.5 text-xs font-outfit bg-white rounded-2xl border border-black/10 focus:ring-2 focus:ring-[#C9D8E6] outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-sora font-semibold text-[#52606c] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="gowrish@example.com"
                  className="w-full px-4 py-2.5 text-xs font-outfit bg-white rounded-2xl border border-black/10 focus:ring-2 focus:ring-[#C9D8E6] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-sora font-semibold text-[#52606c] mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 text-xs font-outfit bg-white rounded-2xl border border-black/10 focus:ring-2 focus:ring-[#C9D8E6] outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || loading}
                className="mt-2 w-full py-3 rounded-full bg-[#151618] hover:bg-black text-white font-sora font-semibold text-xs transition-colors shadow-sm cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-[11px] font-outfit text-[#77777b]">
              Your session is authenticated via Supabase Row Level Security.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
