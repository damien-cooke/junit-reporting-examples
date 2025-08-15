// Data Processing functionality
class DataProcessor {
    constructor() {
        this.data = [];
        this.processedData = null;
        this.chart = null;
        this.baseURL = '';
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Sample data buttons
        document.getElementById('load-sample-1')?.addEventListener('click', () => this.loadSample1());
        document.getElementById('load-sample-2')?.addEventListener('click', () => this.loadSample2());
        document.getElementById('load-sample-3')?.addEventListener('click', () => this.loadSample3());
        document.getElementById('clear-data')?.addEventListener('click', () => this.clearData());

        // Processing buttons
        document.getElementById('process-data')?.addEventListener('click', () => this.processData());
        document.getElementById('validate-data')?.addEventListener('click', () => this.validateData());
        document.getElementById('sort-data')?.addEventListener('click', () => this.sortData());

        // Transformation buttons
        document.getElementById('double-data')?.addEventListener('click', () => this.doubleData());
        document.getElementById('square-data')?.addEventListener('click', () => this.squareData());
        document.getElementById('filter-data')?.addEventListener('click', () => this.filterData());
    }

    loadSample1() {
        const sample = Array.from({length: 10}, (_, i) => i + 1);
        this.setData(sample);
        this.showAlert('success', 'Sample data 1-10 loaded successfully!');
    }

    loadSample2() {
        const sample = Array.from({length: 20}, () => Math.floor(Math.random() * 100) + 1);
        this.setData(sample);
        this.showAlert('success', 'Random sample data (20 numbers) loaded successfully!');
    }

    loadSample3() {
        const sample = Array.from({length: 100}, () => Math.floor(Math.random() * 1000) + 1);
        this.setData(sample);
        this.showAlert('success', 'Large dataset (100 numbers) loaded successfully!');
    }

    clearData() {
        this.data = [];
        this.processedData = null;
        document.getElementById('data-input').value = '';
        this.clearResults();
        this.clearChart();
        this.showAlert('info', 'Data cleared successfully!');
    }

    setData(numbers) {
        this.data = numbers;
        document.getElementById('data-input').value = numbers.join(', ');
        this.clearResults();
        this.clearChart();
    }

    parseDataFromInput() {
        const input = document.getElementById('data-input').value.trim();
        if (!input) {
            this.showAlert('warning', 'Please enter some data first');
            return false;
        }

        try {
            const numbers = input.split(',')
                .map(str => parseFloat(str.trim()))
                .filter(num => !isNaN(num));

            if (numbers.length === 0) {
                this.showAlert('error', 'No valid numbers found in input');
                return false;
            }

            this.data = numbers;
            return true;
        } catch (error) {
            this.showAlert('error', 'Failed to parse input data');
            return false;
        }
    }

    async processData() {
        if (!this.parseDataFromInput()) return;

        try {
            this.showLoading(true);
            
            // Try API first
            const response = await fetch('/api/data/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: this.data })
            });

            if (response.ok) {
                this.processedData = await response.json();
                this.showAlert('success', 'Data processed successfully via API!');
            } else {
                throw new Error('API not available');
            }
        } catch (error) {
            // Fallback to local processing
            this.processedData = this.calculateStatistics(this.data);
            this.showAlert('success', 'Data processed successfully (local mode)!');
        } finally {
            this.showLoading(false);
            this.displayResults();
            this.createChart();
        }
    }

    calculateStatistics(data) {
        const sorted = [...data].sort((a, b) => a - b);
        const sum = data.reduce((acc, val) => acc + val, 0);
        const mean = sum / data.length;
        
        // Calculate median
        const mid = Math.floor(data.length / 2);
        const median = data.length % 2 === 0 
            ? (sorted[mid - 1] + sorted[mid]) / 2 
            : sorted[mid];

        // Calculate mode
        const frequency = {};
        data.forEach(num => frequency[num] = (frequency[num] || 0) + 1);
        const maxFreq = Math.max(...Object.values(frequency));
        const modes = Object.keys(frequency).filter(key => frequency[key] === maxFreq);
        const mode = modes.length === data.length ? null : modes.map(Number);

        // Calculate standard deviation
        const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / data.length;
        const standardDeviation = Math.sqrt(variance);

        return {
            count: data.length,
            sum,
            mean: Math.round(mean * 100) / 100,
            median,
            mode: mode && mode.length === 1 ? mode[0] : mode,
            min: Math.min(...data),
            max: Math.max(...data),
            range: Math.max(...data) - Math.min(...data),
            variance: Math.round(variance * 100) / 100,
            standardDeviation: Math.round(standardDeviation * 100) / 100,
            sorted: sorted
        };
    }

    async validateData() {
        if (!this.parseDataFromInput()) return;

        try {
            this.showLoading(true);
            
            const response = await fetch('/api/data/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: this.data })
            });

            let result;
            if (response.ok) {
                result = await response.json();
                this.showAlert('success', 'Data validated successfully via API!');
            } else {
                // Fallback to local validation
                result = this.performLocalValidation(this.data);
                this.showAlert('success', 'Data validated successfully (local mode)!');
            }

            this.displayValidationResults(result);
        } catch (error) {
            const result = this.performLocalValidation(this.data);
            this.displayValidationResults(result);
            this.showAlert('success', 'Data validated successfully (local mode)!');
        } finally {
            this.showLoading(false);
        }
    }

    performLocalValidation(data) {
        const hasNegatives = data.some(num => num < 0);
        const hasDecimals = data.some(num => num % 1 !== 0);
        const hasOutliers = this.detectOutliers(data);
        const duplicates = this.findDuplicates(data);

        return {
            isValid: true,
            hasNegatives,
            hasDecimals,
            hasOutliers: hasOutliers.length > 0,
            outliers: hasOutliers,
            duplicates: duplicates.length > 0,
            duplicateValues: duplicates,
            dataTypes: this.analyzeDataTypes(data)
        };
    }

    detectOutliers(data) {
        const sorted = [...data].sort((a, b) => a - b);
        const q1 = this.percentile(sorted, 25);
        const q3 = this.percentile(sorted, 75);
        const iqr = q3 - q1;
        const lowerBound = q1 - 1.5 * iqr;
        const upperBound = q3 + 1.5 * iqr;
        
        return data.filter(num => num < lowerBound || num > upperBound);
    }

    percentile(sorted, p) {
        const index = (p / 100) * (sorted.length - 1);
        const lower = Math.floor(index);
        const upper = Math.ceil(index);
        const weight = index % 1;
        
        return sorted[lower] * (1 - weight) + sorted[upper] * weight;
    }

    findDuplicates(data) {
        const seen = new Set();
        const duplicates = new Set();
        
        data.forEach(num => {
            if (seen.has(num)) {
                duplicates.add(num);
            } else {
                seen.add(num);
            }
        });
        
        return Array.from(duplicates);
    }

    analyzeDataTypes(data) {
        const integers = data.filter(num => Number.isInteger(num)).length;
        const floats = data.filter(num => !Number.isInteger(num)).length;
        const positives = data.filter(num => num > 0).length;
        const negatives = data.filter(num => num < 0).length;
        const zeros = data.filter(num => num === 0).length;
        
        return {
            integers,
            floats,
            positives,
            negatives,
            zeros
        };
    }

    sortData() {
        if (!this.parseDataFromInput()) return;

        const sorted = [...this.data].sort((a, b) => a - b);
        this.setData(sorted);
        this.showAlert('success', 'Data sorted successfully!');
    }

    doubleData() {
        if (!this.parseDataFromInput()) return;

        const doubled = this.data.map(num => num * 2);
        this.setData(doubled);
        this.showAlert('success', 'All values doubled successfully!');
    }

    squareData() {
        if (!this.parseDataFromInput()) return;

        const squared = this.data.map(num => num * num);
        this.setData(squared);
        this.showAlert('success', 'All values squared successfully!');
    }

    filterData() {
        if (!this.parseDataFromInput()) return;

        const threshold = parseFloat(document.getElementById('filter-value').value);
        if (isNaN(threshold)) {
            this.showAlert('warning', 'Please enter a valid filter threshold');
            return;
        }

        const filtered = this.data.filter(num => num > threshold);
        if (filtered.length === 0) {
            this.showAlert('warning', `No values found greater than ${threshold}`);
            return;
        }

        this.setData(filtered);
        this.showAlert('success', `Filtered to ${filtered.length} values greater than ${threshold}`);
    }

    displayResults() {
        const container = document.getElementById('results-container');
        if (!container || !this.processedData) return;

        const results = this.processedData;
        
        container.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <div class="result-item">
                        <span class="result-label">Count:</span>
                        <span class="result-value" data-testid="result-count">${results.count}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Sum:</span>
                        <span class="result-value" data-testid="result-sum">${results.sum}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Mean:</span>
                        <span class="result-value" data-testid="result-mean">${results.mean}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Median:</span>
                        <span class="result-value" data-testid="result-median">${results.median}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Mode:</span>
                        <span class="result-value" data-testid="result-mode">${Array.isArray(results.mode) ? results.mode.join(', ') : results.mode || 'No mode'}</span>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="result-item">
                        <span class="result-label">Minimum:</span>
                        <span class="result-value" data-testid="result-min">${results.min}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Maximum:</span>
                        <span class="result-value" data-testid="result-max">${results.max}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Range:</span>
                        <span class="result-value" data-testid="result-range">${results.range}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Variance:</span>
                        <span class="result-value" data-testid="result-variance">${results.variance}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Std Dev:</span>
                        <span class="result-value" data-testid="result-stddev">${results.standardDeviation}</span>
                    </div>
                </div>
            </div>
        `;
    }

    displayValidationResults(results) {
        const container = document.getElementById('results-container');
        if (!container || !results) return;

        const alertClass = results.isValid ? 'alert-success' : 'alert-warning';
        const icon = results.isValid ? 'check-circle' : 'exclamation-triangle';

        container.innerHTML = `
            <div class="alert ${alertClass}">
                <h5><i class="fas fa-${icon} me-2"></i>Validation Results</h5>
                <div class="row mt-3">
                    <div class="col-md-6">
                        <div class="result-item">
                            <span class="result-label">Has Negatives:</span>
                            <span class="result-value" data-testid="validation-negatives">${results.hasNegatives ? 'Yes' : 'No'}</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">Has Decimals:</span>
                            <span class="result-value" data-testid="validation-decimals">${results.hasDecimals ? 'Yes' : 'No'}</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">Has Outliers:</span>
                            <span class="result-value" data-testid="validation-outliers">${results.hasOutliers ? 'Yes' : 'No'}</span>
                        </div>
                        ${results.hasOutliers ? `
                        <div class="result-item">
                            <span class="result-label">Outliers:</span>
                            <span class="result-value">${results.outliers.join(', ')}</span>
                        </div>
                        ` : ''}
                    </div>
                    <div class="col-md-6">
                        <div class="result-item">
                            <span class="result-label">Has Duplicates:</span>
                            <span class="result-value" data-testid="validation-duplicates">${results.duplicates ? 'Yes' : 'No'}</span>
                        </div>
                        ${results.duplicates ? `
                        <div class="result-item">
                            <span class="result-label">Duplicate Values:</span>
                            <span class="result-value">${results.duplicateValues.join(', ')}</span>
                        </div>
                        ` : ''}
                        <div class="result-item">
                            <span class="result-label">Integers:</span>
                            <span class="result-value">${results.dataTypes.integers}</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">Floats:</span>
                            <span class="result-value">${results.dataTypes.floats}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    createChart() {
        if (!this.processedData) return;

        const ctx = document.getElementById('chart-container');
        if (!ctx) return;

        // Clear existing chart
        this.clearChart();

        // Create chart canvas
        const canvas = document.createElement('canvas');
        canvas.id = 'data-chart';
        canvas.width = 400;
        canvas.height = 200;
        ctx.innerHTML = '';
        ctx.appendChild(canvas);

        // Prepare chart data
        const data = this.data.slice(0, 50); // Limit to first 50 points for readability
        const labels = data.map((_, index) => `Point ${index + 1}`);

        this.chart = new Chart(canvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Data Values',
                    data: data,
                    borderColor: 'rgb(13, 110, 253)',
                    backgroundColor: 'rgba(13, 110, 253, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Data Visualization'
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Value'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Data Point'
                        }
                    }
                }
            }
        });
    }

    clearResults() {
        const container = document.getElementById('results-container');
        if (container) {
            container.innerHTML = `
                <div class="alert alert-info" role="alert">
                    <i class="fas fa-info-circle me-2"></i>
                    Process some data to see results here.
                </div>
            `;
        }
    }

    clearChart() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
        
        const container = document.getElementById('chart-container');
        if (container) {
            container.innerHTML = `
                <div class="text-center text-muted">
                    <i class="fas fa-chart-bar fa-4x mb-3"></i>
                    <p>Charts will appear here after processing data</p>
                </div>
            `;
        }
    }

    showAlert(type, message) {
        const alertContainer = document.createElement('div');
        alertContainer.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show`;
        alertContainer.innerHTML = `
            <i class="fas fa-${this.getAlertIcon(type)} me-2"></i>
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

    getAlertIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-triangle',
            'warning': 'exclamation-circle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    showLoading(show) {
        const buttons = document.querySelectorAll('button[data-testid^="process"], button[data-testid^="validate"]');
        buttons.forEach(button => {
            if (show) {
                button.disabled = true;
                button.innerHTML = '<span class="spinner me-2"></span>Processing...';
            } else {
                button.disabled = false;
                // Restore original button text
                if (button.id === 'process-data') {
                    button.innerHTML = '<i class="fas fa-chart-line me-1"></i>Analyze Data';
                } else if (button.id === 'validate-data') {
                    button.innerHTML = '<i class="fas fa-check-circle me-1"></i>Validate';
                }
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dataProcessor = new DataProcessor();
});
