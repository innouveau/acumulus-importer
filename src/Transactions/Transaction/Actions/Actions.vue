<script setup lang="ts">
import { computed } from 'vue'
import { useBooked } from '../../useBooked'
import { useBooking } from './useBooking'
import { useTransactions } from '../../useTransactions'
import { RowStatus } from './rowStatus.enum'
import type { Row } from '../transaction.types'
import { isApiBooking, isBookable, missingFields } from '../transaction.utils'

const props = defineProps<{ row: Row }>()
const { isDone, doneLabel, markDone, unmarkDone } = useBooked()
const { testmode, book } = useBooking()
const { setSelected } = useTransactions()

const missing = computed(() => missingFields(props.row))

const markAsDone = () => {
    markDone(props.row)
    setSelected(props.row, false)
}
</script>

<template>
    <template v-if="isDone(row)">
        <span class="badge ok">✓ {{ doneLabel(row) }}</span>
        <button class="link" @click="unmarkDone(row)">terugzetten</button>
    </template>
    <template v-else>
        <template v-if="isApiBooking(row)">
            <button :disabled="!isBookable(row) || row.status === RowStatus.Busy" @click="book(row)">
                {{ row.status === RowStatus.Busy ? '…' : testmode ? 'Test' : 'Boek' }}
            </button>
            <div v-if="missing.length" class="hint">Kies eerst: {{ missing.join(', ') }}</div>
        </template>
        <button v-else class="link" @click="markAsDone">markeer als gedaan</button>
    </template>
    <div v-if="row.message" class="message" :class="row.status">{{ row.message }}</div>
</template>
