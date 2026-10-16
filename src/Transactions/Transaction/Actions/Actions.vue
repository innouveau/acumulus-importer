<script setup lang="ts">
import { useBooked } from '../../useBooked'
import { useBooking } from './useBooking'
import { useTransactions } from '../../useTransactions'
import { BookingType } from '../BookingType/bookingType.enum'
import { RowStatus } from './rowStatus.enum'
import type { Row } from '../transaction.types'
import { isBookable } from '../transaction.utils'

const props = defineProps<{ row: Row }>()
const { isDone, doneLabel, markDone, unmarkDone } = useBooked()
const { testmode, book } = useBooking()
const { setSelected } = useTransactions()

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
        <button v-if="isBookable(row)" :disabled="row.status === RowStatus.Busy" @click="book(row)">
            {{ row.status === RowStatus.Busy ? '…' : testmode ? 'Test' : 'Boek' }}
        </button>
        <button v-else-if="row.type !== BookingType.Expense" class="link" @click="markAsDone">markeer als gedaan</button>
    </template>
    <div v-if="row.message" class="message" :class="row.status">{{ row.message }}</div>
</template>
