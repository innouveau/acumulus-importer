<script setup lang="ts">
import { useTransactions } from '../../useTransactions'
import { buildCsv, downloadCsv, exportFileName } from './export.utils'

const { fileName, linebreak, remainingRows } = useTransactions()

const exportRemaining = () => downloadCsv(exportFileName(fileName.value), buildCsv(remainingRows.value, linebreak.value))
</script>

<template>
    <button :disabled="!remainingRows.length" @click="exportRemaining">Exporteer overgebleven ({{ remainingRows.length }})</button>
</template>
