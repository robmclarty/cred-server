# Auth


## Login

**POST** `/auth`

### Request

```shell
curl \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"admin", "password":"password"}' \
  http://localhost:3000/auth
```

### Response

```json
{
  "ok": true,
  "message": "Login successful",
  "tokens": {
    "accessToken": "xxxxx.yyyyy.zzzzz",
    "refreshToken": "aaaaa.bbbbb.ccccc"
  }
}
```


## Refresh Auth Tokens

**POST** `/auth/refresh`

### Request

```shell
curl \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer aaaaa.bbbbb.ccccc" \
  http://localhost:3000/auth/refresh
```

### Response

```json
{
  "ok": true,
  "message": "Tokens refreshed",
  "tokens": {
    "accessToken": "xxxxx.yyyyy.zzzzz",
    "refreshToken": "aaaaa.bbbbb.ccccc"
  }
}
```


## Logout

**DELETE** `/auth`

### Request

```shell
curl \
  -X DELETE \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer aaaaa.bbbbb.ccccc" \
  http://localhost:3000/auth
```

### Response

```json
{
  "ok": true,
  "message": "Logged out",
  "revokedToken": "aaaaa.bbbbb.ccccc"
}
```


## Revoke Token

**DELETE** `/auth`

*ADMIN ONLY*

### Request

```shell
curl \
  -X DELETE \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer aaaaa.bbbbb.ccccc" \
  -d '{"token":"aaaaa2.bbbbb2.ccccc2"}' \
  http://localhost:3000/auth
```

### Response

```json
{
  "ok": true,
  "message": "Logged out",
  "revokedToken": "aaaaa2.bbbbb2.ccccc2"
}
```
