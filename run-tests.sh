#!/bin/bash

# Test runner script for JUnit Reporting Examples
# This script runs tests and generates various report formats

echo "🧪 JUnit Reporting Examples - Test Runner"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js to continue."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm to continue."
    exit 1
fi

print_status "Node.js version: $(node --version)"
print_status "npm version: $(npm --version)"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        print_error "Failed to install dependencies"
        exit 1
    fi
else
    print_status "Dependencies already installed"
fi

# Create test results directory
mkdir -p test-results

# Run tests with different configurations
print_status "Running test suite..."

# 1. Run basic tests
print_status "1. Running basic tests..."
npm test
BASIC_EXIT_CODE=$?

# 2. Run tests with JUnit output
print_status "2. Running tests with JUnit XML output..."
npm run test:junit
JUNIT_EXIT_CODE=$?

# 3. Run tests with coverage
print_status "3. Running tests with coverage..."
npm run test:coverage
COVERAGE_EXIT_CODE=$?

# 4. Run CI tests (coverage + junit)
print_status "4. Running CI tests (coverage + JUnit)..."
npm run test:ci
CI_EXIT_CODE=$?

# Generate summary
echo ""
echo "========================================"
echo "🧪 Test Run Summary"
echo "========================================"

if [ $BASIC_EXIT_CODE -eq 0 ]; then
    print_status "✅ Basic tests: PASSED"
else
    print_error "❌ Basic tests: FAILED (exit code: $BASIC_EXIT_CODE)"
fi

if [ $JUNIT_EXIT_CODE -eq 0 ]; then
    print_status "✅ JUnit tests: PASSED"
else
    print_error "❌ JUnit tests: FAILED (exit code: $JUNIT_EXIT_CODE)"
fi

if [ $COVERAGE_EXIT_CODE -eq 0 ]; then
    print_status "✅ Coverage tests: PASSED"
else
    print_error "❌ Coverage tests: FAILED (exit code: $COVERAGE_EXIT_CODE)"
fi

if [ $CI_EXIT_CODE -eq 0 ]; then
    print_status "✅ CI tests: PASSED"
else
    print_error "❌ CI tests: FAILED (exit code: $CI_EXIT_CODE)"
fi

# List generated reports
echo ""
print_status "Generated reports:"

if [ -f "test-results/junit.xml" ]; then
    print_status "📄 JUnit XML: test-results/junit.xml"
else
    print_warning "📄 JUnit XML: Not generated"
fi

if [ -d "coverage" ]; then
    print_status "📊 Coverage reports: coverage/"
    if [ -f "coverage/lcov-report/index.html" ]; then
        print_status "   📱 HTML report: coverage/lcov-report/index.html"
    fi
    if [ -f "coverage/lcov.info" ]; then
        print_status "   📋 LCOV report: coverage/lcov.info"
    fi
else
    print_warning "📊 Coverage reports: Not generated"
fi

# Final exit code
if [ $BASIC_EXIT_CODE -eq 0 ] && [ $JUNIT_EXIT_CODE -eq 0 ] && [ $COVERAGE_EXIT_CODE -eq 0 ] && [ $CI_EXIT_CODE -eq 0 ]; then
    print_status "🎉 All tests completed successfully!"
    exit 0
else
    print_error "💥 Some tests failed. Check the output above for details."
    exit 1
fi
