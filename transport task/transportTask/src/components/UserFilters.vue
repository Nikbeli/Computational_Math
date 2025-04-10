<script setup>
import { ref } from "vue";

// Количество поставщиков
const suppliers = ref(3);

// Количество потребителей
const consumers = ref(3);

const emit = defineEmits(["apply-settings"])

function resetTable() {
    suppliers.value = 3;
    consumers.value = 3;
    emit("apply-settings", 3, 3)
}

function applySettings() {
    emit("apply-settings", suppliers.value, consumers.value)
}
</script>


<template>
    <div>
        <div class="settings">
            <label> 
                Количество поставщиков
                <input type="number" v-model.number="suppliers" min="1" max="99999" />
            </label>
            <label>
                Количество потребителей
                <input type="number" v-model.number="consumers" min="1" max="99999" />
            </label>
            <div class="btns-wrapper">
                <button @click="applySettings"> Применить </button>
                <button @click="resetTable"> Очистить таблицу </button>
            </div>
        </div>
    </div>
</template>


<style scoped>
.settings {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-top: 20px;
}

label {
    font-size: 17px;
    color: var(--text-color);
}

button {
    margin-left: 10px;
}

.btns-wrapper {
    display: flex;
    gap: 10px;
}
</style>