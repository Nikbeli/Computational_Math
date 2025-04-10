import * as XLSX from "xlsx";

class ExcelReport {
    start(steps) {
        // Создаём новый wookbook
        const wb = XLSX.utils.book_new()

        // Данные для таблицы отчёта
        const ws_data = [];


        // Шаги отчёта
        steps.forEach((step, index) => {
            // Добавляем описание шага
            ws_data.push([`Шаг ${index + 1}: ${step.description}`]);

            //Добавляем таблицу с результатами
            ws_data.push([
                "Поставщик/Потребитель",
                ...step.table.demand.map((_, j) => `Потребитель ${j + 1}`)
            ]);

            // Выводим таблицу стоимости и остатки
            step.table.costMatrix.forEach((row, i) => {
                const rowData = [`Поставщик ${i + 1}`];
                row.forEach((value, j) => {
                    // Количество поставок
                    const supplyAmount = step.table.result[i][j];

                    // Цена пути + количество поставки
                    const cellValue = `${value} // ${supplyAmount}`;

                    rowData.push(cellValue);
                });

                // Добавляем остатки для поставщика
                rowData.push(`Остаток запаса: ${step.table.supply[i]}`);
                ws_data.push(rowData);
            });

            // Добавляем остатки для потребителей
            const demandRow = ["Остаток потребности"];
            step.table.demand.forEach((demand) => {
                demandRow.push(demand);
            });

            ws_data.push(demandRow);

            // Разделение шагов
            ws_data.push([]);
        });

        // Добавляем строку с итоговыми результатами
        ws_data.push(["Итоговые результаты"]);
        const result = steps[steps.length - 1].table.costMatrix
            .flatMap((row, i) =>
                row.map(
                    (value, j) => value * steps[steps.length - 1].table.result[i][j]
                )
            )
            .reduce((sum, value) => sum + value, 0);
        ws_data.push(["Цена пути:", result]);

        ws_data.push([
            "Общая погрешность:",
            steps[steps.length - 1].table.totalError
        ]);

        // Преобразуем данные в формат для Excel
        const ws = XLSX.utils.aoa_to_sheet(ws_data)

        // Добавляем лист в workbook
        XLSX.utils.book_append_sheet(wb, ws, "Отчёт")

        // Записываем файл
        XLSX.writeFile(wb, "transport_task_report.xlsx");
    }
}

export const excelReport = new ExcelReport();