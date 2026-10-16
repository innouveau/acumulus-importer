<script setup lang="ts">
import { COST_HEADING_GROUPS } from './costHeading.constants'
import type { CostHeading } from './costHeading.enum'

const model = defineModel<CostHeading | ''>({ required: true })
</script>

<template>
    <select v-model="model" class="cost-heading" :class="{ missing: !model }">
        <option value="">— kies —</option>
        <optgroup v-for="group in COST_HEADING_GROUPS" :key="group.label" :label="group.label">
            <option v-for="option in group.options" :key="option" :value="option">{{ option }}</option>
        </optgroup>
    </select>
</template>
