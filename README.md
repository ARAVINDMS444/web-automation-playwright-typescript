# Web Application Automation Framework

This Project is for developing Web Automation Playwright Framework from scratch and Automate the Test Cases for Web Application.

- Tool Used: Playwright
- Language Used: Typescript
- IDE Used: JetBrains Webstorm
- Version Control Used: GitHub
- CI/CD Used: GitHub

## Table of Contents

- [Installation](#installation)
- [Running Tests](#running-tests)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)

## Installation

1. Download Webstorm IDE.

2. Clone the repository:
   git clone https://github.com/ARAVINDMS444/web-automation-playwright-typescript.git

3. Navigate to the project directory:
   cd web-automation-playwright-typescript

4. Install Dependencies:

- Download and Install Node.js: Go to the Node.js website https://nodejs.org/en and download the installer for the latest LTS version.
- Add Node.js to PATH:
- Extract Node.js to your desired directory (e.g., C:\Users\Your_Name\AquaProjects\node-vXX.X.X-win-x64).
- Open "Environment Variables" from the system settings. Edit the "Path" variable and add the path to the Node.js directory.
- Restart JetBrains Aqua IDE to apply changes.
- Install Playwright using this command in terminal: npx playwright install

## Running Tests

To run the tests in your local machine, use this command: npx playwright test

## Folder Structure

- ├── .github/workflows/playwright.yml # CI/CD Pipeline script
- ├── .gitignore # Folders and files ignored by Git
- ├── tests # Test files
- ├── utils # Utility functions and modules
- ├── page-objects # Page Object files
- ├── fixtures # Fixtures used
- ├── playwright-report # Test reports
- ├── playwright.config.ts # Playwright configuration
- ├── package.json # Project metadata and scripts
- └── README.md # Project documentation

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

- Create your Feature Branch (git checkout -b feature/your_name/feature_name)
- Add your code and ensure it passes locally in both headed mode and headless mode.
- Check for any formatting errors by running this command in terminal: (npx prettier --write .)
- Commit your Changes (git commit -m 'Created/Updated the feature_name in feature_file_name')
- Push to the Branch (git push origin feature/your_name/feature_name)
- In GitHub, open a pull request and assign it to ARAVINDMS444 for review.
