import SignInForm from '@/components/auth/signin-form';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { checkAuthentication } from '@/utils/authUtil';

export default async function LoginPage() {
  if ((await checkAuthentication()).user) redirect('/dashboard');

  return (
    <div className="relative flex min-h-screen items-center justify-center">
      <Image src="/auth/auth-bg.jpg" fill className="object-cover" alt="Auth background" />

      <div className="relative z-10 rounded shadow">
        <SignInForm />
      </div>
    </div>
  );
}
