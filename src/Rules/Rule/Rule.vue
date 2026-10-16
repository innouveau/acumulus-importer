<script setup lang="ts">
import { computed } from 'vue'
import { BookingType } from '../../Transactions/Transaction/BookingType/bookingType.enum'
import type { Rule } from '../rule.types'
import BookingTypeSelect from '../../Transactions/Transaction/BookingType/BookingTypeSelect.vue'
import CostHeadingSelect from '../../Transactions/Transaction/CostHeading/CostHeadingSelect.vue'
import VatRateSelect from '../../Transactions/Transaction/Vat/VatRateSelect.vue'
import VatTypeSelect from '../../Transactions/Transaction/Vat/VatTypeSelect.vue'
import RuleFieldSelect from './Field/RuleFieldSelect.vue'

const props = defineProps<{ rule: Rule }>()
const emit = defineEmits<{ move: [delta: number]; remove: [] }>()

const isExpense = computed(() => props.rule.type === BookingType.Expense)
</script>

<template>
    <tr>
        <td class="nowrap">
            <button class="link" @click="emit('move', -1)">↑</button>
            <button class="link" @click="emit('move', 1)">↓</button>
        </td>
        <td><input v-model="rule.label" /></td>
        <td><input v-model="rule.match" /></td>
        <td><RuleFieldSelect v-model="rule.field" /></td>
        <td><BookingTypeSelect v-model="rule.type" /></td>
        <td><CostHeadingSelect v-if="isExpense" v-model="rule.costheading" /></td>
        <td><VatRateSelect v-if="isExpense" v-model="rule.vatrate" empty-label="per keer kiezen" /></td>
        <td><VatTypeSelect v-if="isExpense" v-model="rule.vattype" /></td>
        <td class="nowrap">
            <template v-if="isExpense">
                <input v-model="rule.supplierCountry" class="short" placeholder="NL" />
                <input v-model="rule.supplierVatnumber" placeholder="btw-nummer" />
            </template>
        </td>
        <td><input v-model="rule.note" /></td>
        <td><button class="link danger" @click="emit('remove')">✕</button></td>
    </tr>
</template>
