<script setup lang="ts">
import { useBooking } from '../Transactions/Transaction/Actions/useBooking'
import { useRules } from '../Rules/useRules'
import { View } from '../view.enum'

const view = defineModel<View>({ required: true })
const { rules } = useRules()
const { testmode } = useBooking()
</script>

<template>
    <header class="topbar">
        <h1>Acumulus importer</h1>
        <nav>
            <button :class="{ active: view === View.Transactions }" @click="view = View.Transactions">Transacties</button>
            <button :class="{ active: view === View.Rules }" @click="view = View.Rules">Regels ({{ rules.length }})</button>
        </nav>
        <label class="testmode" :class="{ live: !testmode }">
            <input v-model="testmode" type="checkbox" />
            {{ testmode ? 'Testmodus (boekt niets)' : 'LIVE: boekt echt' }}
        </label>
    </header>
</template>
