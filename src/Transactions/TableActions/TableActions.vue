<script setup lang="ts">
import { useBooking } from '../Transaction/Actions/useBooking'
import { useTransactions } from '../useTransactions'
import SearchField from './Search/SearchField.vue'

const { hideDone, selectedBookable } = useTransactions()
const { testmode, bookSelected } = useBooking()
</script>

<template>
    <div class="table-actions">
        <div class="table-filters">
            <SearchField />
            <label><input v-model="hideDone" type="checkbox" /> Verberg afgehandelde</label>
        </div>
        <button class="primary" :disabled="!selectedBookable.length" @click="bookSelected">
            {{ testmode ? 'Test' : 'Boek' }} geselecteerde ({{ selectedBookable.length }})
        </button>
    </div>
</template>
