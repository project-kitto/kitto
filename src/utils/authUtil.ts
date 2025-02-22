import AuthController from '@/features/auth/controllers/AuthController';
import { NextResponse } from 'next/server';

export async function checkAuthentication() {
  const response = await AuthController.getInstance().isUserAuthenticated(new NextResponse());
  return response.json();
}
