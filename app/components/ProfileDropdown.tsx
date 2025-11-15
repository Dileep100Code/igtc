"use client";
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
}

export default function ProfileDropdown() {
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  // simplified: dropdown only shows menu and navigates to pages

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  if (!user) {
    return (
      <a href="/login" className="contact-btn">
        <svg className="svgIcon fa-spin" viewBox="0 0 512 512" height="1em" xmlns="http://www.w3.org/2000/svg">
          <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm50.7-186.9L162.4 380.6c-19.4 7.5-38.5-11.6-31-31l55.5-144.3c3.3-8.5 9.9-15.1 18.4-18.4l144.3-55.5c19.4-7.5 38.5 11.6 31 31L325.1 306.7c-3.2 8.5-9.9 15.1-18.4 18.4zM288 256a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"></path>
        </svg>
        LOGIN
      </a>
    );
  }

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        aria-label="User menu"
        className="w-10 h-10 rounded-full bg-transparent flex items-center justify-center border border-transparent hover:border-orange-400/40 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-black font-bold">
          {user.name.charAt(0).toUpperCase()}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-black/70 border border-orange-500/20 rounded-xl p-2 shadow-2xl backdrop-blur-sm z-50">
          <div className="flex flex-col">
            <button className="w-full text-left px-3 py-2 rounded-md text-white hover:bg-orange-500/10" onClick={() => { setIsOpen(false); router.push('/profile'); }}>Profile</button>
            <button className="w-full text-left px-3 py-2 rounded-md text-white hover:bg-orange-500/10" onClick={() => { setIsOpen(false); router.push('/teams'); }}>My Teams</button>
            <button className="w-full text-left px-3 py-2 rounded-md text-white hover:bg-orange-500/10" onClick={() => { setIsOpen(false); router.push('/tournaments'); }}>My Tournaments</button>
            <button className="w-full text-left px-3 py-2 rounded-md text-white hover:bg-orange-500/10" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper functions to read counts/lists from localStorage
function getCount(key: string) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.length;
    if (typeof parsed === 'object') return Object.keys(parsed).length;
    return Number(parsed) || 0;
  } catch (e) {
    return 0;
  }
}

function getList(key: string) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}
