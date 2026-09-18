import { NextResponse } from 'next/server';
import { getReviews } from '@/lib/judgeme/getReviews';

export async function GET() {
  const reviews = await getReviews();
  return NextResponse.json({ reviews });
}
