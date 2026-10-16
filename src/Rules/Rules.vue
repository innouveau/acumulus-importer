<script setup lang="ts">
import { useRuleDraft } from './useRuleDraft'
import { RULE_COLUMNS } from './rules.constants'
import Rule from './Rule/Rule.vue'

const { draft, dirty, add, remove, move, save } = useRuleDraft()
</script>

<template>
    <section class="card">
        <div class="table-actions">
            <p class="muted">De eerste regel waarvan een zoekterm gevonden wordt, wint. Meerdere zoektermen scheid je met komma's.</p>
            <div>
                <button @click="add">+ Regel</button>
                <button class="primary" :disabled="!dirty" @click="save">Opslaan</button>
            </div>
        </div>
        <div class="table-scroll">
            <table class="rules">
                <thead>
                    <tr>
                        <th v-for="(column, index) in RULE_COLUMNS" :key="index">{{ column }}</th>
                    </tr>
                </thead>
                <tbody>
                    <Rule
                        v-for="(rule, index) in draft"
                        :key="rule.id"
                        :rule="rule"
                        @move="move(index, $event)"
                        @remove="remove(index)"
                    />
                </tbody>
            </table>
        </div>
    </section>
</template>
