<script setup lang="ts">
import { useBooking } from '../Transaction/Actions/useBooking'
import { useTransactions } from '../useTransactions'

const { hideDone, selectedBookable } = useTransactions()
const { testmode, bookSelected } = useBooking()
</script>

<template>
    <div class="table-actions">
        <label><input v-model="hideDone" type="checkbox" /> Verberg afgehandelde</label>
        <button class="primary" :disabled="!selectedBookable.length" @click="bookSelected">
            {{ testmode ? 'Test' : 'Boek' }} geselecteerde ({{ selectedBookable.length }})
        </button>
    </div>
</template>
