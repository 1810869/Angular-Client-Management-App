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

## Setup

```bash
npm install
npm start
```

Open `http://localhost:4200/` in your browser.

## Testing

```bash
ng test
```

## Notes

- JSONPlaceholder is a read-only mock API. Edited client data and newly created posts are saved in the current browser session only.
- The app is implemented with standalone components and Angular signals for a lightweight architecture.
- The application includes a simple responsive layout, reusable page components, and a session-based cache for local updates.
