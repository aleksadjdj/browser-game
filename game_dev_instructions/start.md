

>npm install

// powerShall as admin 
> net start MongoDB

// start MongoDB Compass
// new connection game or check  in .end MONGO_URI
***********************************************************
if error on win
“*** immediate exit due to unhandled exception***”
“Access is denied.”
“System error 1067: The process terminated unexpectedly”
replace path 
C:\Program Files\MongoDB\Server\8.2\bin\mongod.cfg
dbPath: C:\Program Files\MongoDB\Server\8.2\data\db
to
dbPath: D:\MongoDb\data\db

save 
power shell admin start service 
>net start MongoDB
***********************************************************



// DB - seed db
>npm run seed

// DB - drop & seed
>npm run seed:drop

Running dev server
>npm run dev


// Browser:
// map editor
http://localhost:3000/editor
// game
http://localhost:3000

// dev to switch player 
http://localhost:3000/?id=player_uuid_1
http://localhost:3000/?id=player_uuid_2
