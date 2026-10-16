<script setup lang="ts">
import { BOOKING_TYPE_LABELS } from './bookingType.constants'
import { BookingType } from './bookingType.enum'
import { enumValues } from '../../../utils/enum'

const model = defineModel<BookingType>({ required: true })
const options = enumValues(BookingType)
</script>

<template>
    <select v-model="model">
        <option v-for="option in options" :key="option" :value="option">{{ BOOKING_TYPE_LABELS[option] }}</option>
    </select>
</template>
