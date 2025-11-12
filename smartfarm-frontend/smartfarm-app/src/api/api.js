import axios from "axios"

export const API_BASE = "http://localhost:3000"
export const API_KEY = "my-secret-client-key-abc123"

const headers = () => ({ "x-api-key": API_KEY })

const handleApiError = (error) => {
  if (error.response?.data?.error) {
    throw new Error(error.response.data.error)
  }
  if (error.message) {
    throw new Error(error.message)
  }
  throw new Error("API Error")
}

// Sensors
export async function fetchBlynkAll() {
  try {
    const r = await axios.get(`${API_BASE}/api/blynk/getAll`, { headers: headers() })
    return r.data
  } catch (e) {
    handleApiError(e)
  }
}

export async function getSensorHistory(limit = 20) {
  try {
    const r = await axios.get(`${API_BASE}/api/sensors/history?limit=${limit}`, { headers: headers() })
    return r.data
  } catch (e) {
    handleApiError(e)
  }
}

// Coops
export async function getCoops() {
  try {
    const r = await axios.get(`${API_BASE}/api/coops`)
    return r.data
  } catch (e) {
    handleApiError(e)
  }
}

export async function createCoop(payload) {
  try {
    const r = await axios.post(`${API_BASE}/api/coops`, payload)
    return r.data
  } catch (e) {
    handleApiError(e)
  }
}

export async function getCoop(id) {
  try {
    const r = await axios.get(`${API_BASE}/api/coops/${id}`)
    return r.data
  } catch (e) {
    handleApiError(e)
  }
}

export async function updateCoop(id, payload) {
  try {
    const r = await axios.put(`${API_BASE}/api/coops/${id}`, payload)
    return r.data
  } catch (e) {
    handleApiError(e)
  }
}

export async function deleteCoop(id) {
  try {
    console.log("[v0] API: Deleting coop with ID:", id)
    const r = await axios.delete(`${API_BASE}/api/coops/${id}`)
    console.log("[v0] API: Delete response:", r.data)
    return r.data
  } catch (e) {
    console.log("[v0] API: Delete error:", e.response?.data || e.message)
    handleApiError(e)
  }
}

// Chickens
export async function getChickenTxs() {
  try {
    const r = await axios.get(`${API_BASE}/api/chickens`)
    return r.data
  } catch (e) {
    handleApiError(e)
  }
}

export async function createChickenTx(payload) {
  try {
    const r = await axios.post(`${API_BASE}/api/chickens`, payload)
    return r.data
  } catch (e) {
    handleApiError(e)
  }
}

export async function deleteChickenTx(id) {
  try {
    const r = await axios.delete(`${API_BASE}/api/chickens/${id}`)
    return r.data
  } catch (e) {
    handleApiError(e)
  }
}

// Feed
export async function getFeeds() {
  try {
    const r = await axios.get(`${API_BASE}/api/feed`)
    return r.data
  } catch (e) {
    handleApiError(e)
  }
}

export async function createFeed(payload) {
  try {
    const r = await axios.post(`${API_BASE}/api/feed`, payload)
    return r.data
  } catch (e) {
    handleApiError(e)
  }
}

export async function deleteFeed(id) {
  try {
    const r = await axios.delete(`${API_BASE}/api/feed/${id}`)
    return r.data
  } catch (e) {
    handleApiError(e)
  }
}

// Products
export async function getProducts() {
  try {
    const r = await axios.get(`${API_BASE}/api/products`)
    return r.data
  } catch (e) {
    handleApiError(e)
  }
}

export async function createProduct(payload) {
  try {
    const r = await axios.post(`${API_BASE}/api/products`, payload)
    return r.data
  } catch (e) {
    handleApiError(e)
  }
}

export async function updateProduct(id, payload) {
  try {
    const r = await axios.put(`${API_BASE}/api/products/${id}`, payload)
    return r.data
  } catch (e) {
    handleApiError(e)
  }
}

export async function deleteProduct(id) {
  try {
    const r = await axios.delete(`${API_BASE}/api/products/${id}`)
    return r.data
  } catch (e) {
    handleApiError(e)
  }
}

// Orders
export async function getOrders() {
  try {
    const r = await axios.get(`${API_BASE}/api/orders`)
    return r.data
  } catch (e) {
    handleApiError(e)
  }
}

export async function getOrder(id) {
  try {
    const r = await axios.get(`${API_BASE}/api/orders/${id}`)
    return r.data
  } catch (e) {
    handleApiError(e)
  }
}

export async function createOrder(payload) {
  try {
    const r = await axios.post(`${API_BASE}/api/orders`, payload)
    return r.data
  } catch (e) {
    handleApiError(e)
  }
}

export async function updateOrder(id, payload) {
  try {
    const r = await axios.put(`${API_BASE}/api/orders/${id}`, payload)
    return r.data
  } catch (e) {
    handleApiError(e)
  }
}

export async function deleteOrder(id) {
  try {
    const r = await axios.delete(`${API_BASE}/api/orders/${id}`)
    return r.data
  } catch (e) {
    handleApiError(e)
  }
}

// Authentication and Contact API methods
export async function loginUser(email, password) {
  try {
    const r = await axios.post(`${API_BASE}/api/users/login`, { email, password })
    return r.data
  } catch (e) {
    handleApiError(e)
  }
}

export async function registerUser(fullName, email, password, phone) {
  try {
    const r = await axios.post(`${API_BASE}/api/users/register`, { fullName, email, password, phone })
    return r.data
  } catch (e) {
    handleApiError(e)
  }
}

export async function getCurrentUser(token) {
  try {
    const r = await axios.get(`${API_BASE}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return r.data
  } catch (e) {
    handleApiError(e)
  }
}

export async function updateUserProfile(token, fullName, phone) {
  try {
    const r = await axios.put(
      `${API_BASE}/api/users/profile`,
      { fullName, phone },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    return r.data
  } catch (e) {
    handleApiError(e)
  }
}

export async function submitContact(name, email, phone, subject, message) {
  try {
    const r = await axios.post(`${API_BASE}/api/contact`, { name, email, phone, subject, message })
    return r.data
  } catch (e) {
    handleApiError(e)
  }
}
