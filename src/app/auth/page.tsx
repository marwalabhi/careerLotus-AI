'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { supabase } from '@/utils/supabase/client';
import Image from 'next/image';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === 'signin') {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
      } else {
        const { error: err } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (err) throw err;
      }
      router.push('/');
    } catch (err: unknown) {
      if (err instanceof Error) setError(err?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const continueAsGuest = () => {
    try {
      localStorage.setItem('careerlotus_guest', '1');
    } catch {}
    router.push('/');
  };

  return (
    <div className="from-background to-background/95 flex min-h-screen items-center justify-center bg-gradient-to-b p-4 font-sans">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="from-primary/5 to-accent/5 relative overflow-hidden bg-gradient-to-br p-8 md:p-10">
          <div className="relative z-10">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-20 w-20 items-center justify-center rounded-xl border-2 border-pink-300 shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(236,72,153,0.5)]">
                <span className="text-xl">
                  <div className="flex justify-center">
                    <Image
                      alt="careerlotus_logo"
                      src="/logo1.png"
                      className="rounded-2xl object-cover"
                    />
                  </div>
                </span>
              </div>
              <div>
                <h1 className="text-foreground font-heading text-lg font-semibold">Career Lotus</h1>
                <p className="text-muted-foreground text-sm">AI Career Counselor</p>
              </div>
            </div>

            <h2 className="mb-2 font-sans text-2xl font-bold">Welcome to CareerLotus AI</h2>

            <p className="text-muted-foreground">
              Personalized guidance for your next career move.
            </p>
            <div className="relative mt-6">
              <div className="absolute top-4 -right-4 h-20 w-20 rounded-full bg-pink-500/5"></div>
              <div className="absolute top-8 -right-2 h-12 w-12 rounded-full bg-purple-500/5"></div>
            </div>
            <ul className="text-muted-foreground/90 mt-6 space-y-2 text-sm">
              <li className="text-sm font-semibold">
                <span className="text-lg text-pink-500">Discover</span> new career opportunities
                tailored for you
              </li>
              <div className="mt-4 flex justify-start">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-pink-500/30 blur-lg"></div>
                  <div className="relative h-[2px] w-32 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500"></div>
                </div>
              </div>
              <li className="text-sm font-semibold">
                <span className="text-lg text-blue-400">Grow</span> your skills with expert-guided
                plans
              </li>
              <div className="mt-4 flex justify-start">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-pink-500/30 blur-lg"></div>
                  <div className="relative h-[2px] w-32 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500"></div>
                </div>
              </div>
              <li className="text-sm font-semibold">
                <span className="text-lg text-green-400">Achieve</span> your goals by saving your
                progress easily
              </li>
              <div className="mt-4 flex justify-start">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-pink-500/30 blur-lg"></div>
                  <div className="relative h-[2px] w-32 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500"></div>
                </div>
              </div>
            </ul>
          </div>
        </Card>

        <Card className="p-6 md:p-8">
          <div className="bg-muted mb-6 inline-flex rounded-lg p-1">
            <button
              onClick={() => setMode('signin')}
              className={`cursor-pointer rounded-md px-4 py-2 text-sm font-medium ${
                mode === 'signin' ? 'bg-background text-foreground shadow' : 'text-muted-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`cursor-pointer rounded-md px-4 py-2 text-sm font-medium ${
                mode === 'signup' ? 'bg-background text-foreground shadow' : 'text-muted-foreground'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="text-muted-foreground mb-1 block text-xs font-medium">
                  Full Name
                </label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Abhishek Marwal"
                  required
                />
              </div>
            )}
            <div>
              <label className="text-muted-foreground mb-1 block text-xs font-medium">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="text-muted-foreground mb-1 block text-xs font-medium">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background text-muted-foreground px-2">or</span>
            </div>
          </div>

          <Button variant="outline" className="w-full cursor-pointer" onClick={continueAsGuest}>
            Continue as Guest
          </Button>
        </Card>
      </div>
    </div>
  );
}
