# Client Manager

A small Angular Client Manager built with Angular 21 and the public JSONPlaceholder API.

## Features

- Client list with search filtering
- Client detail page with posts
- Edit client information with form validation
- Add new posts for a selected client
- Loading, empty, and error states
- Warning before leaving the edit page with unsaved changes
- Session persistence for edits and new posts using browser session storage

## Requirements

- Latest Node.js (https://nodejs.org/en/download) based on your operating system.
- Github (https://desktop.github.com/download/) for Windows or (https://central.github.com/deployments/desktop/desktop/latest/darwin) for MacOS.
- Code Editor (eg. VSCode, Neovim or EMacs)
  
## Setup

1. Create a folder on desktop.
2. Inside the folder, press Shift and right-click.
3. Choose 'Open Terminal'.
4. Add the following command:
```bash
npm install -g @angular/cli
```
5. Verify if the installation is successfull.
```bash
ng version
```
6. Clone the code using the command below:
```bash
git clone https://github.com/1810869/Angular-Client-Management-App.git
```
7. Open the folder in code editor and open the terminal.
8. Paste the command below to install dependencies.
```bash
npm install
```

Note 1: If some of the command didn't work, please restart the terminal.
Note 2: Make sure that all the requirements were installed correctly by check the version using command on terminal.

## Testing

On the terminal, use the command below to open the application as localhost:
```bash
ng serve --open
```

## Notes

- JSONPlaceholder is a read-only mock API. Edited client data and newly created posts are saved in the current browser session only.
- The app is implemented with standalone components and Angular signals for a lightweight architecture.
- The application includes a simple responsive layout, reusable page components, and a session-based cache for local updates.
