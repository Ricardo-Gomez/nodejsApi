## NodeJsApi
This repo is mainly used for training and will countinually grow with features that comes in mind or to try new design patterns and refactors.

the project currently exposes an endpoint to perform CRUD operations for a user resource.

------------
**GET /api/users/:ids**
>is used to fetch a list of users, `:ids` could be a single value, or list of comma separated values eg. 1,2,3. the api will first try to retrieve the resource from the local DB (mongo) if not found it will perform a remote fetch to `https://reqres.in/api/users/:id` and will return and save the users to the DB, if not found either a 404 error will be returned. If the `:ids` param is a list of values it will return successfully fetched users along with 404 errors if any within an array. Sorting is supported passing the sort_by=[key]&order=ASC | DESC query


------------
**POST /api/users**
>creates an user and stores it in the DB.

------------
**PUT /api/users/:id**
>updates a user given the id passed.

------------
**DELETE /api/users/:id**
>removes a stored user from the DB.

------------

## User object schema
```json
{
  id: "number",
  email: "string",
  first_name: "string",
  last_name: "string",
  company: "string",
  url: "string",
  text: "string",
}
```
## Environment variables
if you want to use .env file you can create it from the .env.example provided and run the project with the `npm run start` script, since the others rely on the pm2 module and has already defined the env variables in the ecosystem.config.js.

## Requirements
- MongoDb
- NodeJS 16.x

## Setup

- clone this repo
- `cd Nodejsapi`
- run `npm install`
- run `npm run start:dev`
