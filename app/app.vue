<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage/>
  </div>
</template>

<script lang="ts">
import { fetchCurrentUser } from './composables/useAuth'
import { useLocalStorage } from './composables/useLocalStorage'

interface User {
    id: number,
    name?: string
}

interface FetchCurrentUserResponse {
    user?: User
}

const { value: user } = useLocalStorage<User | null>(
    "user",
    null
)

onMounted(async () => {
    const me = await fetchCurrentUser() as FetchCurrentUserResponse

    if (me.user) {
        user.value = me.user
    }
})
</script>