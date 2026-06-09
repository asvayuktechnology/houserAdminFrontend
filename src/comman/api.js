import { getToken, setToken, clearToken } from "./auth";

const BASE_URL = "https://houzerapi.houzer.tech/api/admin";

// 🔥 COMMON FETCH (AUTO TOKEN + AUTO REFRESH)
export const apiFetch = async (url, options = {}, retry = true) => {
  const token = getToken();

  console.log("🔐 Current Token:", token);

  const isFormData = options.body instanceof FormData;

  const res = await fetch(BASE_URL + url, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    credentials: "include",
  });

  // 🔴 token expired → refresh
  if (res.status === 401 && retry) {
    try {
      console.log("🔄 Token expired, trying refresh...");

      const refreshRes = await fetch(
        "https://houzerapi.houzer.tech/api/refresh-token",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!refreshRes.ok) throw new Error();

      const data = await refreshRes.json();

      console.log("✅ New Token:", data.accessToken);

      setToken(data.accessToken);

      return apiFetch(url, options, false);

    } catch (err) {
      console.log("❌ Refresh failed");

      clearToken();
      window.location.href = "/"; // ✅ redirect
    }
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "API Error");
  }

  return data;
};



// 🔐 LOGIN
export const loginAdmin = async (email, password) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  const data = await res.json();

  // 🔥 MOST IMPORTANT LINE
  setToken(data.token);

  console.log("✅ Login Token Set:", data.token);

  return data;
};



// 📊 DASHBOARD
export const getDashboard = () => apiFetch("/dashboard");
export const getDashboardStats = () => apiFetch("/dashboard/stats");



// 👤 DEALERS
export const getDealers = () => apiFetch("/dealers");

export const addDealer = (data) =>
  apiFetch("/create-dealers", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const deleteDealer = (id) =>
  apiFetch(`/dealers/${id}`, {
    method: "DELETE",
  });

export const updateDealer = (id, data) =>
  apiFetch(`/dealers/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });



// 🏠 PROPERTIES
export const getProperties = () => apiFetch("/properties");

export const addProperty = (data) =>
  apiFetch("/properties", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const deleteProperty = (id) =>
  apiFetch(`/properties/${id}`, {
    method: "DELETE",
  });

export const updateProperty = (id, data) =>
  apiFetch(`/properties/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });



// 👥 USERS
export const getUsers = () => apiFetch("/users");

export const addUser = (data) =>
  apiFetch("/create-user", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const deleteUser = (id) =>
  apiFetch(`/users/${id}`, {
    method: "DELETE",
  });

export const updateUser = (id, data) =>
  apiFetch(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });



// 🖼 BANNERS
export const getBanners = (category) =>
  apiFetch(category ? `/banners?category=${category}` : "/banners");

// ✅ CREATE (FormData)
export const addBanner = (formData) =>
  apiFetch("/create-banner", {
    method: "POST",
    body: formData,
  });

// ✅ DELETE
export const deleteBanner = (id) =>
  apiFetch(`/banners/${id}`, {
    method: "DELETE",
  });

// ✅ UPDATE (smart handling)
export const updateBanner = (id, data) => {
  let body;

  // 👉 agar file aa rahi hai toh FormData use karo
  if (data instanceof FormData) {
    body = data;
  } else {
    // 👉 warna JSON
    body = JSON.stringify(data);
  }

  return apiFetch(`/banners/${id}`, {
    method: "PUT",
    body,
  });
};


 export const getPostProperties = () => apiFetch("/post-properties");


 export const logout=()=>apiFetch("/logout")