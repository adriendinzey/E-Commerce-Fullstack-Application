# MERN E-Commerce App "The Sweet Tooths' Swale"

### [Try out the live project here](https://fullstack-e-commerce-mern-application.onrender.com/) (Note this link will take some time to load if the application has not been used recently)

[View demo video here](https://adriendinzey.github.io/images/E-Commerce%20Demo%20Video.mp4)

## About

This is a fully functional E-Commerce website where you can browse products, add them to your cart, make an account, place your order, pay with PayPal and then view your past orders as well.

## Technology

This project was created using the MERN stack, which is MongoDB on for data storage, Express.js/Node.js for creating the RESTful API backend and React on the frontend (using TypeScript/JavaScript and CSS).

## Run Locally

To view the live production version of the project simply use the link above.

To run this project locally start by cloning the repository. You'll need to set-up your own MongoDB cluster click the `CONNECT` and follow the instructions to connect by the Node.js MongoDB driver. Then inside the `backend` folder create a file titled `.env` and create a variable called `MONGODB_URI`, then pass the URI to your MongoDB server.

Finally, open a terminal window and at the root directory (the topmost folder of the repo) run

1. `npm run dev`
2. Send a `GET` request to `http://localhost:4040/api/seed` to iniitialize the database.
3. Navigate to `http://localhost:5173/` in your browser.

This will open the development version locally.
