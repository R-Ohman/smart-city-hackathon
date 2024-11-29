# Smart City

## Project Purpose

The goal of the hackathon project is to create a platform for city's ecology assessment by gathering information about different measurement parameters. 

## Features

- **Map**
  User can view map with different informative layers and markers.
  Map is interactive, so user can click on it and see detailed information about specific parameters.
- **Search**:  
  User can type address and move to it, seeing detailed eco parameters about the place.
- **Map Layers**:  
  User can choose few layers of map: map of green areas, map of noises, map with air stations etc. 
- **Filtering**:  
  User can filter air stations by choosing air quality level.
- **Search Problematic Areas**:  
  User can search for green areas with specific parameters (IN DEVELOPMENT).

## Running the Project

### Frontend

To start the development server:

1. Go to `frontend/SmartCity/`.
2. Run `ng serve`.
3. Navigate to `http://localhost:4200/` in your browser.
4. The application will automatically reload when any source files are changed.

### Backend

1. Go to the root directory.
2. Create `.env` file in accordance to `.env.sample`.
3. Run `docker compose up -d --build`.
4. Navigate to `localhost:5051/docs` to see the API documentation.

## Implementation Details

- This project was built using [Angular CLI](https://github.com/angular/angular-cli) version 18.2.13. It is based on standalone components and leverages Angular's [signals](https://angular.dev/guide/signals) feature for efficient state management.
- The backend of the application was developed using [FastAPI](https://fastapi.tiangolo.com/).

## Authors

- [**@R-Ohman**](https://github.com/R-Ohman)
- [**@hannayuzefavich**](https://github.com/hannayuzefavich)
- [**@zakh-d**](https://github.com/zakh-d)
- [**@vetall7**](https://github.com/vetall7)

