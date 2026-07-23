interface User {
    id: number
    email: string
    nickname: string
}

export function useAuth() {
    //user state 
    const user = useState<User | null>("auth-user", () => null);

    async function fetchUser() {
        try {
            const res = await $fetch<{
                success: boolean
                data: User
            }>("/api/auth/me")

            user.value = res.data
        } catch {
            user.value = null
        }
    }

    async function logout() {
        await $fetch("/api/auth/logout", {
            method: "POST"
        })

        user.value = null

        await navigateTo("/login")
    }

    return {
        user,
        fetchUser,
        logout,
    }
}