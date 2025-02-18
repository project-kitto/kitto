import { Button } from '@/components/ui/button';
import { createClient } from '@/config/supabase/server';
import { LogIn } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect('/dashboard');

  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-8 sm:items-start">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Link href="/login">
            <Button>
              <LogIn />
              Login
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
