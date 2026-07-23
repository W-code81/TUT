<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage/>
  </div>
</template>

<script lang="ts" setup>
import { useAuth } from './composables/useAuth';

const { fetchUser } = useAuth()

onMounted(() => {
    fetchUser()
})
</script>