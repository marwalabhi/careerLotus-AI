'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const guest =
        typeof window !== 'undefined' && localStorage.getItem('careerlotus_guest') === '1';
      const { data } = await supabase.auth.getSession();
      if (mounted) {
        if (guest || data.session) setAllowed(true);
        else router.replace('/auth');
      }
    })();
    return () => {
      mounted = false;
    };
  }, [router]);

  if (!allowed) return null;
  return <>{children}</>;
}

export default RequireAuth;
