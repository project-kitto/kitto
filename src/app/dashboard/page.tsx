import LogoutButton from './logout-button';
import { createClient } from '@/config/supabase/server';
import { redirect } from 'next/navigation';
import { checkAuthentication } from '@/utils/authUtil';
export default async function HomePage() {
  if ((await checkAuthentication()).user) redirect('/dashboard');

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center space-y-4 p-4 md:p-8">
      <div className="text-2xl font-semibold">Dashboard</div>
      <LogoutButton />
    </div>
  );
}
