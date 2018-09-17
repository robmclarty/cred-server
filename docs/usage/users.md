# Users


## Register New Account

**POST** `/register`

Create a new user/account. Cannot have admin permissions.

### Request

```shell
curl \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"new-user", "password":"my-pass", "email":"user@email.com"}' \
  http:/localhost:3000/register
```

### Response

```json
{
  "ok": true,
  "message": "Registration successful",
  "user": {
    "id": 38,
    "username": "new-user",
    "email": "user@email.com",
    "isActive": true,
    "isAdmin": false,
    "permissions": {},
    "loginAt": "2018-09-12T19:59:20.419Z",
    "updatedAt": "2018-09-12T19:59:20.419Z",
    "createdAt": "2018-09-12T19:59:20.419Z"
  }
}
```


## Create New User (admin only)

**POST** `/users`

NOTE: Can also optionally include a `permissions` attribute to mass-assign
permissions at the same time as creation.

### Request

```shell
curl \
  -X POST \
  -H "Authorization: Bearer xxxxx.yyyyy.zzzzz" \
  -H "Content-Type: application/json" \
  -d '{"username":"new-user", "password":"my-pass", "email":"user@email.com"}' \
  http://localhost:3000/users
```

### Response

```json
{
  "ok": true,
  "message": "User created",
  "user": {
    "id": 35,
    "username": "new-user",
    "email": "user@email.com",
    "isActive": true,
    "isAdmin": false,
    "permissions": {},
    "loginAt": "2018-09-12T19:59:20.419Z",
    "updatedAt": "2018-09-12T19:59:20.419Z",
    "createdAt": "2018-09-12T19:59:20.419Z"
  }
}
```


## List All Users (admin only)

**GET** `/users`

### Request

```shell
curl \
  -X GET \
  -H "Authorization: Bearer xxxxx.yyyyy.zzzzz" \
  http://localhost:3000/users
```

### Response

```json
{
  "ok": true,
  "message": "Users found",
  "users": [
    {
      "id": 34,
      "username": "admin",
      "email": "admin@email.com",
      "isActive": true,
      "isAdmin": true,
      "permissions": {
        "resourceOne": ["admin", "permissions:modify", "action1", "action2"],
        "resourceTwo": ["admin", "action1", "action2"]
      },
      "loginAt": "2018-09-12T18:53:41.583Z",
      "updatedAt": "2018-09-10T20:05:20.869Z",
      "createdAt": "2018-09-10T20:05:20.869Z"
    },
    {
      "id": 33,
      "username": "first-user",
      "email": "firstuser@email.com",
      "isActive": true,
      "isAdmin": false,
      "permissions": {
        "resourceTwo": ["action1", "action2", "action3"]
      },
      "loginAt": "2018-09-10T20:05:20.869Z",
      "updatedAt": "2018-09-10T20:05:20.869Z",
      "createdAt": "2018-09-10T20:05:20.869Z"
    }
  ]
}
```


## Get User Details (admin/owner only)

**GET** `/users/:id`

### Request

```shell
curl \
  -X GET \
  -H "Authorization: Bearer xxxxx.yyyyy.zzzzz" \
  http://localhost:3000/users/33
```

### Response

```json
{
  "id": 33,
  "username": "first-user",
  "email": "firstuser@email.com",
  "isActive": true,
  "isAdmin": false,
  "permissions": {
    "resourceTwo": ["action1", "action2", "action3"]
  },
  "loginAt": "2018-09-10T20:05:20.869Z",
  "updatedAt": "2018-09-10T20:05:20.869Z",
  "createdAt": "2018-09-10T20:05:20.869Z"
}
```


## Modify User Details (admin/owner only)

**PATCH** `/users/:id`

Modify a user's details by sending a `user` object in the request body. Users
cannot modify their own permissions (nor modify their `isAdmin` property). Only
administrators (users with the `isAdmin` prop set to `true` may modify these
values. Admins may also provide a `permissions` property as part of the `user`
request payload and replace a user's permissions with new ones.

If a user tries to modify properties (such as `isAdmin` or `permissions`), for
which they aren't authorized to update, these properties will simply be ignored
and not modified.

**Regular User Update**

### Request

```shell
curl \
  -X PATCH \
  -H "Authorization: Bearer xxxxx.yyyyy.zzzzz" \
  -H "Content-Type: application/json" \
  -d '{"user":{ "username":"new-name", "isAdmin":true }}' \
  http://localhost:3000/users/33
```

### Response

```json
{
  "ok": true,
  "message": "User updated",
  "user": {
    "id": 33,
    "username": "new-name",
    "email": "firstuser@email.com",
    "isActive": true,
    "isAdmin": false,
    "permissions": {
      "resourceTwo": ["action1", "action2", "action3"]
    },
    "loginAt": "2018-09-10T20:05:20.869Z",
    "updatedAt": "2018-09-10T20:05:20.869Z",
    "createdAt": "2018-09-10T20:05:20.869Z"
  }
}
```

**Admin Update**

### Request

```shell
curl \
  -X PATCH \
  -H "Authorization: Bearer xxxxx.yyyyy.zzzzz" \
  -H "Content-Type: application/json" \
  -d '{"user":{ "username":"new-name", "isAdmin":true, "permissions": { "resourceTwo": ["action4", "action5"] } }}' \
  http://localhost:3000/users/33
```

### Response

```json
{
  "ok": true,
  "message": "User updated",
  "user": {
    "id": 33,
    "username": "new-name",
    "email": "firstuser@email.com",
    "isActive": true,
    "isAdmin": true,
    "permissions": {
      "resourceTwo": ["action4", "action5"]
    },
    "loginAt": "2018-09-10T20:05:20.869Z",
    "updatedAt": "2018-09-10T20:05:20.869Z",
    "createdAt": "2018-09-10T20:05:20.869Z"
  }
}
```


## Remove User (admin/owner only)

**DELETE** `/users/:id`

Users can delete their own accounts, but admins have the ability to delete any
user's account.

### Request

```shell
curl \
  -X DELETE \
  -H "Authorization: Bearer xxxxx.yyyyy.zzzzz" \
  http://localhost:3000/users/33
```

### Response

```json
{
  "ok": true,
  "message": "User removed",
  "numUsersRemoved": 1,
  "numPermsRemoved": 2
}
```
