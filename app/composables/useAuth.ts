export async function fetchCurrentUser() {
    interface User {
        id: number,
        name?: string
    }

    const token = localStorage.getItem("token")

    if (!token) return null

    try {
        const me = await $fetch<{ user: User }>("/api/auth/me", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            return me

    } catch {
        localStorage.removeItem("token")
        return null
    }
}