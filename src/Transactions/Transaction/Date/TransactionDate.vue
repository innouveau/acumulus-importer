<script setup lang="ts">
defineProps<{ date: string }>()
</script>

<template>
    <span class="nowrap">{{ date }}</span>
</template>
