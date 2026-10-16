<script setup lang="ts">
import { euro } from '../Amount/amount.utils'
import type { Transaction } from '../transaction.types'
import type { UnpaidInvoice } from './invoice.types'
import { amountMatches, nameMatches, numberMatches } from './invoice.utils'

defineProps<{ invoices: UnpaidInvoice[]; tx: Transaction }>()
const selected = defineModel<UnpaidInvoice | null>({ required: true })
</script>

<template>
    <div class="invoice-list">
        <table>
            <thead>
                <tr>
                    <th></th>
                    <th>Factuur</th>
                    <th>Datum</th>
                    <th>Klant</th>
                    <th class="num">Bedrag</th>
                    <th>Komt overeen</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="invoice in invoices"
                    :key="invoice.token"
                    :class="{ chosen: selected?.token === invoice.token }"
                    @click="selected = invoice"
                >
                    <td><input type="radio" :checked="selected?.token === invoice.token" /></td>
                    <td class="nowrap">{{ invoice.number }}</td>
                    <td class="nowrap">{{ invoice.issuedate }}</td>
                    <td>{{ invoice.contactname }}</td>
                    <td class="num nowrap">{{ euro(invoice.amount) }}</td>
                    <td class="nowrap">
                        <span v-if="numberMatches(invoice, tx)" class="tag">nummer</span>
                        <span v-if="amountMatches(invoice, tx)" class="tag">bedrag</span>
                        <span v-if="nameMatches(invoice, tx)" class="tag">klant</span>
                    </td>
                </tr>
            </tbody>
        </table>
        <p v-if="!invoices.length" class="muted">Geen openstaande facturen gevonden.</p>
    </div>
</template>
