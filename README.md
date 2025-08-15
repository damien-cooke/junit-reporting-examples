# JUnit Reporting Examples

A comprehensive Node.js project designed to test various JUnit reporting tools with extensive test coverage including unit tests, integration tests, end-to-end tests, and browser automation with Playwright.

## Features

- **Express.js Backend**: REST API with calculator, user management, and data processing endpoints
- **Comprehensive Test Suite**: 200+ tests with mix of passing/failing scenarios for reporting validation
- **JUnit XML Output**: Compatible with all major CI/CD and reporting tools
- **Web UI**: Interactive frontend for browser automation testing
- **Playwright Integration**: Cross-browser testing with screenshots and video recording
- **GitHub Actions CI/CD**: Automated testing pipeline with artifact storage

## Project Structure

```
junit-reporting-examples/
├── src/                          # Source code
│   ├── app.js                   # Express application entry point
│   ├── routes/                  # API route handlers
│   ├── services/                # Business logic services
│   ├── models/                  # Data models
│   └── utils/                   # Utility functions
├── __tests__/                   # Jest test suites
│   ├── unit/                    # Unit tests
│   ├── integration/             # Integration tests
│   └── e2e/                     # End-to-end tests
├── tests/playwright/            # Playwright browser tests
├── public/                      # Web UI frontend
│   ├── css/                     # Stylesheets
│   ├── js/                      # Client-side JavaScript
│   └── *.html                   # HTML pages
├── test-results/                # Test output and artifacts
├── .github/workflows/           # CI/CD pipeline
└── docs/                        # Documentation
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd junit-reporting-examples
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npm run playwright:install
```

## Running the Application

### Development Server
```bash
npm run dev
```

### Production Server
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Web Interface

The application includes three main interfaces:

1. **Dashboard** (`/`) - Overview and navigation
2. **Calculator** (`/calculator.html`) - Interactive calculator with history
3. **User Management** (`/users.html`) - CRUD operations for users
4. **Data Processing** (`/data.html`) - Statistical analysis and visualization

## Testing

### Jest Unit/Integration Tests

```bash
# Run all Jest tests
npm test

# Run tests with JUnit XML output
npm run test:junit

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# CI mode with coverage and JUnit output
npm run test:ci
```

### Playwright Browser Tests

```bash
# Run all Playwright tests
npm run test:playwright

# Run tests with UI mode
npm run test:playwright:ui

# Run tests in headed mode (visible browser)
npm run test:playwright:headed

# Debug mode
npm run test:playwright:debug

# View test report
npm run test:playwright:report
```

### Run All Tests
```bash
npm run test:all
```

## Test Categories

### Unit Tests (Jest)
- **Calculator Tests**: Mathematical operations, error handling
- **User Model Tests**: Validation, data integrity
- **Utility Tests**: Date utilities, data processing functions
- **Service Tests**: Business logic validation

### Integration Tests (Jest)
- **API Route Tests**: Endpoint testing with Supertest
- **Service Integration**: Cross-service communication
- **Database Operations**: CRUD operations testing

### End-to-End Tests (Jest)
- **Workflow Tests**: Complete user scenarios
- **Error Handling**: Edge cases and error conditions
- **Performance Tests**: Load and stress testing

### Browser Tests (Playwright)
- **UI Functionality**: User interface interactions
- **Cross-Browser**: Chrome, Firefox, Safari, Edge
- **Responsive Design**: Mobile, tablet, desktop viewports
- **Visual Regression**: Screenshot comparisons
- **Accessibility**: A11y compliance testing
- **Performance**: Page load and interaction timing

## Test Reporting

### JUnit XML Output
Tests generate JUnit XML reports in `test-results/`:
- `junit.xml` - Jest test results
- `playwright-results.xml` - Playwright test results

### Coverage Reports
- HTML coverage report: `coverage/lcov-report/index.html`
- JSON coverage data: `coverage/coverage-final.json`

### Playwright Reports
- HTML report: `playwright-report/index.html`
- Test artifacts: `test-results/playwright-artifacts/`
- Screenshots: `test-results/screenshots/`
- Videos: Available for failed tests

## Screenshot and Video Recording

Playwright tests automatically capture:
- **Screenshots**: On test failure and at key interaction points
- **Videos**: Full test execution recording (on failure)
- **Traces**: Detailed execution traces for debugging

Screenshot locations:
- `test-results/screenshots/` - Manual screenshots
- `test-results/playwright-artifacts/` - Automatic failure screenshots

## CI/CD Integration

The project includes GitHub Actions workflows:

### Main CI Pipeline (`.github/workflows/ci.yml`)
- Runs on every push and pull request
- Executes Jest tests with JUnit output
- Runs Playwright tests across multiple browsers
- Generates coverage reports
- Stores test artifacts
- Publishes test results

### Test Artifacts
- JUnit XML files for reporting tools
- Coverage reports
- Playwright HTML reports
- Screenshots and videos
- Performance metrics

## API Endpoints

### Calculator API
- `POST /api/calculator/add` - Addition operation
- `POST /api/calculator/subtract` - Subtraction operation
- `POST /api/calculator/multiply` - Multiplication operation
- `POST /api/calculator/divide` - Division operation
- `POST /api/calculator/power` - Power operation
- `POST /api/calculator/validate` - Expression validation

### User Management API
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Data Processing API
- `POST /api/data/analyze` - Statistical analysis
- `POST /api/data/validate` - Data validation
- `POST /api/data/sort` - Sort data array
- `POST /api/data/transform` - Data transformation

## Test Configuration

### Jest Configuration (`jest.config.js`)
- Test environment setup
- Coverage collection
- JUnit reporter configuration
- Test file patterns

### Playwright Configuration (`playwright.config.js`)
- Browser configurations
- Test timeouts
- Screenshot/video settings
- Reporter configurations
- Base URL and server setup

## Intentional Test Failures

Some tests are designed to fail for demonstration purposes:
- Error handling scenarios
- Edge case validation
- Boundary condition testing
- Performance threshold testing

These failures help validate that reporting tools correctly capture and display test failures.

## Using with Reporting Tools

This project is designed to work with various test reporting tools:

### Supported Reporting Tools
- **Jenkins**: JUnit XML plugin
- **GitHub Actions**: Test reporting actions
- **Azure DevOps**: Test result publishing
- **TeamCity**: JUnit XML processing
- **Bamboo**: JUnit test parsing
- **CircleCI**: Test result collection
- **GitLab CI**: JUnit XML artifacts

### Integration Examples

#### Jenkins
```groovy
post {
    always {
        publishTestResults testResultsPattern: 'test-results/*.xml'
        publishHTML([
            allowMissing: false,
            alwaysLinkToLastBuild: true,
            keepAll: true,
            reportDir: 'playwright-report',
            reportFiles: 'index.html',
            reportName: 'Playwright Report'
        ])
    }
}
```

#### GitHub Actions
```yaml
- name: Publish Test Results
  uses: dorny/test-reporter@v1
  if: always()
  with:
    name: Test Results
    path: 'test-results/*.xml'
    reporter: java-junit
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For questions and support:
- Check the test output in `test-results/`
- Review Playwright reports for browser test details
- Examine Jest coverage reports for code coverage
- Use debugging modes for test development
