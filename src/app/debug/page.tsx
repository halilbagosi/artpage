'use client';

import { useState } from 'react';

export default function DebugPage() {
  const [count, setCount] = useState(0);
  
  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Debug Page</h1>
      <p>If you can see this and click the button, JavaScript is working.</p>
      <button 
        onClick={() => setCount(c => c + 1)}
        style={{ padding: '10px 20px', fontSize: '16px', marginTop: '10px' }}
      >
        Clicked {count} times
      </button>
      <div style={{ marginTop: '20px' }}>
        <p>Window hostname: {typeof window !== 'undefined' ? window.location.hostname : 'SSR'}</p>
        <p>User Agent: {typeof navigator !== 'undefined' ? navigator.userAgent : 'SSR'}</p>
      </div>
    </div>
  );
}
