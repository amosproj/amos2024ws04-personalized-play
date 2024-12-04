<h1 align="center">
  <img src="./media/logo-light.png#gh-light-mode-only" width="50%" />
  <img src="./media/logo-dark.png#gh-dark-mode-only" width="50%" />
  <br />
  <img src="https://badge.ttsalpha.com/api?icon=typescript&label=TypeScript&status=5.1.3&color=3178C6&iconColor=3178C6" alt="TypeScript"/>
  <img src="https://badge.ttsalpha.com/api?icon=nodedotjs&label=Node.js&status=20.14.0&color=5FA04E&iconColor=5FA04E" alt="Node.js"/>
  <img src="https://badge.ttsalpha.com/api?icon=npm&label=NPM&status=10.9.0&color=CB3837&iconColor=CB3837" alt="NPM"/>
  <img src="https://badge.ttsalpha.com/api?icon=expo&label=Expo&status=13.22.1&color=000020&iconColor=000020" alt="Expo"/>
  <br />
  <img src="https://badge.ttsalpha.com/api?icon=firebase&label=Firebase&status=13.23.0&color=DD2C00&iconColor=DD2C00" alt="Firebase"/>
  <img src="https://badge.ttsalpha.com/api?icon=react&label=React&status=18.2.0&color=61DAFB&iconColor=61DAFB" alt="React"/>
  <img src="https://badge.ttsalpha.com/api?icon=react&label=React%20Native&status=0.74.5&color=61DAFB&iconColor=61DAFB" alt="ReactNative"/>
</h1>

**CogniKids** is revolutionizing family playtime by combining neuroscience, mental health, and child development with advanced technology. Our AI agent offers personalized, interactive play experiences that adapt in real-time to your family's needs, using everyday items for sustainable fun.


## Core Dependencies

Before setting up the project, ensure you have the following core dependencies installed globally:

1. **Node.js** - `v20.14.0`  [Download Node.js](https://nodejs.org/)
2. **NPM** - `v10.9.0`  [Learn about NPM](https://www.npmjs.com/)
3. **Firebase CLI**     [Get Firebase CLI](https://firebase.google.com/docs/cli)
4. **Expo CLI**     [Install Expo CLI](https://docs.expo.dev/get-started/installation/)


> [!IMPORTANT]  
> **Log in to All Required CLIs**
> 
> - **Firebase CLI**: Log in to your Firebase account to ensure access to Firebase services and emulators.
> - **Expo CLI**: Log in with your Expo account to access development builds and deployment features.
>   
> **Verify Project Access for Each CLI**
> 
> - Make sure your Firebase and Expo accounts have the required permissions for this project. Lack of access can prevent essential functionalities like running emulators or deploying functions.
>   
> **Node Version Compatibility**
> 
> - Confirm your Node.js version is compatible (v20.14.0) to avoid issues with dependencies and ensure stable project performance.

## Repository Structure

Below is the organized structure of the project files and directories with sorted descriptions for each:

```plaintext

|
├── 📁 .github                    # GitHub workflows, issue, and PR templates
├── 📁 app                        # React Native mobile app code
├── 📁 backend                    # Firebase functions and genkit flows
├── 📁 media                      # README media
├── 📄 .gitignore                 
├── 📄 biome.json                 # Code lint and format config
├── 📄 LICENSE                    
├── 📄 README.md                  # Project overview and setup
|

```


## Contributing Guide

Thank you for contributing! Please follow these guidelines:

> [!TIP]
> - **Commit Message Format**:   
>   Use Semantic Commit Messages:
>   ```
>   <type>(<scope>): <subject>
>   ```
>   - **Examples:**
>     - **Feature:** `feat(auth): add user login functionality`
>     - **Bug Fix:** `fix(api): resolve 500 error on user creation`
>
> - **Pull Request Title Format**:   
>   Follow the same format as commit messages:
>   ```
>   <type>(<scope>): <subject>
>   ```
>   - **Examples:**
>     - **Feature:** `feat(auth): implement OAuth2 authentication`
>     - **Bug Fix:** `fix(ui): correct layout issue in user profile`
>
> - **Code Linting and Formatting**:   
>   Before submitting, run:
>   ```bash
>   npm run lint
>   
>   npm run format
>   ```
>   This ensures your code meets our standards.
>
> - **Documentation**:   
>   Please write documentation for your code changes in both the code (using comments) and markdown files to enhance clarity and maintainability.


> [!WARNING]
> ### Important Guidelines
> - **Semantic Pull Request Title is Mandatory**: Using a semantic title helps GitHub Actions categorize and label PRs automatically, which also aids in generating release notes.
> 
> - **Separate Pull Requests for Different Scopes**: Please try to open separate PRs for different scopes. This keeps changes organized and easier to review.


> [!NOTE]
> ### Pull Request Lifecycle
> 
> 1. **No Direct Push to `main` Branch**: Direct pushes to the main branch are not allowed to ensure code integrity.
> 
> 2. **Create a Sub-Branch**: Always create a new branch from the `main` branch for your changes. This keeps your work organized.
> 
> 3. **Make Your Changes**: Implement your changes in the newly created branch.
> 
> 4. **Open a Pull Request (PR)**: Open a PR following the established rules (semantic title, etc.).
> 
> 5. **GitHub Actions Trigger**:
>    - A comment will be created with instructions on how to check out the branch locally.
>    - Automatic labeling will be applied based on the PR title.
>    - The code linting and style workflow will run to check your code quality.
>    - If you make changes to the app, Expo updates will be triggered automatically, allowing maintainers to preview those changes using a development build.
>    - An Expo comment will include a QR code, so there’s no need to search for the updated build. Scan the QR code to access the latest version quickly.


## Getting Started

Set up and run the project locally by following each step carefully.

### Clone the Repository

- **Repository URL**: `git@github.com:amosproj/amos2024ws04-personalized-play.git`
- **Commands**:

  ```bash
  
  git clone git@github.com:amosproj/amos2024ws04-personalized-play.git
  
  cd amos2024ws04-personalized-play
  
  ```


### Set Up Environment Variables

Copy example environment files to configure your environment.

- **Commands**:
  
  ```bash
  
  cp .env.example .env
  
  ```

  - Repeat this command in directories like `backend` and `app` if they have their own `.env.example` files.
  - Customize each `.env` file as necessary for your local setup.


### Install Dependencies

Navigate to each directory (`backend` and `app`) and install dependencies.

- **Command**:
  
  ```bash
  
  npm install
  
  ```


### Install the Expo Developer Build

To test the mobile interface, download the Expo Developer build from [Expo.dev](https://expo.dev/accounts/cognikids/projects/cognikids/development-builds).


### Run the Project Locally

Each component has specific commands to start in development mode. Follow these steps:

#### Start the backend

- **Command** (from the `backend` directory):
  
  ```bash
  
  npm run dev
  
  ```

 This command starts all required processes, including:

  - Real-time compilation for Firebase Genkit flows.
  - Firebase functions in development mode with immediate application of code changes.
  - Firebase emulators to test backend services locally.
  - The Genkit Developer UI for managing and testing flows.

- **Production Option**:
  
  ```bash
  
  npm run build
  
  ```

  Use this command to build the backend without real-time updates if you’re not actively developing.


#### Start the Expo Dev Server

To view the project on a mobile device, start the Expo server from the `app` directory.

- **Command**:
  
  ```bash
  
  npm run dev
  
  ```

  This will start the Expo development server, enabling real-time updates on a connected device (e.g., Android emulator or physical device).


<p align="center">Creating with :heart: <b>CogniKids</b></p>
