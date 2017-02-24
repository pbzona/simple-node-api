# Todo Tracker

This is a simple Node API that I'm building as a proof of concept (the concept being that I know how APIs work)

## Details

To install it, simply clone to the location of your choosing, and run `npm install`. To start the server, be sure you have a MongoDB server running (locally to the API), and run `npm start` from the installation directory.

The server and API are written in NodeJS. The data storage is handled by MongoDB, and data is modeled with Mongoose. Tests are run with Mocha, and assertions are done with Expect with some help from Supertest.

## Authentication

When you create a new user with a call to `POST /users`, the response will include an `x-auth` header, whose value is an access token. This header should be included in future calls for authentication, since most of the endpoints are specific to the current user and will return a 400 without it.

## Objects

- **User** - Someone with access to the database and their list of todos. It has values of `email`, an email address that acts as their username, `password`, which is used to log in and generate an access token, and `_id`, which is used to perform database queries.
- **Todo** - A task to be completed in the future. It has values of `text`, which describes the task to be completed, `completed`, a Boolean value that describes whether the task has been finished, `completedAt`, a Unix time stamp indicating when the task was completed, and `_id`, which is used for database queries.

## Endpoints

These are the endpoints for each HTTP method. Don't forget to set your Content-Type header to `application/json`!

### POST

- **/users** - Creates a new user, and returns an access token in the form of an `x-auth` header. The body of the request should be a JSON object containing values for `email` and `password`.
- **/users/login** - If you've already created a user, but are logged out (you've deleted your server-side access token), this method allows you to generate a new token. The body should be a JSON object containing the `email` and `password` values associated with your user. The response will contain an `x-auth` header with a new token, which you can use for authenticated requests.
- **/todos** - Creates a new todo for the current user. The body should be a JSON object containing a `text` value describing the task to be completed.

### GET

- **/users/me** - Returns information for the current user, except for their password of course.
- **/todos** - Returns all todo objects associated with the current authenticated user.
- **/todos/:id** - Gets information for a specific todo, indicated by its `_id` property in the URL.

### PUT

- **/todos/:id** - Updates the status of one of your todos. The URL should reference a specific todo item by its `_id` value, and the body should be a JSON object containing `"completed": true` or `"completed": false`. The `completedAt` property for the todo will be generated automatically.

### DELETE

- **/users/me/token** - Deletes the current user's server-side access token. Essentially, this is a logout call; once you delete your token, you can generate a new one by making a `POST /users/login` call as explained above.
- **/todos/:id** - Permanently deletes a todo, indicated by its `_id` value in the call, from the database.

## Configuration

To use the API, change the secrets in the `config.json` file. I've included random sample values so it can be installed and work out of the box, but these secrets should under no circumstances be used for your deployment.
