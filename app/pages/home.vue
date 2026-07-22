<template>
    <div class="bg-[url('/images/cream-pixels.png')]">
        <nav class="flex items-center justify-between px-2 py-4 bg-black/50 backdrop-blur-md  sticky top-0">
            <div class="text-white cursor-pointer" @click="() => router.push('/')">logo</div>
            <div>
                <button class="outline-none cursor-pointer" @click="logOut">Logout</button>
            </div>
        </nav>
        <div class="flex flex-col items-center gap-4 overflow-hidden z-10 mx-auto mt-32">
            <h1 class="text-bold text-5xl"> <span>Welcome back {{ user?.name }}</span></h1>

            <img src="/Images/potabro.jpg" class="w-25 h-25 hover:scale-20 transition-all duration-200 animate-pulse" />
        </div>
    </div>

</template>

<script setup lang="ts">
import { useLocalStorage } from '../composables/useLocalStorage'
const router = useRouter()

interface User {
    id: number,
    name: string
}

//updated normal user ref to a reusable component for all ref types with clear(acts as logout in a sense) 
const { value: user, clear } = useLocalStorage<User | null>(
    "user",
    null
)

useHead({
    title: 'Home Page',
    meta: [
        {
            name: 'description',
            content: 'This is the home page of our Nuxt 3 application.'
        }]
})

const logOut = () => {
    // clears user state (returns it to default - in this case null) and storage key
    clear()

    // clears localstorage token
    localStorage.removeItem("token")

    // redirects to login
    router.push("/")
}

onMounted(async () => {

    const goLogin = () => {
        return router.push('/')
    }
    
    // user.value = res.user
    console.log('Home page mounted');
});
</script>