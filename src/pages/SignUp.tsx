import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Lock, Mail, User, ShieldCheck } from 'lucide-react';
import { Button } from '../components/Button';

export const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = signup(name, email, password);
    if (!res.success) {
      setError(res.error || 'Failed to create account');
      return;
    }

    navigate('/upload');
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto select-none pt-4 pb-12">
      <div className="w-full p-8 rounded-3xl bg-[#FFF8ED] border border-[#6B315E]/20 shadow-[0_20px_50px_rgba(36,22,47,0.1)]">
        {/* Brand Icon */}
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6B315E] to-[#24162F] text-[#FFF8ED] flex items-center justify-center shadow-md mb-6 mx-auto">
          <Sparkles className="w-6 h-6 text-[#A8D5C2]" />
        </div>

        <h1 className="font-heading font-black text-2xl text-[#24162F] text-center mb-1">
          Create Your Account
        </h1>
        <p className="text-xs text-[#6F6670] text-center mb-6">
          Start cleaning enterprise documents with military-grade precision
        </p>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#2C2830] mb-1.5 font-mono">
              FULL NAME
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#978D91] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Vaishnavi"
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-white border border-[#EADCC8] focus:border-[#6B315E] focus:outline-hidden text-xs text-[#2C2830] font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2C2830] mb-1.5 font-mono">
              WORK EMAIL
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#978D91] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-white border border-[#EADCC8] focus:border-[#6B315E] focus:outline-hidden text-xs text-[#2C2830] font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2C2830] mb-1.5 font-mono">
              PASSWORD
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#978D91] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-white border border-[#EADCC8] focus:border-[#6B315E] focus:outline-hidden text-xs text-[#2C2830] font-sans"
              />
            </div>
          </div>

          <Button type="submit" size="md" className="w-full mt-2 font-extrabold">
            Register &amp; Proceed
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-[#EADCC8] text-center">
          <p className="text-xs text-[#6F6670]">
            Already have an account?{' '}
            <Link to="/signin" className="text-[#6B315E] font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
