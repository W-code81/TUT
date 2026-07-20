<template>
    <div class="flex flex-col items-center gap-4 overflow-hidden z-10 mx-auto mt-32">
        <h1 class="text-bold text-5xl"> <span>Welcome back {{ user?.name}}</span></h1>

       
        <!-- <p class="text-lg">this is the home page </p>
        <NuxtLink to="/about" class="text-blue-500 hover:text-blue-700">About</NuxtLink>
        <button class="border p-4 rounded-2xl hover:bg-black hover:text-white transition-all suration-200"
            @click="count++">{{ count }}</button>
        <p v-if="pending">loading...</p>
        <p v-if="error">{{ error.data.message }}</p>
        <ul v-else>
            <li v-for="item in data?.database" :key="item">{{ item }}</li>
        </ul> -->


    </div>
</template>

<script setup lang="ts">
import { useLocalStorage } from '../composables/useLocalStorage'


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

onMounted(async () => {
    const token = useCookie('jwt_token')

    const router = useRouter()
    const goLogin = () =>{
        return router.push('/')
    }

    if (!token){
        return goLogin
    }

    const res = await $fetch('/api/auth/verify-token',{
        method: 'POST',
        body: {token:token.value}
    })

    if(!res){
        return goLogin
    }

    user.value = ((res.user.user as any) as User)
    console.log('Home page mounted');
});

// const { data, pending, error } = useFetch("/api/hello", { server: false })
</script>