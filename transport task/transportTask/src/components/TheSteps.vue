<script setup>
import { excelReport } from "@/models/ExcelReport";

const props = defineProps({
    steps: {
        type: [Object, null],
        required: true
    }
});

function createExcel() {
    if (!props.steps) return;

    try{
        excelReport.start(props.steps);
    } catch (error) {
        console.log("Ошибка создания отчёта: ", error);
    }
}
</script>


<template>
    <div v-if="steps">
      <h1 class="title">Решение транспортной задачи</h1>
      <div v-for="(step, index) in steps" :key="index" class="step">
        <h2>Шаг {{ index + 1 }}: {{ step.description }}</h2>
        <div class="scrollable-table">
          <table>
            <thead>
              <tr>
                <th></th>
                <th v-for="(_, col) in step.table.costMatrix[0]" :key="'header-' + col">
                  Потребитель {{ col + 1 }}
                </th>
                <th>Запас</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, rowIndex) in step.table?.costMatrix" :key="'row-' + rowIndex">
                <td v-if="rowIndex !== step.table.costMatrix.length">
                  Поставщик {{ rowIndex + 1 }}
                </td>
                <td v-else>Потребность</td>
                <td
                  v-for="(cell, colIndex) in row"
                  :class="{
                    'locked-cell':
                      step.table.supply[rowIndex] === 0 || step.table.demand[colIndex] === 0
                  }"
                  :key="'cell-' + rowIndex + '-' + colIndex"
                >
                  <div class="cell-content">
                    <div class="top-left">{{ cell }}</div>
                    <div class="bottom-right">
                      {{
                        step.table.result[rowIndex][colIndex] > 0
                          ? step.table.result[rowIndex][colIndex]
                          : ""
                      }}
                    </div>
                  </div>
                </td>
                <td
                  :class="{
                    'locked-cell': step.table.supply[rowIndex] === 0
                  }"
                >
                  {{ step.table.supply[rowIndex] }}
                </td>
              </tr>
              <tr>
                <td></td>
                <td
                  v-for="d in step.table.demand"
                  :key="'demand-' + d"
                  :class="{
                    'locked-cell': d === 0
                  }"
                >
                  {{ d }}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <button type="button" v-on:click="createExcel" class="excel-button">
        Сохранить в Excel
      </button>
    </div>
  </template>
  
  <style scoped>
  .excel-button {
    margin: 0 0 30px;
  }
  
  .title {
    margin: 60px 0 10px;
  }
  
  .scrollable-table {
    max-height: 500px;
    overflow-y: auto;
    margin: 0 0 20px;
  }
  
  table {
    border-collapse: collapse;
    width: 100%;
    margin-top: 10px;
    background-color: var(--table-bg);
    color: var(--text-color);
  }
  th,
  td {
    border: 1px solid var(--table-border);
    text-align: center;
    padding: 10px;
  }
  
  thead th {
    background-color: var(--header-bg);
  }
  
  .locked-cell {
    background: #2e2e2e;
  }
  
  .cell-content {
    position: relative;
    width: 100%;
    height: 100%;
  }
  
  .top-left {
    position: absolute;
    top: 5px;
    left: 5px;
    font-size: 12px;
    color: var(--text-color);
  }
  
  .bottom-right {
    position: absolute;
    bottom: 5px;
    right: 5px;
    font-size: 14px;
    color: var(--accent-color);
  }
  </style>