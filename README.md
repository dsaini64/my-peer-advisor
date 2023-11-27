### myPeerAdvisor

myPeerAdvisor is a web application that allows students to look for
information about their classes and professors. It features reviews,
ratings and tags in order to help with class planning.

myPeerAdvisor is built using the MERN stack.

```plaintext
  +-----------+  Web Client
  |  React.js |
  +-----------+
       ||
  +-----------+  Server
  | Express.js |
  +-----------+ 
  |  Node.js   |
  +-----------+
       ||
  +-----------+  Database
  |  MongoDB  |
  +-----------+
```

For more information, see https://www.mongodb.com/languages/mern-stack-tutorial

### Quickstart

First, install Node and MongoDB.

From the root folder, run this to install all the Node modules
```sh
npm install
```

To create the database, first make sure that MongoDB is running after you installed it.
See https://www.mongodb.com/docs/manual/administration/install-community/ for how to
start MongoDB on different operating systems.

If you are using Ubuntu, you can run
```sh
sudo systemctl start mongod.service
sudo systemctl status mongod
```

Once MongoDB is running, we need to create the database. To do this, we need to
run the app.js inside the server folder at least once. From the root folder run
```sh
node server/app.js
```

The first time app.js runs it creates an empty database called 'omega' with the appropriate
professor, course, tag, and review schemas. To use a different name for the database
you can replace 'omega' in the following line in app.js
```js
await mongoose.connect('mongodb://127.0.0.1:27017/omega');
```

Now that we have an empty database, from the root folder, navigate to the folder with the data
```sh
cd data/real
```

Then run the following command if you are using the default database name
```sh
mongorestore dump
```

If you want to use a different name for your database, instead run
```sh
mongorestore --db your_alternative_db_name dump/omega/
```

### Deleting a database

From your terminal, run the MongoDB shell
```sh
mongosh
```

List all databases
```sh
show dbs
```

Select the detabase you want to delete
```sh
use database_name
```

Delete database
```sh
db.dropDatabase();
```
