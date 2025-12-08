export function getToken() {
  if (typeof window === "undefined") return null
  return localStorage.getItem("sb_token")
}

export function logout() {
  localStorage.removeItem("sb_token")
  window.location.href = "/login"
}

export async function getUser() {
  const token = getToken()
  if (!token) return null

  const res = await fetch("/api/auth-user", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (!res.ok) return null

  const data = await res.json()
  return data
}
