const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function fetchApi(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const token = typeof window !== "undefined" 
    ? localStorage.getItem("access_token") 
    : null

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: response.statusText }))
    throw new ApiError(
      errorData.detail || errorData.message || "An error occurred",
      response.status,
      errorData
    )
  }

  return response
}

export const api = {
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetchApi(endpoint, { method: "GET" })
    return response.json()
  },

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetchApi(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
    return response.json()
  },

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetchApi(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
    return response.json()
  },

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetchApi(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    })
    return response.json()
  },

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetchApi(endpoint, { method: "DELETE" })
    return response.json()
  },
}

