"use client";
import React from 'react';

type Stats = {
  tournaments?: number;
  teams?: number;
  trophies?: number;
  followers?: number;
};

type Props = {
  userId?: string | number;
  name?: string;
  username?: string;
  avatarUrl?: string;
  org?: string;
  website?: string;
  bio?: string;
  games?: string[];
  stats?: Stats;
  actions?: {
    onViewProfile?: () => void;
    onEdit?: () => void;
  };
};

export default function ProfileCard({
  userId,
  name,
  username,
  avatarUrl = '/avatar.png',
  org,
  website,
  bio,
  games = [],
  stats,
  actions,
}: Props) {
  return (
    <div className="w-full">
      <div className="relative">
        {/* Banner container */}
        <div className="relative w-full rounded-3xl overflow-hidden border border-orange-600/30 bg-gradient-to-r from-orange-900/30 via-black/20 to-black/10 shadow-lg">
          {/* subtle sparkle overlay */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(rgba(255,180,120,0.12) 1px, transparent 1px)`,
              backgroundSize: '18px 18px',
              mixBlendMode: 'overlay',
              opacity: 0.55,
            }}
          />

          <div className="flex items-center gap-4 py-6 px-6">
            {/* avatar (overlap feel via negative margin) */}
            <div className="-ml-8">
              <img
                src={avatarUrl}
                alt={name || 'avatar'}
                className="w-24 h-24 rounded-full border-4 border-black/50 shadow-xl object-cover bg-black"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl md:text-3xl font-extrabold text-orange-400 truncate">{name ?? 'Unknown'}</h2>
                <div className="text-sm text-zinc-400 font-medium truncate">{username ? `@${username}` : ''}</div>
              </div>
              <div className="mt-1 text-xs text-zinc-300 truncate max-w-[65%]">{bio ?? org ?? website ?? ''}</div>

              <div className="mt-3 flex items-center gap-3 text-xs text-zinc-400">
                {typeof userId !== 'undefined' && (
                  <div className="font-mono bg-black/20 px-2 py-1 rounded">ID: {String(userId)}</div>
                )}

                {stats && (
                  <div className="flex gap-2 items-center">
                    <div className="px-2 py-1 rounded bg-black/10">🏆 {stats.tournaments ?? 0}</div>
                    <div className="px-2 py-1 rounded bg-black/10">👥 {stats.teams ?? 0}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Edit button */}
            <div className="ml-4">
              <button
                type="button"
                onClick={() => actions?.onEdit?.()}
                className="h-12 w-12 rounded-full bg-black/30 border border-orange-500/40 flex items-center justify-center text-orange-300 hover:bg-orange-500/25 transition"
                aria-label="Edit profile"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 21v-3.75L14.06 6.19a2.5 2.5 0 013.54 0l1.2 1.2a2.5 2.5 0 010 3.54L7.74 21H3z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14 5l5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
