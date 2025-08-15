# JUnit Testing Examples - Usage Guide

This repository provides a comprehensive Node.js application with extensive test coverage specifically designed for testing various JUnit reporting tools and formats.

## Quick Start

```bash
# Clone and setup
git clone <repository-url>
cd junit-reporting-examples
npm install

# Run tests with JUnit XML output
npm run test:junit

# Run tests with coverage and JUnit XML
npm run test:ci

# Use the test runner script
./run-tests.sh
```

## Test Report Outputs

The project generates several types of test reports:

### JUnit XML Reports
- **Location**: `test-results/junit.xml`
- **Format**: Standard JUnit XML format
- **Compatible with**: Jenkins, Azure DevOps, GitHub Actions, SonarQube, Allure, etc.

### Coverage Reports
- **HTML Report**: `coverage/lcov-report/index.html`
- **LCOV Format**: `coverage/lcov.info`
- **JSON Format**: `coverage/coverage-final.json`
- **Text Summary**: Displayed in terminal

## Test Scenarios Included

### 1. Unit Tests (`__tests__/unit/`)
- **Calculator.test.js**: Mathematical operations with edge cases
- **DataProcessor.test.js**: Array processing, filtering, validation
- **DateUtils.test.js**: Date manipulation and validation
- **User.test.js**: Model validation and business logic

### 2. Integration Tests (`__tests__/integration/`)
- **UserService.test.js**: Service layer with async operations
- **api.test.js**: HTTP API endpoint testing with supertest

### 3. End-to-End Tests (`__tests__/e2e/`)
- **workflows.test.js**: Complete user workflows and complex scenarios

### 4. Special Reporting Scenarios (`__tests__/special/`)
- **reporting-scenarios.test.js**: Specific test patterns for reporting tools:
  - Skipped tests
  - Pending/Todo tests
  - Tests with timeouts
  - Nested test suites
  - Parameterized tests
  - Performance tests
  - Mock/spy tests
  - Snapshot tests
  - Various Jest matchers

## Test Categories by Reporting Value

### ✅ Passing Tests
- Standard successful test scenarios
- Demonstrates green builds
- Performance benchmarks

### ❌ Failing Tests (Commented Out)
- Uncomment in `reporting-scenarios.test.js` to see failure scenarios
- Assertion failures
- Error throwing tests
- Timeout failures
- Multiple assertion failures

### ⏭️ Skipped Tests
- Tests marked with `test.skip()` or `describe.skip()`
- Conditional test skipping
- Tests marked as TODO

### ⏱️ Performance Tests
- Tests with timing assertions
- Large data processing tests
- Concurrent operation tests

### 🔄 Async Tests
- Promise-based tests
- Async/await patterns
- Callback-style tests

## Using with Different Reporting Tools

### Jenkins
```groovy
// Jenkinsfile example
pipeline {
    agent any
    stages {
        stage('Test') {
            steps {
                sh 'npm run test:ci'
            }
            post {
                always {
                    publishTestResults testResultsPattern: 'test-results/junit.xml'
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'coverage/lcov-report',
                        reportFiles: 'index.html',
                        reportName: 'Coverage Report'
                    ])
                }
            }
        }
    }
}
```

### GitHub Actions
```yaml
# Already included in .github/workflows/ci.yml
- name: Run tests
  run: npm run test:ci

- name: Publish Test Results
  uses: dorny/test-reporter@v1
  if: always()
  with:
    name: Jest Tests
    path: test-results/junit.xml
    reporter: jest-junit
```

### Azure DevOps
```yaml
# azure-pipelines.yml
- script: npm run test:ci
  displayName: 'Run tests'

- task: PublishTestResults@2
  inputs:
    testResultsFormat: 'JUnit'
    testResultsFiles: 'test-results/junit.xml'
    testRunTitle: 'Jest Tests'

- task: PublishCodeCoverageResults@1
  inputs:
    codeCoverageTool: 'Cobertura'
    summaryFileLocation: 'coverage/cobertura-coverage.xml'
    reportDirectory: 'coverage/lcov-report'
```

### SonarQube
```properties
# sonar-project.properties
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.testExecutionReportPaths=test-results/junit.xml
```

### GitLab CI
```yaml
# .gitlab-ci.yml
test:
  script:
    - npm run test:ci
  artifacts:
    reports:
      junit: test-results/junit.xml
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
```

## Customizing Test Scenarios

### Adding Failing Tests
Uncomment the failing tests in `__tests__/special/reporting-scenarios.test.js`:

```javascript
// Change this:
test.skip('assertion failure test', () => {
  expect(1 + 1).toBe(3);
});

// To this:
test('assertion failure test', () => {
  expect(1 + 1).toBe(3);
});
```

### Modifying Test Timeouts
Adjust timeouts in `jest.config.js`:

```javascript
testTimeout: 30000, // 30 seconds
```

### Customizing JUnit XML Output
Modify the jest-junit configuration in `jest.config.js`:

```javascript
['jest-junit', {
  outputDirectory: 'test-results',
  outputName: 'junit.xml',
  classNameTemplate: '{classname}',
  titleTemplate: '{title}',
  ancestorSeparator: ' › ',
  usePathForSuiteName: true,
  addFileAttribute: true,
  includeConsoleOutput: true
}]
```

## Test Data and Patterns

### Test Classification by Pattern
1. **Happy Path Tests**: Normal successful scenarios
2. **Edge Case Tests**: Boundary conditions and limits
3. **Error Path Tests**: Exception handling and validation
4. **Integration Tests**: Component interaction testing
5. **Performance Tests**: Load and timing validations

### Test Data Variety
- **Numbers**: Integers, floats, negative, zero, large numbers
- **Strings**: Empty, very long, special characters, Unicode
- **Arrays**: Empty, single item, large datasets
- **Objects**: Nested, missing properties, null values
- **Dates**: Past, future, invalid, edge dates
- **Async Operations**: Promises, callbacks, timeouts

## Troubleshooting

### Common Issues

#### Tests not generating JUnit XML
```bash
# Check if jest-junit is installed
npm list jest-junit

# Verify jest.config.js reporters configuration
# Ensure test-results directory exists
mkdir -p test-results
```

#### Coverage not being collected
```bash
# Check collectCoverageFrom in jest.config.js
# Ensure source files are in the correct location
# Verify coverage thresholds are not too high
```

#### Tests timing out
```bash
# Increase timeout in jest.config.js
# Check for async operations without proper awaiting
# Look for infinite loops or blocking operations
```

## Extending the Test Suite

### Adding New Test Categories
1. Create new test files in appropriate directories
2. Follow naming convention: `*.test.js` or `*.spec.js`
3. Use descriptive test names and nested describes
4. Include both positive and negative test cases

### Adding New Reporting Formats
1. Install additional Jest reporters
2. Update `jest.config.js` reporters array
3. Configure output directories and formats
4. Update CI/CD pipelines as needed

## Performance Considerations

- Large test suites may take longer to run
- Adjust `maxWorkers` in jest.config.js for parallel execution
- Use `--bail` flag to stop on first failure in CI environments
- Consider splitting test suites for faster feedback

## Contributing

When adding new tests, ensure they:
1. Have clear, descriptive names
2. Test both success and failure scenarios
3. Include appropriate assertions
4. Are properly categorized
5. Don't introduce flaky behavior

This project is designed to be a comprehensive testing ground for JUnit reporting tools. Feel free to customize and extend it for your specific reporting tool testing needs!
