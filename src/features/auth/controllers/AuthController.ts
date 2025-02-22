import AuthServiceInterface from '../interfaces/AuthServiceInterface';
import { EmailOTPServices } from '../services/EmailOTPService';
import { ResponseCode } from '@/config/strings/response-code';
import { NextRequest, NextResponse } from 'next/server';

export default class AuthController {
  private static instance: AuthController;
  private authService: AuthServiceInterface;

  private constructor(authService?: AuthServiceInterface) {
    this.authService = authService || EmailOTPServices.getInstance();
  }

  public static getInstance(): AuthController {
    if (!AuthController.instance) {
      AuthController.instance = new AuthController();
    }
    return AuthController.instance;
  }

  async signIn(req: NextRequest, res: NextResponse) {
    try {
      return await this.authService.signIn(req, res);
    } catch (error: any) {
      console.error('Error signing in with OTP: ', error);
      return NextResponse.json(
        { error: 'Error signing in with OTP' },
        { status: ResponseCode.INTERNAL_SERVER_ERROR }
      );
    }
  }

  async signUp(req: NextRequest, res: NextResponse) {
    try {
      await this.authService.signUp(req, res);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || 'Internal Server Error' },
        { status: ResponseCode.INTERNAL_SERVER_ERROR }
      );
    }
  }

  async signOut(res: NextResponse) {
    try {
      await this.authService.signOut(res);
      return NextResponse.json(
        { message: 'Sign out successful' },
        { status: ResponseCode.SUCCESS }
      );
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || 'Internal Server Error' },
        { status: ResponseCode.INTERNAL_SERVER_ERROR }
      );
    }
  }

  async isUserAuthenticated(res: NextResponse) {
    try {
      return await this.authService.isUserAuthenticated(res);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || 'Internal Server Error' },
        { status: ResponseCode.INTERNAL_SERVER_ERROR }
      );
    }
  }

  public setAuthService(authService: AuthServiceInterface): AuthController {
    this.authService = authService;
    return this;
  }

  public verifyOTP(req: NextRequest, res: NextResponse): any {
    return this.authService.verifyOTP(req, res);
  }
}
