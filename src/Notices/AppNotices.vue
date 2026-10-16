<script setup lang="ts">
import { useAcumulus } from '../acumulus/useAcumulus'

const { configured, loadError } = useAcumulus()
</script>

<template>
    <div v-if="!configured" class="notice warn">
        Nog geen Acumulus-gegevens. Kopieer <code>.env.example</code> naar <code>.env.local</code>, vul contractcode,
        gebruikersnaam en wachtwoord in en herstart <code>npm run dev</code>. Inlezen en indelen werkt al wel.
    </div>
    <div v-if="loadError" class="notice error">{{ loadError }}</div>
</template>
