'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../login-form.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/verify-code?email=${email}`);
      } else {
        setError(data.message || 'Failed to send code');
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
        <h2 className="text-2xl font-bold text-center mb-6 text-black">Reset Password</h2>
        <p className="p text-center mb-4">Enter your email and we'll send you a verification code</p>
        
        {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}
        
        <div className="flex-column">
          <label>Email</label>
        </div>
        <div className="inputForm">
          <svg height="20" viewBox="0 0 32 32" width="20" xmlns="http://www.w3.org/2000/svg">
            <g id="Layer_3" data-name="Layer 3">
              <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z"></path>
            </g>
          </svg>
          <input 
            type="email" 
            className="input" 
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            suppressHydrationWarning
          />
        </div>
        
        <button className="button-submit" type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Verification Code'}
        </button>
        
        <p className="p">Remember your password? <a href="/login" className="span">Sign In</a></p>
      </form>
    </div>
  )
}