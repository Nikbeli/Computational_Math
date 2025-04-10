<script setup>
import { ref } from "vue";
import StartTable from "./components/StartTable.vue";
import UserFilters from "./components/UserFilters.vue"
import HelloWorld from './components/HelloWorld.vue'

// Количество поставщиков
const suppliers = ref(3);

// Количество потребителей
const consumers = ref(3);

function applySettings(supp, cons) {
  suppliers.value = supp;
  consumers.value = cons;
}

</script>

<template>
  <div>
    <h1 class="title"> Транспортная задача </h1>
  </div>
  <div class="wrapper">
      <user-filters @apply-settings="applySettings" />
      <start-table :suppliers="suppliers" :consumers="consumers" />
  </div>
</template>

<style scoped>

.wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
</style>
