import { ResponseCode } from '@/config/strings/response-code';
import { NextRequest, NextResponse } from 'next/server';
import { checkAuthentication } from '@/utils/authUtil';

export const POST = async (req: NextRequest) => {
    const { user, error } = await checkAuthentication();

    if (error || !user) {
        return NextResponse.json(
            { error: error || 'User not authenticated' },
            { status: ResponseCode.UNAUTHORIZED }
        );
    }

    return NextResponse.json({ user }, { status: ResponseCode.SUCCESS });
};
