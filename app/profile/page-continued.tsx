
import React, { useState, useRef } from 'react';

export default function ProfilePage() {
  // Form state (local for this fragment)
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    college: '',
    state: '',
    ranking: 'Beginner',
    esportsPurpose: '',
    avatar: ''
  });

  const [selectedGames, setSelectedGames] = useState<string[]>(
    (formData.ranking && formData.ranking === '') ? [] : []
  ); // start empty

  const [showGamesDropdown, setShowGamesDropdown] = useState(false);
  const popularGames = ['Valorant', 'CS:GO', 'Dota 2', 'League of Legends', 'PUBG'];
  const [customGame, setCustomGame] = useState('');
  const user = { name: formData.name || 'User' };
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  const [isEditing, setIsEditing] = useState(false);

  const handleAvatarFile = (file: File) => {
    // simple local preview - replace with real upload logic
    const url = URL.createObjectURL(file);
    setFormData((p) => ({ ...p, avatar: url }));
  };

  const handleFlip = () => setIsEditing((v) => !v);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Persist changes...
    console.log('Saved', formData, selectedGames);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // revert or close editor
    setIsEditing(false);
  };

  // Email change modal state
  const [showEmailChange, setShowEmailChange] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);

  const handleEmailChange = () => {
    if (!newEmail) return;
    // Send code logic (simulate)
    console.log('Sending verification to', newEmail);
    setShowVerification(true);
  };

  const handleVerifyEmail = () => {
    if (verificationCode.length !== 6) return;
    // Verify and update email
    console.log('Verified', newEmail);
    setShowVerification(false);
    setShowEmailChange(false);
    setVerificationCode('');
    setNewEmail('');
  };

  const toggleGame = (g: string) => {
    setSelectedGames((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));
  };

  const addCustomGame = () => {
    const v = customGame.trim();
    if (!v) return;
    setSelectedGames((prev) => (prev.includes(v) ? prev : [...prev, v]));
    setCustomGame('');
  };

  return (
    <div className="profile-root">
      {/* Front of card */}
      {!isEditing ? (
        <div className="profile-front">
          <div className="profile-details">
            <span className="detail-label">About:</span>
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
              {(selectedGames.length ? selectedGames : []).map((g, idx) => (
                <span key={idx} className="game-tag">{g}</span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="profile-actions">
            <button className="action-btn primary-btn" onClick={handleFlip} aria-label="Edit Profile">
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
                <path d="M3 8l7.89 5.26a2 2 0 002.22 2.22l6.78 6.78a2 2 0 002.22 2.22l6.78 14.22a2 2 0 002.22-2.22V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Change Email
            </button>
          </div>
        </div>
      ) : (
        /* Back of card - Edit Form */
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
              <path d="M1 12s4-8 11-8 11 8-4m4 4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>

          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">Edit Profile</h2>

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
                    if (file) handleAvatarFile(file);
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
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="form-input"
              />
            </div>

            {/* College Input */}
            <div className="form-group">
              <label className="form-label">College</label>
              <input
                type="text"
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                className="form-input"
              />
            </div>

            {/* State Input */}
            <div className="form-group">
              <label className="form-label">State</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="form-input"
              />
            </div>

            {/* Ranking Input */}
            <div className="form-group">
              <label className="form-label">Ranking</label>
              <select
                value={formData.ranking}
                onChange={(e) => setFormData({ ...formData, ranking: e.target.value })}
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
              <div className="games-list mb-2">
                {selectedGames.map((g, idx) => (
                  <span key={idx} className="game-tag">
                    {g}
                    <button
                      type="button"
                      onClick={() => setSelectedGames((prev) => prev.filter((x) => x !== g))}
                      className="ml-2 text-orange-400 hover:text-orange-300"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowGamesDropdown((prev) => !prev)}
                className="px-4 py-2 rounded-lg bg-black/40 border border-orange-600/20 text-orange-300"
                aria-expanded={showGamesDropdown}
              >
                Choose games
              </button>

              {showGamesDropdown && (
                <div className="absolute z-30 mt-2 w-full bg-black/90 border border-orange-600/30 rounded-lg p-3 shadow-lg">
                  {popularGames.map((g) => (
                    <label key={g} className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={selectedGames.includes(g)}
                        onChange={() => toggleGame(g)}
                      />
                      <span className="text-sm text-orange-200">{g}</span>
                    </label>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2 mt-3">
                <input
                  type="text"
                  placeholder="Add custom game"
                  value={customGame}
                  onChange={(e) => setCustomGame(e.target.value)}
                  className="form-input flex-1"
                />
                <button
                  type="button"
                  onClick={addCustomGame}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl"
                >
                  Add
                </button>
              </div>
            </div>

            {/* About Textarea */}
            <div className="form-group">
              <label className="form-label">About</label>
              <textarea
                value={formData.esportsPurpose}
                onChange={(e) => setFormData({ ...formData, esportsPurpose: e.target.value })}
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
  );
}
