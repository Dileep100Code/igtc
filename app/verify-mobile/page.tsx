'use client';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import '../login-form.css';

export default function VerifyMobile() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const mobile = searchParams.get('mobile');
  const email = searchParams.get('email');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/auth/verify-mobile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, code })
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/verify-email?email=${email}&mobile=${mobile}`);
      } else {
        setError(data.message || 'Invalid code');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <form className="form" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-center mb-6 text-black">Verify Mobile</h2>
        <p className="p text-center mb-4">Enter the mobile verification code sent to your email for {mobile}</p>
        
        {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}
        
        <div className="flex-column">
          <label>Verification Code</label>
        </div>
        <div className="inputForm">
          <svg height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
          </svg>
          <input 
            type="text" 
            className="input" 
            placeholder="Enter 6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            required
            suppressHydrationWarning
          />
        </div>
        
        <button className="button-submit" type="submit" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify Mobile'}
        </button>
        
        <p className="p">Next: <a href={`/verify-email?email=${email}&mobile=${mobile}`} className="span">Verify Email</a></p>
      </form>
    </div>
  )
}