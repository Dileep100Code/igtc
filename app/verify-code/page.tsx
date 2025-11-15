'use client';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import '../login-form.css';

export default function VerifyCode() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/auth/verify-reset-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/reset-password?email=${email}&code=${code}`);
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
        <h2 className="text-2xl font-bold text-center mb-6 text-black">Verify Code</h2>
        <p className="p text-center mb-4">Enter the 6-digit code sent to {email}</p>
        
        {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}
        
        <div className="flex-column">
          <label>Verification Code</label>
        </div>
        <div className="inputForm">
          <svg height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
          </svg>
          <input 
            type="text" 
            className="input" 
            placeholder="Enter 6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            required
          />
        </div>
        
        <button className="button-submit" type="submit" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify Code'}
        </button>
        
        <p className="p">Didn't receive code? <a href={`/forgot-password?email=${email}`} className="span">Resend</a></p>
      </form>
    </div>
  )
}