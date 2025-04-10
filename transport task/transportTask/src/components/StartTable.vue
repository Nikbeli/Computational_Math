<script setup>
import TheSteps from "@/components/TheSteps.vue";
import { transportTaskAlgorithm } from "@/models/TransportTaskAlgorithm";
import { ref, computed } from "vue";

const props = defineProps({
    suppliers: {
        type: Number,
        required: true,
        default: 3
    },
    consumers: {
        type: Number,
        required: true,
        default: 3
    }
});


const columns = computed(() => 
    Array.from({ length: props.suppliers + 2 }, (_, k) => {
        if (k !== 0 && k !== props.suppliers + 1) return `Поставщик ${k}`;
        if (k === 0) return "";
        return "Запас";
    })
);

const tableData = computed(() => createMatrix(props.consumers + 1, props.suppliers + 1));

const steps = ref(null);
const errorMgs = ref(null);
const resultPath = ref(null);

// Решение
function handleSolve() {
    steps.value = null;
    errorMgs.value = null;
    resultPath.value = null;

    try {
        const res = transportTaskAlgorithm.start(tableData.value);
        steps.value = res;
        console.log("@", res);
        setResultPath(res)
    } catch (error) {
        console.error(error);
        errorMgs.value = error.message;
    }
}


function setResultPath(res) {
    const result = res[res.length - 1].table.costMatrix
        .flatMap((row, i) => 
            row.map((value, j) => value * res[res.length - 1].table.result[i][j])
    )
    .reduce((sum, value) => sum + value, 0);

    const expression = res[res.length - 1].table.costMatrix
      .flatMap((row, i) => 
        row.map((value, j) => `${value}*${res[res.length - 1].table.result[i][j]}`)
    ).join("+");

    resultPath.value = `S: ${expression} = ${result} ед.`;
}

function createMatrix(M, N) {
    let matrix = Array.from({ length: M }, () =>
        Array(N).fill(Math.floor(Math.random() * 10) + 1)
    );

    const numbers = [];
    // Заполняем элементы матрицы. Суммы правого столбца и нижней строки должны совпадать
    for (let i = 0; i < M - 1; i++) {
        const num = Math.floor(Math.random() * 10) + 1;
        matrix[i][N - 1] = num;
        numbers.push(num);
    }

    for (let j = 0; j < numbers.length; j++) {
        matrix[M - 1][j] = numbers[j];
    }

    return matrix;
}

</script>


<template>
    <main>
        <div class="scrollable-table">
            <table border="1">
                <thead>
                    <tr>
                        <th v-for="(column, colIndex) in columns" :key="'header-' + colIndex">
                            {{ column }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, rowIndex) in tableData" :key="'row-' + rowIndex">
                        <td v-if="rowIndex !== tableData.length - 1">
                            потребитель {{ rowIndex + 1 }}
                        </td>
                        <td v-else> Потребность</td>

                        <td v-for="(_, colIndex) in row" :key="'cell-' + rowIndex + '-' + colIndex">
                            <input v-if="rowIndex !== tableData.length - 1 || colIndex !== tableData[0].length - 1"
                                type="number" v-model.number="tableData[rowIndex][colIndex]" class="table-input" min="0"
                                max="99999" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <button @click="handleSolve" class="resh-btn">Решить</button>
        <p v-if="errorMsg">{{ errorMsg }}</p>

        <the-steps :steps="steps" />
        <div class="result-text-wrapper">
            <p v-if="resultPath" class="result-path">{{ resultPath }}</p>
            <p v-if="steps" class="result-path">
                Абсолютная погрешность:
                {{ steps[steps.length - 1].table.totalError }}
            </p>
        </div>
    </main>
</template>


<style lang="css" scoped>
.scrollable-table {
  max-height: 500px;
  overflow-y: auto;
  margin: 0 0 20px;
}

.step {
  margin-bottom: 30px;
  border: 1px solid var(--table-border);
  border-radius: 4px;
  padding: 10px;
  background-color: var(--input-bg);
}

.step h2 {
  color: var(--accent-color);
}

.cell-content {
  width: 100%;
  height: 100%;
}

.top-left {
  font-size: 12px;
  color: var(--text-color);
}

.bottom-right {
  font-size: 14px;
  color: var(--accent-color);
}

.result-path {
  font-size: 25px;
  word-wrap: break-word;
}

.table-input {
  text-align: center;
}

.resh-btn {
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 50px;
  font-size: 18px;
  display: flex;
  margin: 0 auto;
}

.result-text-wrapper {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
</style>