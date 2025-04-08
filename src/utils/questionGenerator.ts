// src/utils/questionGenerator.ts
import { Question, OperationType } from '../types';

// --- Helper Functions ---
const getRandomInt = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomOperation = (allowedOps: OperationType[]): OperationType => {
    const randomIndex = getRandomInt(0, allowedOps.length - 1);
    return allowedOps[randomIndex];
}

// --- Question Generation Logic ---
export const generateQuestion = (level: number): Question => {
    let num1: number;
    let num2: number;
    let answer: number;
    let questionText: string;
    let operation: OperationType = "+" as OperationType;
    let allowedOps: OperationType[] = ['+']; // Level 1 default

    // Define operations and number ranges per level
    switch (level) {
        case 1: // Simple Addition
            allowedOps = ['+'];
            num1 = getRandomInt(1, 10);
            num2 = getRandomInt(1, 10);
            break;
        case 2: // Addition, Subtraction (no negative results)
            allowedOps = ['+', '-'];
            num1 = getRandomInt(5, 25);
            num2 = getRandomInt(1, num1); // Ensure num2 <= num1 for subtraction
            break;
        case 3: // Add, Sub, Simple Multiplication
            allowedOps = ['+', '-', '*'];
            num1 = getRandomInt(2, 15);
            num2 = getRandomInt(2, 10);
            if (num1 < num2 && Math.random() > 0.5) { // Swap sometimes for subtraction
                [num1, num2] = [num2, num1];
            }
            break;
        case 4: // Add, Sub, Mult, Simple Division (integer result)
            allowedOps = ['+', '-', '*', '/'];
            if (Math.random() < 0.25) { // ~25% chance for division
                operation = '/';
                // Ensure integer division
                num2 = getRandomInt(2, 10);
                answer = getRandomInt(2, 10); // Generate the answer first
                num1 = num2 * answer; // Calculate num1 based on answer and num2
            } else {
                num1 = getRandomInt(5, 20);
                num2 = getRandomInt(2, 15);
                if (num1 < num2 && Math.random() > 0.5) {
                    [num1, num2] = [num2, num1];
                }
            }
            break;
        case 5: // All ops including Square & Percentage (simple)
            allowedOps = ['+', '-', '*', '/', '^', '%'];
            if (Math.random() < 0.15) { // ~15% chance for square
                operation = '^';
                num1 = getRandomInt(2, 12); // Base number
                num2 = 2; // Fixed exponent for square
            } else if (Math.random() < 0.15) { // ~15% chance for percentage
                operation = '%';
                // Simple percentages like 10%, 20%, 25%, 50%
                const percentages = [10, 20, 25, 50];
                num1 = percentages[getRandomInt(0, percentages.length - 1)];
                num2 = getRandomInt(2, 10) * (100 / num1) // Ensure num2 is easily divisible by (100/percentage)
                if (num2 < 10) num2 = num2 * 10; // Make the number a bit larger
                if (num2 === 0) num2 = 100; // Avoid 0 if calculation leads to it
            }
            else if (Math.random() < 0.15) { // ~15% chance for division
                operation = '/';
                num2 = getRandomInt(2, 12);
                answer = getRandomInt(2, 12);
                num1 = num2 * answer;
            } else {
                // Standard operations
                num1 = getRandomInt(10, 50);
                num2 = getRandomInt(2, 20);
                if (num1 < num2 && Math.random() > 0.5) {
                    [num1, num2] = [num2, num1];
                }
            }
            break;
        default: // Default to Level 1 for safety or higher levels
            allowedOps = ['+', '-', '*', '/', '^', '%']; // Allow all for levels > 5
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
                // Ensure positive result for subtraction
                if (num1 < num2) [num1, num2] = [num2, num1];
            }
            break; // Use default num1/num2 if no specific op chosen yet
    }

    // Determine operation if not set by specific logic (like division/square/%)
    if (!operation) {
        operation = getRandomOperation(allowedOps);
        // Ensure positive subtraction result if chosen randomly
        if (operation === '-' && num1 < num2) {
            [num1, num2] = [num2, num1]; // Swap them
        }
    }


    // Calculate answer and format text
    switch (operation) {
        case '+':
            answer = num1 + num2;
            questionText = `${num1} + ${num2} =`;
            break;
        case '-':
            // Ensure num1 is >= num2 if subtraction is chosen generally
            if (num1 < num2) [num1, num2] = [num2, num1];
            answer = num1 - num2;
            questionText = `${num1} - ${num2} =`;
            break;
        case '*':
            answer = num1 * num2;
            questionText = `${num1} × ${num2} =`; // Use multiplication sign
            break;
        case '/':
            // Division logic already ensured integer result and set num1, num2
            answer = num1 / num2;
            questionText = `${num1} ÷ ${num2} =`; // Use division sign
            break;
        case '^': // Square
            answer = Math.pow(num1, num2);
            questionText = `${num1}² =`; // Or ${num1}^${num2}
            break;
        case '%': // Percentage
            answer = (num1 / 100) * num2;
            questionText = `${num1}% of ${num2} =`;
            break;
        default: // Should not happen
            answer = 0;
            questionText = "Invalid operation";
    }

    // Basic float check (can be refined)
    if (!Number.isInteger(answer)) {
        answer = parseFloat(answer.toFixed(2)); // Round to 2 decimal places if needed
    }


    return {
        id: Date.now() + Math.random(), // Simple unique enough ID for this case
        text: questionText,
        answer: answer,
        operation: operation,
        level: level
    };
};
