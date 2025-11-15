
'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import '../login-form.css';
import './profile-3d.css';

interface User {
  _id: string;
  userId: string;
  name: string;
  email: string;
  mobile?: string;
  college?: string;
  state?: string;
  ranking?: string;
  esportsPurpose?: string;
  avatar?: string;
}

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [originalFormData, setOriginalFormData] = useState<any>({});
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    college: '',
    state: '',
    ranking: '',
    esportsPurpose: '',
    games: '',
    avatar: ''
  });
  const [newEmail, setNewEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showEmailChange, setShowEmailChange] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [customGame, setCustomGame] = useState('');
  const [showGamesDropdown, setShowGamesDropdown] = useState(false);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const popularGames = ['Free Fire', 'BGMI', 'Valorant', 'PUBG', 'COD', 'Apex Legends', 'Fortnite', 'Dota 2', 'CS:GO', 'League of Legends'];

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (editing && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [editing]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('http://localhost:3000/api/auth/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        const userData = {
          name: data.user.name || '',
          mobile: data.user.mobile || '',
          college: data.user.college || '',
          state: data.user.state || '',
          ranking: data.user.ranking || 'Beginner',
          esportsPurpose: data.user.esportsPurpose || '',
          games: data.user.games ? data.user.games.join(', ') : (data.user.gameAccounts ? (Array.isArray(data.user.gameAccounts) ? data.user.gameAccounts.join(', ') : '') : ''),
          avatar: data.user.avatar || ''
        };
        setFormData(userData);
        setSelectedGames(userData.games ? userData.games.split(',').map((s: string) => s.trim()).filter(Boolean) : []);
        setOriginalFormData(userData);
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const gamesArray = selectedGames.length ? selectedGames : (formData.games ? formData.games.split(',').map((s: string) => s.trim()).filter(Boolean) : []);
      const payload = { ...formData, games: gamesArray };
      const response = await fetch('http://localhost:3000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setOriginalFormData(formData);
        setEditing(false);
        setIsFlipped(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleAvatarFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFormData(prev => ({ ...prev, avatar: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleCancel = () => {
    setFormData(originalFormData);
    setEditing(false);
    setIsFlipped(false);
  };

  const handleEmailChange = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/auth/change-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newEmail })
      });

      if (response.ok) {
        setShowEmailChange(false);
        setShowVerification(true);
        alert('Verification code sent to new email!');
      }
    } catch (error) {
      console.error('Error changing email:', error);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/auth/verify-new-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code: verificationCode })
      });

      if (response.ok) {
        setShowVerification(false);
        fetchProfile();
        alert('Email updated successfully!');
      }
    } catch (error) {
      console.error('Error verifying email:', error);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setEditing(!isFlipped);
  };

  if (loading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <button
            onClick={() => router.push('/')}
            className="p-2 bg-black/40 border border-orange-500/30 rounded-xl hover:bg-orange-500/20 transition-colors"
            title="Back to Home"
          >
            <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">Profile</h1>
          <div></div>
        </div>

        {user && (
          <div className="profile-3d-container">
            <div className={`profile-3d-card ${isFlipped ? 'flip-card' : ''}`}>
              <div className="profile-3d-card-inner">
                {/* Front of card - Profile Display */}
                <div className="profile-3d-front">
                  {/* Sparkles effect */}
                  <div className="sparkles">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <span key={i} className="sparkle" />
                    ))}
                  </div>

                  {/* Flip button */}
                  <button className="flip-btn" onClick={handleFlip} title="Edit Profile">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>

                  {/* Profile Header */}
                  <div className="profile-header">
                    <div className="profile-avatar-container">
                      {formData.avatar ? (
                        <img src={formData.avatar} alt="avatar" className="profile-avatar" />
                      ) : (
                        <div className="profile-avatar bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-black font-bold text-4xl">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                    </div>
                    <div className="profile-info">
                      <h2 className="profile-name">{user.name}</h2>
                      <p className="profile-email">{user.email}</p>
                      <div className="profile-id">
                        <span>ID: {(user?.userId || '').toString().replace(/\D/g, '')}</span>
                        <button
                          onClick={() => navigator.clipboard.writeText((user?.userId || '').toString().replace(/\D/g, ''))}
                          title="Copy User ID"
                        >
                          <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"/>
                            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="profile-stats">
                    <div className="stat-item">
                      <div className="stat-value">{(localStorage.getItem('tournamentsRegistered') ? JSON.parse(localStorage.getItem('tournamentsRegistered') || '[]').length : 0)}</div>
                      <div className="stat-label">Registered</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value">{(localStorage.getItem('tournamentsPlayed') ? JSON.parse(localStorage.getItem('tournamentsPlayed') || '[]').length : 0)}</div>
                      <div className="stat-label">Played</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value">{(selectedGames && selectedGames.length) ? selectedGames.length : ((formData.games || '').split(',').map(s => s.trim()).filter(Boolean).length)}</div>
                      <div className="stat-label">Games</div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="profile-details">
                    <div className="detail-item">
                      <span className="detail-label">College:</span>
                      <span className="detail-value">{formData.college || 'Not specified'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">State:</span>
                      <span className="detail-value">{formData.state || 'Not specified'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Mobile:</span>
                      <span className="detail-value">{formData.mobile || 'Not specified'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Ranking:</span>
                      <span className="detail-value">{formData.ranking || 'Beginner'}</span>
                    </div>
                  </div>

                  {/* About */}
                  <div className="profile-details">
                    <div className="detail-item">
                      <span className="detail-label">About:</span>
                    </div>
                    <div className="detail-value">{formData.esportsPurpose || 'No information provided'}</div>
                  </div>

                  {/* Games */}
                  <div className="profile-games">
                    <div className="games-title">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="2" y="6" width="20" height="12" rx="2" />
                        <path d="M6 12h4m-2-2v4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Games
                    </div>
                    <div className="games-container">
                      {(selectedGames.length ? selectedGames : ((formData.games || '').split(',').map(s => s.trim()).filter(Boolean))).map((g, idx) => (
                        <span key={idx} className="game-tag">{g}</span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="profile-actions">
                    <button className="action-btn primary-btn" onClick={handleFlip}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Edit Profile
                    </button>
                    <button
                      className="action-btn secondary-btn"
                      onClick={() => setShowEmailChange(true)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Change Email
                    </button>
                  </div>
                </div>

                {/* Back of card - Edit Form */}
                <div className="profile-3d-back">
                  {/* Sparkles effect */}
                  <div className="sparkles">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <span key={i} className="sparkle" />
                    ))}
                  </div>

                  {/* Flip button */}
                  <button className="flip-btn" onClick={handleFlip} title="View Profile">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M1 12s4-8 11-8 11 8-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>

                  <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">Edit Profile</h2>

                  <form className="edit-form" onSubmit={handleUpdate}>
                    {/* Avatar Upload */}
                    <div className="form-group">
                      <label className="form-label">Profile Picture</label>
                      <div className="flex items-center gap-4">
                        {formData.avatar ? (
                          <img src={formData.avatar} alt="avatar" className="w-20 h-20 rounded-full object-cover" />
                        ) : (
                          <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-black font-bold text-2xl">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files ? e.target.files[0] : undefined;
                            handleAvatarFile(file);
                          }}
                          className="form-input"
                        />
                      </div>
                    </div>

                    {/* Name Input */}
                    <div className="form-group">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="form-input"
                        ref={nameInputRef}
                      />
                    </div>

                    {/* Mobile Input */}
                    <div className="form-group">
                      <label className="form-label">Mobile</label>
                      <input
                        type="text"
                        value={formData.mobile}
                        onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                        className="form-input"
                      />
                    </div>

                    {/* College Input */}
                    <div className="form-group">
                      <label className="form-label">College</label>
                      <input
                        type="text"
                        value={formData.college}
                        onChange={(e) => setFormData({...formData, college: e.target.value})}
                        className="form-input"
                      />
                    </div>

                    {/* State Input */}
                    <div className="form-group">
                      <label className="form-label">State</label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({...formData, state: e.target.value})}
                        className="form-input"
                      />
                    </div>

                    {/* Ranking Input */}
                    <div className="form-group">
                      <label className="form-label">Ranking</label>
                      <select
                        value={formData.ranking}
                        onChange={(e) => setFormData({...formData, ranking: e.target.value})}
                        className="form-input"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Professional">Professional</option>
                      </select>
                    </div>

                    {/* Games Selection */}
                    <div className="form-group">
                      <label className="form-label">Games</label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {selectedGames.map((g, idx) => (
                          <span key={idx} className="game-tag">
                            {g}
                            <button
                              type="button"
                              onClick={() => setSelectedGames(prev => prev.filter(x => x !== g))}
                              className="ml-2 text-orange-400 hover:text-orange-300"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>

                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowGamesDropdown(prev => !prev)}
                          className="px-4 py-2 rounded-lg bg-black/40 border border-orange-600/20 text-orange-300"
                          aria-expanded={showGamesDropdown}
                        >
                          Choose games
                        </button>

                        {showGamesDropdown && (
                          <div className="absolute z-30 mt-2 w-full bg-black/90 border border-orange-600/30 rounded-lg p-3 shadow-lg">
                            <div className="max-h-48 overflow-auto space-y-1">
                              {popularGames.map((g) => (
                                <label key={g} className="flex items-center gap-3 p-2 hover:bg-black/40 rounded">
                                  <input
                                    type="checkbox"
                                    checked={selectedGames.includes(g)}
                                    onChange={() => setSelectedGames(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g])}
                                  />
                                  <span className="text-sm text-orange-200">{g}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-2 mt-3">
                          <input
                            type="text"
                            placeholder="Add custom game"
                            value={customGame}
                            onChange={(e) => setCustomGame(e.target.value)}
                            className="form-input"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const v = customGame.trim();
                              if (!v) return;
                              if (!selectedGames.includes(v)) setSelectedGames(prev => [...prev, v]);
                              setCustomGame('');
                            }}
                            className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* About Textarea */}
                    <div className="form-group">
                      <label className="form-label">About</label>
                      <textarea
                        value={formData.esportsPurpose}
                        onChange={(e) => setFormData({...formData, esportsPurpose: e.target.value})}
                        rows={4}
                        className="form-input form-textarea"
                        placeholder="Tell us about yourself, your goals, achievements..."
                      />
                    </div>

                    {/* Form Actions */}
                    <div className="form-actions">
                      <button
                        type="submit"
                        className="action-btn primary-btn"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="action-btn secondary-btn"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Email Change Modal */}
        {showEmailChange && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-black/90 via-orange-900/20 to-black/90 border border-orange-500/30 rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">Change Email</h3>

              {!showVerification ? (
                <div className="space-y-4">
                  <input
                    type="email"
                    placeholder="Enter new email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="form-input"
                  />
                  <div className="flex gap-3">
                    <button onClick={handleEmailChange} className="action-btn primary-btn">
                      Send Verification Code
                    </button>
                    <button onClick={() => setShowEmailChange(false)} className="action-btn secondary-btn">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-white">Enter verification code sent to {newEmail}</p>
                  <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      setVerificationCode(value);
                    }}
                    maxLength={6}
                    className="form-input"
                  />
                  <div className="flex gap-3">
                    <button onClick={handleVerifyEmail} className="action-btn primary-btn">
                      Verify & Update Email
                    </button>
                    <button onClick={() => {
                      setShowVerification(false);
                      setShowEmailChange(false);
                    }} className="action-btn secondary-btn">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
