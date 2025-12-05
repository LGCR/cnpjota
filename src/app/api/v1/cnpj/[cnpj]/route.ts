import { NextRequest, NextResponse } from 'next/server';
import { cnpjController } from '@/controllers/cnpj.controller';

export async function GET(
  request: NextRequest,
  { params }: { params: { cnpj: string } }
) {
  const response = await cnpjController.lookup(request);
  
  const status = response.success ? 200 : 
    response.error?.code === 'INSUFFICIENT_CREDITS' ? 402 :
    response.error?.code === 'UnauthorizedError' ? 401 :
    response.error?.code === 'RateLimitError' ? 429 :
    response.error?.code === 'ValidationError' ? 400 :
    500;

  return NextResponse.json(response, { status });
}
