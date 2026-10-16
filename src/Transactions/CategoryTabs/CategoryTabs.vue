<script setup lang="ts">
import { CATEGORY_LABELS } from './category.constants'
import { useTransactions } from '../useTransactions'
import { Category } from './category.enum'
import { enumValues } from '../../utils/enum'

const { category, openCount } = useTransactions()
const categories = enumValues(Category)
</script>

<template>
    <nav class="subtabs">
        <button v-for="cat in categories" :key="cat" :class="{ active: category === cat }" @click="category = cat">
            {{ CATEGORY_LABELS[cat] }} <span class="count">{{ openCount(cat) }}</span>
        </button>
    </nav>
</template>
