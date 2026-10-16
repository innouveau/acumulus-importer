<script setup lang="ts">
import { useTransactions } from '../../useTransactions'

const { search } = useTransactions()
</script>

<template>
    <input v-model="search" type="search" class="search" placeholder="Zoek in omschrijving…" />
</template>
