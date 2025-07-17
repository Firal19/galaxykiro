# Testing Suite Documentation

This document provides an overview of the testing suite implemented for the Progressive Engagement Website.

## Testing Types

The testing suite includes:

1. **Unit Tests**: Tests for individual functions and components
2. **Integration Tests**: Tests for user journey flows and progressive capture
3. **End-to-End Tests**: Tests for critical conversion paths
4. **Performance Tests**: Tests for load and mobile optimization
5. **Accessibility Tests**: Tests for WCAG compliance

## Running Tests

### All Tests

To run all tests:

```bash
npm test
```

Or use the test runner script:

```bash
node scripts/run-tests.js
```

### Specific Test Types

To run specific test types:

```bash
# Unit tests
npm test -- --testPathPattern=unit

# Accessibility tests
npm test -- --testPathPattern=a11y

# Performance tests
npm test -- --testPathPattern=performance

# End-to-end tests
npm run test:e2e

# Integration tests
npm run test:e2e -- --spec "cypress/e2e/integration/**/*.cy.ts"

# Conversion path tests
npm run test:e2e -- --spec "cypress/e2e/conversion/**/*.cy.ts"
```

Or use the test runner script:

```bash
node scripts/run-tests.js unit
node scripts/run-tests.js a11y
node scripts/run-tests.js performance
node scripts/run-tests.js e2e
node scripts/run-tests.js integration
node scripts/run-tests.js conversion
```

## Test Coverage

The testing suite covers:

### Unit Tests

- Utility functions
- Assessment scoring algorithms
- Lead scoring engine
- Component rendering

### Integration Tests

- User journey flows
- Progressive information capture
- Form validation and submission
- Data persistence

### End-to-End Tests

- Lead capture conversion paths
- Webinar registration flows
- Office visit booking
- Soft membership registration

### Performance Tests

- Mobile page load times
- Core Web Vitals
- Assessment tool performance
- Form rendering and validation speed
- Content library pagination

### Accessibility Tests

- WCAG compliance for all components
- Keyboard navigation
- Screen reader compatibility
- Color contrast
- Focus management

## Test Reports

Test reports are generated in the `reports` directory after running tests.

## Continuous Integration

The testing suite is integrated with the CI/CD pipeline:

1. Unit and accessibility tests run on every pull request
2. Integration and end-to-end tests run on merge to main branch
3. Performance tests run on scheduled basis

## Adding New Tests

### Unit Tests

Add new unit tests in the appropriate file under `src/lib/__tests__/unit/`.

### Integration Tests

Add new integration tests in `cypress/e2e/integration/`.

### End-to-End Tests

Add new end-to-end tests in `cypress/e2e/conversion/`.

### Performance Tests

Add new performance tests in `src/lib/__tests__/performance/`.

### Accessibility Tests

Add new accessibility tests in `src/lib/__tests__/a11y/`.

## Best Practices

1. Write tests before implementing features (TDD)
2. Ensure all critical user flows are covered by tests
3. Maintain high test coverage (aim for 80%+)
4. Keep tests independent and idempotent
5. Use meaningful test descriptions
6. Mock external dependencies
7. Test edge cases and error scenarios