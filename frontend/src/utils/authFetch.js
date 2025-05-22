import { API_ENDPOINTS } from '../config';

export const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");
  const isFormData = options.body instanceof FormData;
  let res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    },
    credentials: "include",
  });

  if (res.status === 401) {
    const refreshRes = await fetch(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
      method: "POST",
      credentials: "include",
    });
    console.log("Refresh token response:", refreshRes.data);
    if (refreshRes.status !== 200) {
      console.warn("Refresh token failed. Redirecting to login...");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      const logoutRes = await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
        method: "POST",
        credentials: "include",
      });
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
