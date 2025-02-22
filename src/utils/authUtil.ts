import AuthController from '@/features/auth/controllers/AuthController';
import { NextResponse } from 'next/server';

export async function checkAuthentication(): Promise<any> {
  const authResponse = await AuthController.getInstance().isUserAuthenticated(new NextResponse());
  return await authResponse.json();
}
