import { ResponseCode } from '@/config/strings/response-code';
import { NextRequest, NextResponse } from 'next/server';
import { checkAuthentication } from '@/utils/authUtil';

export const POST = async (req: NextRequest) => {
    const authData = await checkAuthentication();
    if (authData.error) {
        return NextResponse.json(
            { error: 'User not authenticated' },
            { status: ResponseCode.UNAUTHORIZED }
        );
    }
    return NextResponse.json({ message: 'Authenticated' }, { status: ResponseCode.SUCCESS });
};
