const API_BASE = '/api';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (options.method && options.method !== 'GET') {
    headers['X-CSRFToken'] = getCookie('csrftoken') || '';
  }

  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers,
    ...options,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
}

export const authApi = {
  register: (payload) => request('/auth/register/', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login/', { method: 'POST', body: JSON.stringify(payload) }),
  logout: () => request('/auth/logout/', { method: 'POST' }),
  me: () => request('/auth/me/'),
};

export const roomsApi = {
  list: () => request('/rooms/'),
  getRoom: (roomId) => request(`/rooms/${roomId}/`),
  create: (payload) => request('/rooms/', { method: 'POST', body: JSON.stringify(payload) }),
  getMessages: (roomId) => request(`/rooms/${roomId}/messages/`),
  sendMessage: (roomId, content) => request(`/rooms/${roomId}/messages/`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  }),
  join: (roomId) => request(`/rooms/${roomId}/join/`, { method: 'POST' }),
};
