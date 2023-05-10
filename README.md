# auto-cli
automatically generate an express server and command line interface frontend from Sequelize models for Postgres

## Example Usage
```
npm run ./server/add-table --name accounts --attributes name:string,account_number:string,description:string,balance:integer
```
<p align="center">
  <img src="https://github.com/evans-tim/auto-cli/assets/62822134/10b5a7a6-e0bd-46ff-a009-c23ef10e0361" alt="cli example"/>
</p>

Note: 
- cli requires ./server/index.js to be running
- postgres config in ./server/config/config.json
