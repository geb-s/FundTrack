# FundTrack

FundTrack is a personal finance management application that allows users to track their income, expenses, and overall financial health. It provides a user-friendly interface for managing transactions and tracking spending habits.

## Technologies and Frameworks

FundTrack is built using the following technologies and frameworks:

- Nuxt.js: A Vue.js framework for building server-side rendered and static websites.
- Vuetify: A Material Design component framework for Vue.js.
- Vue Chart.js: A Vue wrapper for Chart.js, a powerful charting library.

## Project Structure

The project follows a basic structure for a Nuxt.js application, which includes the following folders and files:

- **layouts**: Contains the layout files used to structure the different pages of the application.
- **middleware**: Contains middleware functions that run before rendering pages or groups of pages.
- **pages**: Contains the application's pages and routes.
- **static**: Contains static files that will be served directly without any processing (e.g., favicon.ico).
- **store**: Includes Vuex store files for managing the application's state.
- **nuxt.config.js**: Configuration file for Nuxt.js that allows you to customize various aspects of the application, such as modules, plugins, build configuration, etc.
- **package.json**: Lists the project's dependencies, scripts, and other metadata.

- **middleware/auth.js**: Handles authentication and ensures that only authenticated users can access certain routes.

## Installation

To set up the application locally, follow these steps:

1. Clone the repository: `git clone <repository-url>`
2. Navigate to the project directory: `cd FundTrack`
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`
5. Open your browser and visit: `http://localhost:3000`
