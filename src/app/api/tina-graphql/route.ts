import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy for TinaCMS GraphQL requests.
 * 
 * When accessing the site from a physical device on the local network,
 * the TinaCMS client tries to hit localhost:4001 — which doesn't exist
 * on the phone. This proxy route forwards the request from the Next.js
 * server (which the phone CAN reach) to the TinaCMS GraphQL server
 * running on localhost:4001.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();

    const response = await fetch('http://localhost:4001/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });

    const data = await response.text();

    return new NextResponse(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('[tina-proxy] Failed to proxy GraphQL request:', error);
    return NextResponse.json(
      { errors: [{ message: 'Failed to connect to TinaCMS GraphQL server' }] },
      { status: 502 }
    );
  }
}
