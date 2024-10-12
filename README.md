# CozyDesk (Desktop-Simulated WebApp)

This project is a WebApp designed to simulate the experience of a desktop environment, with all functionalities developed around this core concept.

> I am currently refactoring the project; this is the second version of CozyDesk. Some features have been completed in this version. For a complete set of features, please refer to the [original project](https://cozydesk-861ed.web.app/).

## Test account

- Account: test@gmail.com
- Password: 123456

## Table of Contents

- [Features](#features)
  - [Desktop Windows](#desktop-windows)
  - [Music Player and Playlist](#music-player-and-playlist)
   - [Toaster Notifications](#toaster-notifications)
- [Frontend Technique](#frontend-technique)
- [Feature-Based Project Structure](#feature-based-project-structure)


## Features
### Desktop Windows

![window](/public/readme/window.gif)

Key Techniques: Compound Pattern, Custom Hooks, Context API, Debouncing

- Dragging and Resizing: 
  - Developed custom hooks (`useWindowDrag` and `useWindowResize`) to manage dragging and resizing behaviors.
  - Implemented boundary constraints by passing a container ref, ensuring windows stay within defined boundaries during both dragging and resizing operations.

- Customizable Draggable Area:
Utilized the **Compound Pattern**, allowing for the customization of draggable areas within the window component.

- Integrated a **debounce strategy** to enhance performance, ensuring that window position/size are updated only after the drag operation is completed, thereby reducing unnecessary server requests.

### Music Player and Playlist

![drop file](/public/readme/dropfile.gif)

Key Techniques: Audio Player from scratch, Drag-and-Drop File Upload, Contextual Menu Component

- Developed a fully functional music player from scratch, providing essential playback controls, including play, pause, stop, next, previous, and loop features.
- Enabled users to upload their music files by simply dragging and dropping them into the designated folder, automatically adding them to their personal playlist.
- The Contextual Menu component displays an overlay menu when users right-click on a target element, enabling context-specific actions. It’s built using the Compound Pattern for flexibility and ease of use.


### Toaster Notifications


![toaster](/public/readme/toaster.gif)

Key Techniques: Promise Toast, Queue Data Structure

- Developed a Toaster component to display various types of notifications (success, error, info, promise) using a **queue data structure**. This ensures that notifications are managed efficiently and displayed in the correct order.

- Implemented support for promise-based toasts, allowing notifications to update dynamically based on the resolution or rejection of a promise.

## Frontend Technique
### React(Functional component)
![react component](/public/readme/react-component.png)

### Redux Toolkit
- Managing global state and asynchronous requests efficiently with createAsyncThunk.

### TypeScript
- Ensuring type safety and improving code quality across the entire project.

### CSS Modules
- Using CSS Modules for scoped and maintainable styles, along with native CSS features like **nesting** and **@layer** for better structure and organization.

### Semantic HTML
Implementing semantic HTML elements to improve accessibility and code readability.

### Development Tools
- Vite
- Prettier and ESLint
    Integrated Prettier and ESLint for consistent code formatting and quality assurance.

### Cloud Services
- Firebase(Authentication, Cloud Storage, Firestore)
- Automated deployment to Firebase Hosting using GitHub Actions.


## Feature-Based Project Structure

    ├── app
    │   │   ├── hook.ts
    │   │   └── store.ts
    │   ├── assets
    │   ├── common
    │   ├── components
    │   │   ├── Contextmenu
    │   │   └── Menu
    │   ├── features
    │   │   ├── folder
    │   │   ├── music
    │   │   ├── toaster
    │   │   └── window
    │   │       ├── Window.module.css
    │   │       ├── Window.tsx
    │   │       ├── constants.ts
    │   │       ├── type.ts
    │   │       └── windowSlice.ts
    │   ├── layout
    │   └── services
    │       ├── auth.ts
    │       ├── core.ts
    │       ├── music.ts
    │       └── window.ts
    └── README.md