import { NextRequest, NextResponse } from 'next/server';
import { cnpjController } from '@/controllers/cnpj.controller';

export async function GET(request: NextRequest) {
  const response = await cnpjController.getStats(request);
  
  const status = response.success ? 200 : 401;

  return NextResponse.json(response, { status });
}
