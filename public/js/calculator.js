// Calculator functionality
class Calculator {
    constructor() {
        this.display = document.getElementById('result-display');
        this.operationDisplay = document.getElementById('operation-display');
        this.currentValue = '0';
        this.previousValue = null;
        this.operator = null;
        this.waitingForOperand = false;
        this.history = [];
        
        this.initializeEventListeners();
        this.updateDisplay();
    }

    initializeEventListeners() {
        // Number buttons
        document.querySelectorAll('.number-btn').forEach(button => {
            button.addEventListener('click', () => {
                const number = button.getAttribute('data-number');
                this.inputNumber(number);
            });
        });

        // Operator buttons
        document.querySelectorAll('.operator-btn').forEach(button => {
            button.addEventListener('click', () => {
                const operator = button.getAttribute('data-operator');
                this.inputOperator(operator);
            });
        });

        // Function buttons
        const clearBtn = document.getElementById('clear-btn');
        const equalsBtn = document.getElementById('equals-btn');
        const decimalBtn = document.getElementById('decimal-btn');
        const squareRootBtn = document.getElementById('square-root-btn');
        const squareBtn = document.getElementById('square-btn');
        const backspaceBtn = document.getElementById('backspace-btn');
        
        if (clearBtn) clearBtn.addEventListener('click', () => this.clear());
        if (equalsBtn) equalsBtn.addEventListener('click', () => this.calculate());
        if (decimalBtn) decimalBtn.addEventListener('click', () => this.inputDecimal());
        if (squareRootBtn) squareRootBtn.addEventListener('click', () => this.squareRoot());
        if (squareBtn) squareBtn.addEventListener('click', () => this.square());
        if (backspaceBtn) backspaceBtn.addEventListener('click', () => this.backspace());

        // Keyboard support
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    inputNumber(number) {
        if (this.waitingForOperand) {
            this.currentValue = number;
            this.waitingForOperand = false;
        } else {
            this.currentValue = this.currentValue === '0' ? number : this.currentValue + number;
        }
        this.updateDisplay();
    }

    inputOperator(nextOperator) {
        const inputValue = parseFloat(this.currentValue);

        if (this.previousValue === null) {
            this.previousValue = inputValue;
        } else if (this.operator) {
            const currentValue = this.previousValue || 0;
            const newValue = this.performCalculation(this.operator, currentValue, inputValue);

            this.currentValue = String(newValue);
            this.previousValue = newValue;
            this.updateDisplay();
        }

        this.waitingForOperand = true;
        this.operator = nextOperator;
    }

    inputDecimal() {
        if (this.waitingForOperand) {
            this.currentValue = '0.';
            this.waitingForOperand = false;
        } else if (this.currentValue.indexOf('.') === -1) {
            this.currentValue += '.';
        }
        this.updateDisplay();
    }

    clear() {
        this.currentValue = '0';
        this.previousValue = null;
        this.operator = null;
        this.waitingForOperand = false;
        this.updateDisplay();
        this.addToHistory('Clear', 'All cleared');
    }

    clearEntry() {
        this.currentValue = '0';
        this.updateDisplay();
    }

    backspace() {
        if (this.currentValue.length > 1) {
            this.currentValue = this.currentValue.slice(0, -1);
        } else {
            this.currentValue = '0';
        }
        this.updateDisplay();
    }

    calculate() {
        const inputValue = parseFloat(this.currentValue);

        if (this.previousValue !== null && this.operator) {
            const newValue = this.performCalculation(this.operator, this.previousValue, inputValue);
            const calculation = `${this.previousValue} ${this.getOperatorSymbol(this.operator)} ${inputValue} = ${newValue}`;
            
            this.currentValue = String(newValue);
            this.previousValue = null;
            this.operator = null;
            this.waitingForOperand = true;
            
            this.updateDisplay();
            this.addToHistory('Calculation', calculation);
        }
    }

    performCalculation(operator, firstValue, secondValue) {
        switch (operator) {
            case '+':
            case 'add':
                return firstValue + secondValue;
            case '-':
            case 'subtract':
                return firstValue - secondValue;
            case '*':
            case 'multiply':
                return firstValue * secondValue;
            case '/':
            case 'divide':
                if (secondValue === 0) {
                    this.showError('Cannot divide by zero');
                    return firstValue;
                }
                return firstValue / secondValue;
            case '^':
            case 'power':
                return Math.pow(firstValue, secondValue);
            default:
                return secondValue;
        }
    }

    squareRoot() {
        const value = parseFloat(this.currentValue);
        if (value < 0) {
            this.showError('Cannot calculate square root of negative number');
            return;
        }
        const result = Math.sqrt(value);
        this.currentValue = String(result);
        this.updateDisplay();
        this.addToHistory('Square Root', `√${value} = ${result}`);
    }

    square() {
        const value = parseFloat(this.currentValue);
        const result = Math.pow(value, 2);
        this.currentValue = String(result);
        this.updateDisplay();
        this.addToHistory('Square', `${value}² = ${result}`);
    }

    reciprocal() {
        const value = parseFloat(this.currentValue);
        if (value === 0) {
            this.showError('Cannot calculate reciprocal of zero');
            return;
        }
        const result = 1 / value;
        this.currentValue = String(result);
        this.updateDisplay();
        this.addToHistory('Reciprocal', `1/${value} = ${result}`);
    }

    getOperatorSymbol(operator) {
        const symbols = {
            '+': '+',
            '-': '-',
            '*': '×',
            '/': '÷',
            '^': '^',
            'add': '+',
            'subtract': '-',
            'multiply': '×',
            'divide': '÷',
            'power': '^'
        };
        return symbols[operator] || operator;
    }

    updateDisplay() {
        this.display.textContent = this.currentValue;
        // Update result display for API testing
        const resultDisplay = document.getElementById('result-display');
        if (resultDisplay) {
            resultDisplay.textContent = this.currentValue;
        }
    }

    addToHistory(operation, calculation) {
        this.history.unshift({
            timestamp: new Date().toLocaleTimeString(),
            operation,
            calculation
        });
        
        // Keep only last 10 entries
        if (this.history.length > 10) {
            this.history = this.history.slice(0, 10);
        }
        
        this.updateHistoryDisplay();
    }

    updateHistoryDisplay() {
        const historyContainer = document.getElementById('history-container');
        if (!historyContainer) return;

        if (this.history.length === 0) {
            historyContainer.innerHTML = `
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    No calculations yet. Start calculating to see history here.
                </div>
            `;
            return;
        }

        const historyHTML = this.history.map(entry => `
            <div class="result-item" data-testid="history-item">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <span class="result-label">${entry.operation}:</span>
                        <span class="result-value">${entry.calculation}</span>
                    </div>
                    <small class="text-muted">${entry.timestamp}</small>
                </div>
            </div>
        `).join('');

        historyContainer.innerHTML = historyHTML;
    }

    showError(message) {
        const alertContainer = document.createElement('div');
        alertContainer.className = 'alert alert-danger alert-dismissible fade show';
        alertContainer.innerHTML = `
            <i class="fas fa-exclamation-triangle me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        const container = document.querySelector('.container');
        container.insertBefore(alertContainer, container.firstChild);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            if (alertContainer.parentNode) {
                alertContainer.remove();
            }
        }, 5000);
    }

    handleKeyboard(event) {
        const key = event.key;
        
        if (key >= '0' && key <= '9') {
            this.inputNumber(key);
        } else if (key === '.') {
            this.inputDecimal();
        } else if (key === 'Enter' || key === '=') {
            event.preventDefault();
            this.calculate();
        } else if (key === 'Escape') {
            this.clear();
        } else if (key === 'Backspace') {
            this.backspace();
        } else if (key === '+') {
            this.inputOperator('add');
        } else if (key === '-') {
            this.inputOperator('subtract');
        } else if (key === '*') {
            this.inputOperator('multiply');
        } else if (key === '/') {
            event.preventDefault();
            this.inputOperator('divide');
        }
    }
}

// API Integration
class CalculatorAPI {
    constructor(calculator) {
        this.calculator = calculator;
        this.baseURL = '';
        this.initializeAPIButtons();
    }

    initializeAPIButtons() {
        const testAPIButton = document.getElementById('test-api');
        if (testAPIButton) {
            testAPIButton.addEventListener('click', () => this.testAPI());
        }

        const validateButton = document.getElementById('validate-expression');
        if (validateButton) {
            validateButton.addEventListener('click', () => this.validateExpression());
        }
    }

    async testAPI() {
        const a = parseFloat(this.calculator.currentValue) || 5;
        const b = parseFloat(this.calculator.previousValue) || 3;
        const operation = this.calculator.operator || 'add';

        try {
            const response = await fetch(`/api/calculator/${operation}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ a, b })
            });

            const result = await response.json();
            
            if (response.ok) {
                this.showAPIResult('success', `API Result: ${result.result}`, result);
                this.calculator.currentValue = String(result.result);
                this.calculator.updateDisplay();
            } else {
                this.showAPIResult('error', `API Error: ${result.error}`, result);
            }
        } catch (error) {
            this.showAPIResult('error', `Network Error: ${error.message}`, { error: error.message });
        }
    }

    async validateExpression() {
        const expression = `${this.calculator.previousValue || 0} ${this.calculator.getOperatorSymbol(this.calculator.operator || 'add')} ${this.calculator.currentValue}`;
        
        try {
            const response = await fetch('/api/calculator/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ expression })
            });

            const result = await response.json();
            
            if (response.ok) {
                this.showAPIResult('success', `Expression is valid: ${result.isValid}`, result);
            } else {
                this.showAPIResult('error', `Validation Error: ${result.error}`, result);
            }
        } catch (error) {
            this.showAPIResult('error', `Network Error: ${error.message}`, { error: error.message });
        }
    }

    showAPIResult(type, message, data) {
        const resultContainer = document.getElementById('api-results');
        if (!resultContainer) return;

        const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
        const icon = type === 'success' ? 'check-circle' : 'exclamation-triangle';
        
        const resultHTML = `
            <div class="alert ${alertClass} fade-in" data-testid="api-result">
                <i class="fas fa-${icon} me-2"></i>
                <strong>${message}</strong>
                <hr>
                <pre class="mb-0">${JSON.stringify(data, null, 2)}</pre>
            </div>
        `;

        resultContainer.innerHTML = resultHTML;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const calculator = new Calculator();
    const calculatorAPI = new CalculatorAPI(calculator);
    
    // Add some visual feedback
    document.querySelectorAll('.calculator-button').forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
    });
});
