class TransportTaskAlgorithm {
    start(matrix) {
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++){
                if (matrix[i][j] < 0)
                    throw new Error(`Элемент ${matrix[i][j]} (координаты {${i + 1},${j + 1}}) не может быть отрицательным`);
            }
        }

    const rows = matrix.length - 1;
    const cols = matrix[0].length - 1;

    // Запас
    const supply = matrix.slice(0, rows).map(row => row[cols]);

    // Потребность
    const demand = matrix[rows].slice(0, cols);

    const demandSum = demand.reduce((acc, val) => acc + val, 0);
    const supplySum = supply.reduce((acc, val) => acc + val, 0);

    if (supplySum !== demandSum) {
        throw new Error(`Потребность и Запас должны равняться друг другу (потребность: ${demandSum}, запас: ${supplySum})`);
    }

    const costMatrix = matrix.slice(0, rows).map(row => row.slice(0, cols));

    let result = Array.from({ length: rows }, () => Array(cols).fill(0));
    let supplyCopy = [...supply];
    let demandCopy = [...demand];

    const errorMatrix = Array.from( {length: rows }, () => Array(cols).fill(0));

    const steps = [];

    while (true) {
        let minRow = -1, minCol = -1, minValue = Number.MAX_VALUE;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (costMatrix[i][j] < minValue && supplyCopy[i] > 0 && demandCopy[j] > 0) {
                    minValue = costMatrix[i][j];
                    minRow = i;
                    minCol = j;
                }
            }
        }

        if (minRow === -1 || minCol === -1) {
            break;
        }

        const amount = Math.min(supplyCopy[minRow], demandCopy[minCol]);
        result[minRow][minCol] = amount;

        supplyCopy[minRow] -= amount;
        demandCopy[minCol] -= amount;

        const deltaError = amount * minValue * (
            this.calculateError(amount) / Math.abs(amount) / Math.abs(minValue)
        );
        errorMatrix[minRow][minCol] = deltaError;

        steps.push({
            description: this.getDescription(amount, minRow, minCol, supplyCopy[minRow], demandCopy[minCol]),
            table: {
                costMatrix: JSON.parse(JSON.stringify(costMatrix)),
                result: JSON.parse(JSON.stringify(result)),
                supply: [...supplyCopy],
                demand: [...demandCopy],
            },
        });
    }

        steps.push({
            description: "Решение завершено.",
            table: {
                costMatrix: JSON.parse(JSON.stringify(costMatrix)),
                result: JSON.parse(JSON.stringify(result)),
                supply: [...supplyCopy],
                demand: [...demandCopy],
                errorMatrix,
                totalError: errorMatrix.reduce((acc, row) => {
                    return acc + row.reduce((sum, cell) => sum + cell, 0);
                }, 0)
            },
        });

        return steps;
    }

    getDescription(amount, minRow, minCol, currSupply, currDemand) {
        let res = `Поставляем ${amount} из ${minRow + 1}-го поставщика в ${minCol + 1}-го потребителя.`;

        if (currSupply === 0) res += ` Т.к. запас у Поставщика ${minRow + 1} закончился, закрашиваем строку`;
        if (currDemand === 0) res += ` Т.к. потнебность у Потребителя ${minRow + 1} закончилась, закрашиваем столбец`;
        return res;
    }

    calculateError(number) {
        // Преобразуем число в строку
        let numStr = String(number);

        // Проверяем, содержит ли число десятичную точку
        if (!numStr.includes('.')) {
            // Если число целое, погрешность считается равной 0.5
            return 0.5;
        }

        // Определяем позицию десятичной точки
        let decimalPosition = numStr.indexOf('.');

        // Количество знаков после десятичной точки
        let decimalPlaces = numStr.length - decimalPosition - 1;

        // Погрешность равна половине от 10^(-decimalPlaces)
        let error = Math.pow(10, -decimalPlaces) / 2;

        return error;
    }
}

export const transportTaskAlgorithm = new TransportTaskAlgorithm();