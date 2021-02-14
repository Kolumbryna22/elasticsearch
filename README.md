# My first project with elasticsearch

### steps:
```
npm install
```

You need to have a elasticsearch serwer running on port 9200

At first run make sure, that in file routes.js following lines:
```
const users = require('./seeds');
users.forEach((user) => {
  elasticClient.index({
    index: 'users',
    body: user
  });
});
```
are uncommented.

Then start application server:
```
npm run start
```

And make sure, that after starting server you commented following lines in file routes.js
```
const users = require('./seeds');
users.forEach((user) => {
  elasticClient.index({
    index: 'users',
    body: user
  });
});
```

These lines are responsible for users seeds to elasticsearch. I'm working on better solution.

You can see how search engine is working by endpoint:
```
get localhost:3000/api/v1/users
```

You can add searching parameter:
```
get localhost:3000/api/v1/users?user=Division
```
