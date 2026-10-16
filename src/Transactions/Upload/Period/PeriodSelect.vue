<script setup lang="ts">
import { usePeriod } from './usePeriod'

const { selectedKey, options } = usePeriod()
</script>

<template>
    <select v-model="selectedKey">
        <option :value="null" disabled>— kies —</option>
        <option v-for="option in options" :key="option.key" :value="option.key">{{ option.label }}</option>
    </select>
</template>
