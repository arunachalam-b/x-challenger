import { Question, OperationType } from '../types';

const getRandomInt = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomOperation = (allowedOps: OperationType[]): OperationType => {
    const randomIndex = getRandomInt(0, allowedOps.length - 1);
    return allowedOps[randomIndex];
}

export const generateQuestion = (level: number): Question => {
    let num1: number;
    let num2: number;
    let answer: number;
    let questionText: string;
    let operation: OperationType = "+" as OperationType;
    let allowedOps: OperationType[] = ['+'];

    switch (level) {
        case 1:
            allowedOps = ['+'];
            num1 = getRandomInt(1, 10);
            num2 = getRandomInt(1, 10);
            break;
        case 2:
            allowedOps = ['+', '-'];
            num1 = getRandomInt(5, 25);
            num2 = getRandomInt(1, num1);
            break;
        case 3:
            allowedOps = ['+', '-', '*'];
            num1 = getRandomInt(2, 15);
            num2 = getRandomInt(2, 10);
            if (num1 < num2 && Math.random() > 0.5) {
                [num1, num2] = [num2, num1];
            }
            break;
        case 4:
            allowedOps = ['+', '-', '*', '/'];
            if (Math.random() < 0.25) {
                operation = '/';
                num2 = getRandomInt(2, 10);
                answer = getRandomInt(2, 10);
                num1 = num2 * answer;
            } else {
                num1 = getRandomInt(5, 20);
                num2 = getRandomInt(2, 15);
                if (num1 < num2 && Math.random() > 0.5) {
                    [num1, num2] = [num2, num1];
                }
            }
            break;
        case 5:
            allowedOps = ['+', '-', '*', '/', '^', '%'];
            if (Math.random() < 0.15) {
                operation = '^';
                num1 = getRandomInt(2, 12);
                num2 = 2;
            } else if (Math.random() < 0.15) {
                operation = '%';
                const percentages = [10, 20, 25, 50];
                num1 = percentages[getRandomInt(0, percentages.length - 1)];
                num2 = getRandomInt(2, 10) * (100 / num1)
                if (num2 < 10) num2 = num2 * 10;
                if (num2 === 0) num2 = 100;
            }
            else if (Math.random() < 0.15) {
                operation = '/';
                num2 = getRandomInt(2, 12);
                answer = getRandomInt(2, 12);
                num1 = num2 * answer;
            } else {
                num1 = getRandomInt(10, 50);
                num2 = getRandomInt(2, 20);
                if (num1 < num2 && Math.random() > 0.5) {
                    [num1, num2] = [num2, num1];
                }
            }
            break;
        default:
            allowedOps = ['+', '-', '*', '/', '^', '%'];
            num1 = getRandomInt(10 + level, 50 + level * 2);
            num2 = getRandomInt(5 + level, 25 + level);
            if (Math.random() < 0.1) operation = '^';
            else if (Math.random() < 0.1) operation = '%';
            else if (Math.random() < 0.1) operation = '/';

            if (operation === '^') {
                num1 = getRandomInt(2, 10 + Math.floor(level / 2));
                num2 = 2;
            } else if (operation === '%') {
                const percentages = [10, 20, 25, 50];
                num1 = percentages[getRandomInt(0, percentages.length - 1)];
                num2 = getRandomInt(5, 10 + level) * (100 / num1);
                if (num2 === 0) num2 = 100 + level * 10;
            } else if (operation === '/') {
                num2 = getRandomInt(2, 10 + level);
                answer = getRandomInt(2, 10 + level);
                num1 = num2 * answer;
            } else if (operation === '-') {
                if (num1 < num2) [num1, num2] = [num2, num1];
            }
            break;
    }

    if (!operation) {
        operation = getRandomOperation(allowedOps);
        if (operation === '-' && num1 < num2) {
            [num1, num2] = [num2, num1];
        }
    }

    switch (operation) {
        case '+':
            answer = num1 + num2;
            questionText = `${num1} + ${num2} =`;
            break;
        case '-':
            if (num1 < num2) [num1, num2] = [num2, num1];
            answer = num1 - num2;
            questionText = `${num1} - ${num2} =`;
            break;
        case '*':
            answer = num1 * num2;
            questionText = `${num1} × ${num2} =`;
            break;
        case '/':
            answer = num1 / num2;
            questionText = `${num1} ÷ ${num2} =`;
            break;
        case '^':
            answer = Math.pow(num1, num2);
            questionText = `${num1}² =`;
            break;
        case '%':
            answer = (num1 / 100) * num2;
            questionText = `${num1}% of ${num2} =`;
            break;
        default:
            answer = 0;
            questionText = "Invalid operation";
    }

    if (!Number.isInteger(answer)) {
        answer = parseFloat(answer.toFixed(2));
    }


    return {
        id: Date.now() + Math.random(),
        text: questionText,
        answer: answer,
        operation: operation,
        level: level
    };
};
