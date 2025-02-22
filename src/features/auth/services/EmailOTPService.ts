import AuthServiceInterface from '../interfaces/AuthServiceInterface';
import { ResponseCode } from '@/config/strings/response-code';
import { createClient } from '@/config/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export class EmailOTPServices implements AuthServiceInterface {
  public static instance: EmailOTPServices;

  private constructor() { }

  public static getInstance(): EmailOTPServices {
    if (!EmailOTPServices.instance) {
      EmailOTPServices.instance = new EmailOTPServices();
    }
    return EmailOTPServices.instance;
  }

  async signIn(req: NextRequest, res: NextResponse): Promise<NextResponse> {
    const supabase = await createClient();
    const { email } = await req.json();
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        shouldCreateUser: true,
      },
    });

    if (error) {
      console.error('Error signing in with OTP: ', error);

      return NextResponse.json(
        { error: 'Error signing in with OTP' },
        { status: ResponseCode.INTERNAL_SERVER_ERROR }
      );
    }

    return NextResponse.json({ data }, { status: ResponseCode.SUCCESS });
  }

  async verifyOTP(req: NextRequest, res: NextResponse) {
    const supabase = await createClient();
    const { email, otp } = await req.json();
    const {
      data: { session },
      error,
    } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    });

    if (error) {
      console.error('Error verifying OTP: ', error);
      return NextResponse.json(
        { error: 'Error verifying OTP' },
        { status: ResponseCode.INTERNAL_SERVER_ERROR }
      );
    }

    return NextResponse.json({ session }, { status: ResponseCode.SUCCESS });
  }

  async signUp(_req: NextRequest, _res: NextResponse) {
    return NextResponse.json(
      { error: 'Not implemented' },
      { status: ResponseCode.NOT_IMPLEMENTED }
    );
  }

  async signOut(_res: NextResponse) {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return NextResponse.json(
      { message: 'Signed out successfully' },
      { status: ResponseCode.SUCCESS }
    );
  }

  async isUserAuthenticated(res: NextResponse) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: ResponseCode.UNAUTHORIZED }
      );
    }

    return NextResponse.json(
      { message: 'User is authenticated', user },
      { status: ResponseCode.SUCCESS }
    );
  }
}
