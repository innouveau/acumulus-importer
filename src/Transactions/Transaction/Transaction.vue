<script setup lang="ts">
import { computed } from 'vue'
import { useBooked } from '../useBooked'
import Actions from './Actions/Actions.vue'
import Amount from './Amount/Amount.vue'
import BookingTypeSelect from './BookingType/BookingTypeSelect.vue'
import { BookingType } from './BookingType/bookingType.enum'
import CostCenterSelect from './CostCenter/CostCenterSelect.vue'
import CostHeadingSelect from './CostHeading/CostHeadingSelect.vue'
import TransactionDate from './Date/TransactionDate.vue'
import Description from './Description/Description.vue'
import RuleSelect from './Rule/RuleSelect.vue'
import SelectCheckbox from './Select/SelectCheckbox.vue'
import type { Row } from './transaction.types'
import { hasCostCenter } from './transaction.utils'
import VatRateSelect from './Vat/VatRateSelect.vue'
import VatTypeSelect from './Vat/VatTypeSelect.vue'

const props = defineProps<{ row: Row }>()
const { isDone } = useBooked()

const done = computed(() => isDone(props.row))
const isExpense = computed(() => props.row.type === BookingType.Expense)
</script>

<template>
    <tr :class="{ done, unmatched: !row.ruleId }">
        <td><SelectCheckbox :row="row" :disabled="done" /></td>
        <td><TransactionDate :date="row.tx.date" /></td>
        <td class="desc"><Description :row="row" :disabled="done" /></td>
        <td class="num nowrap"><Amount :tx="row.tx" /></td>
        <td><RuleSelect :row="row" :disabled="done" /></td>
        <td><BookingTypeSelect v-model="row.type" :disabled="done" /></td>
        <td><CostHeadingSelect v-if="isExpense" v-model="row.costheading" :disabled="done" /></td>
        <td><CostCenterSelect v-if="hasCostCenter(row)" v-model="row.costcenter" :disabled="done" /></td>
        <td class="nowrap">
            <template v-if="isExpense">
                <VatRateSelect v-model="row.vatrate" :disabled="done" />
                <VatTypeSelect v-model="row.vattype" :disabled="done" />
            </template>
        </td>
        <td class="actions"><Actions :row="row" /></td>
    </tr>
</template>
