import { NextRequest, NextResponse } from 'next/server';

export default interface AuthServiceInterface {
  signIn: (req: NextRequest, res: NextResponse) => Promise<NextResponse>;
  signOut: (res: NextResponse) => Promise<NextResponse>;
  signUp: (req: NextRequest, res: NextResponse) => Promise<NextResponse>;
  verifyOTP: (req: NextRequest, res: NextResponse) => Promise<NextResponse>;
  isUserAuthenticated: (res: NextResponse) => Promise<NextResponse>;
}
