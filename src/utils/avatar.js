// Generador de avatar fallback 100% offline (SVG Data URL)
// Nunca falla, no depende de red ni APIs externas como Dicebear que pueden ser bloqueadas
export const getProfilePlaceholderSvg = (bgColor = '#f1f5f9', iconColor = '#94a3b8') => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
    <rect width="128" height="128" rx="64" fill="${bgColor}" />
    <circle cx="64" cy="46" r="22" fill="${iconColor}" />
    <path d="M28 106 C28 84, 44 76, 64 76 C84 76, 100 84, 100 106 Z" fill="${iconColor}" />
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const getFallbackAvatar = (name = '') => {
  return getProfilePlaceholderSvg();
};

export const getSafeAvatarUrl = (avatarUrl, name = '') => {
  if (avatarUrl && typeof avatarUrl === 'string' && avatarUrl.trim() !== '') {
    return avatarUrl;
  }
  return getFallbackAvatar(name);
};



