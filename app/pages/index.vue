<template>
    <section>
        <div
            class="border border:bg-black max-w-2xl max-h-2xl rounded-xl flex items-center justify-center my-32 mx-auto p-2">
            <div class="bg-black/10 backdrop-blur-md rounded-xl w-full h-full p-2">
                <h1 class="flex items-center justify-center mx-auto mb-6">{{ tab === 'login' ? 'Login' : 'Signup' }}
                </h1>
                <div class="flex justify-center gap-2">
                    <div class="flex flex-col space-y-2">
                        <label class="text-gray-400 text-xs uppercase tracking-widest">name</label>
                        <input v-model="form.name" type="text" placeholder="john doe" name="name"
                            class="border bg-white p-1 rounded-sm focus:outline-none">
                    </div>

                    <div class="flex flex-col space-y-2">
                        <label class="text-gray-400 text-xs uppercase tracking-widest">Password</label>
                        <input v-model="form.password" type="password" placeholder="123456" name="name"
                            class="border bg-white p-1 rounded-sm focus:outline-none">
                    </div>
                </div>

                <button :disabled="loading" @click="handleSubmit"
                    class="flex items-center justify-center mx-auto mt-4 border border-bg-black bg-white p-2 w-sm rounded-xl cursor-pointer hover:bg-black hover:text-white transition-colors duration-200 disabled:cursor-not-allowed">
                    {{ loading ? 'sending...' : tab === 'login' ? 'login' : 'signup' }}
                </button>

                <p class="flex items-center justify-center mx-auto my-4 gap-2">
                    <span>{{ tab === 'login' ? 'no account?' : 'already have an account?' }}</span>

                    <span @click="swapTab"
                        class="underline underline-offset-2 bg-transparent border-none cursor-pointer">{{ tab ===
                            'login' ? 'signup' : 'login' }}</span>

                </p>

                <p v-if="error" class="text-red-400 text-sm mt-4 flex items-center justify-center mx-auto">{{ error }}
                </p>

            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
import type { FetchError } from 'ofetch'

// interface User {
//     id: number,
//     name: string
// }

const router = useRouter()

const goToHome = () => {
    router.push('/home')
}

const form = reactive({
    name: '',
    password: ''
})

const tab = ref('login')

const swapTab = () => {
    tab.value = tab.value === 'login' ? 'signup' : 'login'
}


const error = ref<string | null>('')
const loading = ref<boolean>(false)

const handleSubmit = async () => {
    loading.value = true
    error.value = ''
    try {

        if (!form.name) {
            error.value = "Specify name";
            return;
        }

        if (!form.password) {
            error.value = "Specify password";
            return;
        }

        // const res = await $fetch.raw<{ user: any; createdUser: any; message?: string }>(`/api/auth/${tab.value}`, {
        //     method: 'POST',
        //     body: { name: form.name, password: form.password },
        //     async onResponseError({ response }) {
        //         if (response.status === 401) {
        //             const data = response._data as { message?: string }
        //             error.value = data?.message ?? 'Unauthorized'
        //         }
        //     }

        // })
        // console.log(res)

        // if (!res.ok) {
        //     return error.value = "failed to register"
        // }

        // if (res.ok && res._data) {
        //     form.name = ''
        //     form.password = ''
        //     user.value = res._data.user || res._data.createdUser
        //     goToHome()
        // }

        const data = await $fetch<{ token: any }>(
            `/api/auth/${tab.value}`,
            {
                method: "POST",
                body: form,
                async onResponseError({ response }) {
                    if (response.status === 401) {
                        const data = response._data as { message?: string };
                        error.value = data?.message ?? 'Unauthorized';
                        return;
                    }
                }
            }
        )

        // Auto login after sign up
        if (tab && tab.value === 'signup') {
            const data = await $fetch('/api/auth/login',
                {
                    method: "POST",
                    body: form,
                    async onResponseError({ response }) {
                        if (response.status === 401) {
                            const data = response._data as { message?: string };
                            error.value = data?.message ?? 'Unauthorized';
                            return;
                        }
                    }
                }
            )
        }

        // user.value = data.user
        useCookie('jwt_token').value = data.token
        goToHome()


    } catch (e) {
        const err = e as FetchError;

        error.value =
            err.data?.message ??
            err.message ??
            "Something went wrong.";
    } finally {
        loading.value = false
    }

}
</script>