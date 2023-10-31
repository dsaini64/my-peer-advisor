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

To create the database, from the root folder, navigate to the folder with the test database dump

```sh
cd data/dummy
```

Then run the following command
```sh
mongorestore dbDump
```

If you want to use a different name for your database, instead run
```sh
mongorestore --db alternative_db_name dbDump/beta/
```

