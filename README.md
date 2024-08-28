# Book Library Manager App

## Overview

The **Book Library Manager App** is a web application developed to help manage the collection of books in a library. The application provides an intuitive interface to list, add, update, and delete books from the library's catalog. It leverages a pre-existing SQLite database for data storage and utilizes modern JavaScript frameworks and libraries to create a dynamic and interactive user experience.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Database Structure](#database-structure)
- [Additional Notes](#additional-notes)
- [License](#license)
- [Contact](#contact)

## Features

- **View Books**: List all books in the library's collection.
- **Add New Books**: Easily add new books to the library's collection.
- **Update Book Details**: Edit and update details of existing books.
- **Delete Books**: Remove books from the library's collection.
- **Search Functionality**: Search for books by title, author, or genre.
- **Data Persistence**: Uses SQLite and Sequelize ORM to maintain data consistency.

## Installation

To run this project locally, follow the instructions below:

1. **Clone the Repository:**
    ```bash
    git clone https://github.com/greatxrider/book-library-manager-app.git
    cd book-library-manager-app
    ```

2. **Install Dependencies:** Make sure you have Node.js installed on your machine. Then run:
    ```bash
    npm install
    ```

3. **Create a .env File: Create a .env** file at the root of the project directory and add the
    ```bash
    PORT=3000
    DATABASE_URL=sqlite:library.db
    ```

4. **Run Database Migrations (if any):**
    ```bash
    npx sequelize-cli db:migrate
    ```

5. **Start the Application**
    ```bash
    npm start
    ```

6. **Visit the Application in Your Browser:** Open your browser and navigate to 
    `http://localhost:3000`
   

## Usage

### Adding a New Book
1. Navigate to the "Add New Book" page.
2. Fill in the book details (Title, Author, Genre, Year Published, etc.).
3. Click the "Add Book" button to save the new entry.

### Updating a Book
1. Navigate to the "Book List" page.
2. Click the "Edit" button next to the book you want to update.
3. Modify the book details and click "Update Book" to save changes.

### Deleting a Book
1. Navigate to the "Book List" page.
2. Click the "Delete" button next to the book you want to remove.

## Technologies Used

- **JavaScript**: Primary programming language for backend logic and frontend interaction.
- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web framework for building the backend server.
- **Pug**: Template engine for rendering dynamic HTML pages.
- **SQLite**: Lightweight database engine for local storage.
- **Sequelize**: Promise-based Node.js ORM for SQL databases.
- **CSS**: Styling for the application interface.

## Project Structure

book-library-manager-app/
│
├── example-markup/           # HTML examples for reference
├── mockups/                  # Mockup images for visual reference
├── public/                   # Public folder containing stylesheets and static assets
│   └── styles.css            # Main stylesheet for the app
├── routes/                   # Route definitions for Express
│   └── index.js              # Main router file
├── views/                    # Pug templates for different pages
│   ├── layout.pug            # Main layout template
│   ├── index.pug             # Home page template
│   ├── books.pug             # Books list page template
│   ├── add-book.pug          # Add book page template
│   └── edit-book.pug         # Edit book page template
├── .gitignore                # Git ignore file
├── app.js                    # Main entry point for the application
├── library.db                # SQLite database file
├── package.json              # Project metadata and dependencies
└── README.md                 # Project documentation

## Database Structure

The application uses a simple SQLite database named `library.db` with a single table named `Books`. Below is the schema of the `Books` table:

| Column Name | Data Type | Description                       |
|-------------|-----------|-----------------------------------|
| `id`        | INTEGER   | Primary Key, Auto-incremented     |
| `title`     | TEXT      | Title of the book                 |
| `author`    | TEXT      | Author of the book                |
| `genre`     | TEXT      | Genre of the book                 |
| `year`      | INTEGER   | Year the book was published       |
| `createdAt` | DATE      | Date the record was created       |
| `updatedAt` | DATE      | Date the record was last updated  |

## Additional Notes

- **Make Sure to Use a `.gitignore` File**: Ensure that the `node_modules` folder is not tracked in your GitHub repository by adding it to the `.gitignore` file.
- **Regular Commits**: Make frequent commits to track the progress of your development and rollback changes if needed.
- **Debugging Tips**: Use `console.log()` statements and browser developer tools to debug and troubleshoot issues.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact

For any inquiries or questions, feel free to reach out:

- **GitHub**: [greatxrider](https://github.com/greatxrider)
- **Email**: daligdig.jephmari@gmail.com
