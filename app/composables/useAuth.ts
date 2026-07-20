export async function fetchCurrentUser() {
    const token = localStorage.getItem("token")

    if (!token) return null

    return await $fetch("/api/auth/me", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}