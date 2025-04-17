# Playwright API & Web Testing Framework

A comprehensive API & Web testing framework built with Playwright, TypeScript, and Allure reporting. This framework demonstrates various API testing capabilities including REST API interactions, data serialization, and file operations.

## 🚀 Features

- REST API testing with Playwright
- Type-safe request and response handling with TypeScript
- Data serialization (JSON, XML)
- CSV file operations
- Allure reporting integration
- Docker support for consistent test execution
- Parallel test execution capability- UI testing with Page Object Model
- End-to-end test scenarios for web applications
- Cross-browser testing support- UI testing with Page Object Model
- End-to-end test scenarios for web applications
- Cross-browser testing support

## 📋 Prerequisites

- Node.js (latest LTS version)
- Docker and Docker Compose
- Git

## 🛠️ Tech Stack

- Playwright
- TypeScript
- Allure Report
- Docker
- Node.js

## 🏗️ Project Structure

```
.
├── data/
│   ├── bookModel/
│   │   ├── Author.ts
│   │   ├── Editor.ts
│   │   └── Root.ts
│   ├── user.json
│   ├── userData.json 
│   ├── trnfRequest.xml
│   └── output.csv
├── helpers/
│   ├── helperFunctions.ts
│   └── userUtils.ts
├── pages/
│   ├── HomePage.ts
│   ├── LoginPage.ts
│   ├── RegistrationPage.ts
│   ├── ProductPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── tests/
│   ├── api/
│   │  ├── mock-api.spec.ts
│   │  └── booking-api.spec.ts
│   └── ui/
│       ├── guest-checkout.spec.ts
│       ├── login-checkout.spec.ts
│       └── registration.spec.ts
├── types/
│   └── user.ts
├── docker-compose.yml
├── Dockerfile
├── package.json
└── playwright.config.ts
```

## 🚀 Getting Started

### Local Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run tests locally:
   ```bash
   npm test
   ```

### Docker Setup

1. Build and run tests using Docker Compose:
   ```bash
   docker-compose up --build
   ```

2. View Allure reports:
   - Open http://localhost:5050/allure-docker-service/projects/default/reports/latest/index.html
   - API endpoint: http://localhost:5050

## 🧪 Test Suites

### UI Tests (Page Object Model)

#### 1. Guest Checkout Flow (`guest-checkout.spec.ts`)
- Complete checkout process as a guest user
- Dynamic test data generation using Faker
- Form filling and validation
- Order confirmation verification

#### 2. Login and Checkout (`login-checkout.spec.ts`)
- User login with registered credentials
- Product selection and cart management
- Checkout process with saved user data
- Order confirmation validation

#### 3. User Registration (`registration.spec.ts`)
- New user registration with dynamic data
- Password complexity validation
- Registration confirmation
- User data persistence for future tests

### API Tests

#### 1. User Management API
- POST user creation and response validation
- Response status code verification
- POST user creation and response va
#### 2. Booking API Tests
- Create booking with validation
- Update booking details
- Delete booking verification
- Booking token authentication- Response body structure validation
#### 2. Data Processing
- Data Serialization Tests
  - JSON serialization/deserialization of book objects
  - XML file reading and conversion
- CSV File Operations
  - Writing data to CSV files
  - Reading and validating CSV content
  - Data integrity verification

## 📊 Test Reports

The framework uses Allure for test reporting, providing:
- Detailed test execution results
- Test suite statistics
- Failed test analysis
- Test execution history

### Accessing Reports

1. After test execution, reports are available at:
   ```
   http://localhost:5050/allure-docker-service/projects/default/reports/latest/index.html
   ```

2. API endpoint for report data:
   ```
   http://localhost:5050
   ```

## 🔧 Configuration

### Playwright Configuration
Key configurations in `playwright.config.ts`:
- Test timeout settings
- Parallel execution options
- Reporter configurations
- Browser settings

### Docker Configuration
The `docker-compose.yml` includes:
- Playwright test container
- Allure report service
- Volume mappings for test results
- Network configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 Test Writing Guidelines

1. Follow the AAA pattern (Arrange, Act, Assert)
2. Use meaningful test descriptions
3. Implement proper error handling
### General Guidelines5. Maintain test independence
4. Maintain test independence
Example:
```typescript
test('should get user details from GET endpoint', async ({ request }) => {
### Page Object Model Implementation
The framework implements the Page Object Model (POM) design pattern for UI testing:

1. **Page Objects**: Each page has its own class that encapsulates the page's elements and actions
   ```typescript
   export class HomePage {
       constructor(private page: Page) {}
       
       async goto(path: string) {
           await this.page.goto(path);
       }
       
       async selectRandomProduct() {
           // Implementation
       }
   }
   ```

2. **Test Data Management**: 
   - Uses Faker.js for dynamic test data generation
   - Maintains user data in JSON files for registered users
   - Implements utility functions for data management

3. **Test Steps Organization**:
   ```typescript
   test('should complete checkout as guest user', async ({ page }) => {
       const homePage = new HomePage(page);
       const checkoutPage = new CheckoutPage(page);

       await test.step('Navigate to homepage', async () => {
           await homePage.goto('/');
       });

       await test.step('Complete checkout process', async () => {
           await checkoutPage.fillPersonalInformation(testData.user);
       });
   });
   ```
    const expectedStatus = 200;
    const endpoint = `${baseURL}/users?page=1`;

    // Act
    const response = await request.get(endpoint);
    const responseBody = await response.json();

    // Assert
    expect(response.status()).toBe(expectedStatus);
    expect(responseBody.data).toBeInstanceOf(Array);
});
```

## 🔍 Debugging

1. Use Playwright's debug mode:
   ```bash
   PWDEBUG=1 npm test
   ```

2. Docker container logs:
   ```bash
   docker logs playwright_automation
   docker logs allure_service
   ```

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Allure Framework](https://docs.qameta.io/allure/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🔐 Security

- Keep sensitive data in environment variables
- Don't commit credentials to version control
- Regularly update dependencies
- Use HTTPS for API endpoints

## ⚖️ License

This project is licensed under the MIT License - see the LICENSE file for details.