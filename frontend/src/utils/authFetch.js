const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

export const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  let res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (res.status === 401) {
    const refreshRes = await fetch(`${API_BASE}/api/auth/refresh-token`, {
      method: "POST",
      credentials: "include",
    });

    if (!refreshRes.ok) {
      console.warn("Refresh token failed. Redirecting to login...");
      window.location.href = "/signin"; 
      return res;
    }

    const data = await refreshRes.json();
    localStorage.setItem("token", data.access_token);

    res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${data.access_token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
  }

  return res;
};
