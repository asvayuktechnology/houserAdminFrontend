import { getToken, setToken, clearToken} from "./auth";

// const BASE_URL = "https://houzerapi.houzer.tech/api/admin";
const BASE_URL = `${import.meta.env.VITE_API_URL}/api`;
// const BASE_URL = "http://localhost:8001/api/admin";

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
        `${BASE_URL}/admin/refresh-token`,
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
    const err = new Error(data?.message || "API Error");
    err.data = data;
    throw err;
  }

  return data;
};



// 🔐 LOGIN
export const loginAdmin = async (email, password) => {
  const res = await fetch(`${BASE_URL}/admin/login`, {
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
export const getDashboard = () => apiFetch("/admin/dashboard");
export const getDashboardStats = () => apiFetch("/admin/dashboard/stats");



// 👤 DEALERS
export const getDealers = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") query.append(k, v);
  });
  const qs = query.toString();
  return apiFetch(`/admin/dealers${qs ? "?" + qs : ""}`);
};

export const addDealer = (data) =>
  apiFetch("/admin/create-dealers", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const deleteDealer = (id) =>
  apiFetch(`/admin/dealers/${id}`, {
    method: "DELETE",
  });

export const updateDealer = (id, data) =>
  apiFetch(`/admin/dealers/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const uploadDealersExcel = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return apiFetch("/admin/upload-dealers", {
    method: "POST",
    body: formData,
  });
};

export const allDeleteDealers = () =>
  apiFetch("/admin/delete-all-dealers", {
    method: "DELETE",
  });



// 🏠 PROPERTIES
export const getProperties = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") query.append(k, v);
  });
  const qs = query.toString();
  return apiFetch(`/admin/properties${qs ? "?" + qs : ""}`);
};

export const addProperty = (data) =>
  apiFetch("/admin/properties", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const deleteProperty = (id) =>
  apiFetch(`/admin/properties/${id}`, {
    method: "DELETE",
  });

export const updateProperty = (id, data) =>
  apiFetch(`/admin/properties/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });


// 👥 USERS
export const getUsers = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") query.append(k, v);
  });
  const qs = query.toString();
  return apiFetch(`/admin/users${qs ? "?" + qs : ""}`);
};

export const addUser = (data) =>
  apiFetch("/admin/create-user", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const deleteUser = (id) =>
  apiFetch(`/admin/users/${id}`, {
    method: "DELETE",
  });

export const updateUser = (id, data) =>
  apiFetch(`/admin/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });



// 🖼 BANNERS
export const getBanners = (category) =>
  apiFetch(category ? `/admin/banners?category=${category}` : "/admin/banners");

// ✅ CREATE (FormData)
export const addBanner = (formData) =>
  apiFetch("/admin/create-banner", {
    method: "POST",
    body: formData,
  });

// ✅ DELETE
export const deleteBanner = (id) =>
  apiFetch(`/admin/banners/${id}`, {
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

  return apiFetch(`/admin/banners/${id}`, {
    method: "PATCH",
    body,
  });
};


 export const getPostProperties = () => apiFetch("/admin/post-properties");


 ///////////// Updated New Api///////////

export const uploadPropertiesExcel = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return apiFetch("/admin/upload-properties", {
    method: "POST",
    body: formData,
  });
};



export const getFixedProperties = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") query.append(k, v);
  });
  const qs = query.toString();
  return apiFetch(`/fixed-properties${qs ? "?" + qs : ""}`);
};

export const deleteFixedProperty = (id) =>
  apiFetch(`/admin/fixed-properties/${id}`, {
    method: "DELETE",
  });

export const updateFixedProperty = (id, data) =>
  apiFetch(`/admin/fixed-properties/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });



export const allDeleteProperties = () =>
  apiFetch("/admin/delete-all-properties", {
    method: "DELETE",
  });

// 📋 LEADS
export const getLeads = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") query.append(k, v);
  });
  const qs = query.toString();
  return apiFetch(`/lead${qs ? "?" + qs : ""}`);
};

export const addLead = (data) =>
  apiFetch("/lead", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const deleteLead = (id) =>
  apiFetch(`/lead/${id}`, {
    method: "DELETE",
  });

export const updateLead = (id, data) =>
  apiFetch(`/lead/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const allDeleteLeads = () =>
  apiFetch("/lead", {
    method: "DELETE",
  });


// 📝 POSTS
export const getPosts = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") query.append(k, v);
  });
  const qs = query.toString();
  return apiFetch(`/post${qs ? "?" + qs : ""}`);
};

export const addPost = (data) =>
  apiFetch("/post", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const deletePost = (id) =>
  apiFetch(`/post/${id}`, {
    method: "DELETE",
  });

export const updatePost = (id, data) =>
  apiFetch(`/post/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const allDeletePosts = () =>
  apiFetch("/post", {
    method: "DELETE",
  });


 export const logout=()=>apiFetch("/logout")


// ⚙️ SETTINGS
export const getSettings = () => apiFetch("/setting");

export const updateSettings = (formData) =>
  apiFetch("/admin/setting", {
    method: "PATCH",
    body: formData,
  });