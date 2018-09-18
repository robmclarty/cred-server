# Permissions

## Create Single Permission Directly (admin only)

**POST** `/permissions`

### Request

```shell
curl \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer xxxxx.yyyyy.zzzzz" \
  -d '{"permission": { "userId":123, "resourceId":345, "actions":["action1", "action2", "action3"] }}' \
  http://localhost:3000/permissions
```

### Response

```json
{
  "ok": true,
  "message": "Permission created",
  "permission": {
    "id": 10,
    "userId": 123,
    "resourceId": 345,
    "actions": ["action1", "action2", "action3"],
    "updatedAt": "2018-09-12T19:59:20.419Z",
    "createdAt": "2018-09-12T19:59:20.419Z"
  }
}
```


## List All Permissions (admin only)

**GET** `/permissions`

### Request

```shell
curl \
  -X GET \
  -H "Authorization: Bearer xxxxx.yyyyy.zzzzz" \
  http://localhost:3000/permissions
```

### Response

```json
{
  "ok": true,
  "message": "Permissions found",
  "permissions": [
    {
      "id": 10,
      "userId": 123,
      "resourceId": 345,
      "actions": ["action1", "action2", "action3"],
      "updatedAt": "2018-09-12T19:59:20.419Z",
      "createdAt": "2018-09-12T19:59:20.419Z"
    },
    {
      "id": 11,
      "userId": 123,
      "resourceId": 899,
      "actions": ["action3", "action4"],
      "updatedAt": "2018-09-12T19:59:20.419Z",
      "createdAt": "2018-09-12T19:59:20.419Z"
    },
    {
      "id": 12,
      "userId": 124,
      "resourceId": 899,
      "actions": ["action1", "action5", "action8"],
      "updatedAt": "2018-09-12T19:59:20.419Z",
      "createdAt": "2018-09-12T19:59:20.419Z"
    }
  ]
}
```


## Create One or More Permissions for User (modifier only)

**POST** `/users/:user_id/permissions`

### Request

```shell
curl \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer xxxxx.yyyyy.zzzzz" \
  -d '{"permissions": { "myResourceName":["action1", "action2", "action3"], "myOtherResourceName":["action4", "action5"] }}' \
  http://localhost:3000/users/123/permissions
```

### Response

```json
{
  "ok": true,
  "message": "Permissions modified",
  "permissions": {
    "myResourceName": ["action1", "action2", "action3"],
    "myOtherResourceName":["action4", "action5"],
    "yetAnotherResource": ["action1", "action2"]
  }
}
```


## List All Permissions for User (admin/owner only)

**GET** `/users/:user_id/permissions`

### Request

```shell
curl \
  -X GET \
  -H "Authorization: Bearer xxxxx.yyyyy.zzzzz" \
  http://localhost:3000/users/123/permissions
```

### Response

```json
{
  "ok": true,
  "message": "Permissions found",
  "permissions": {
    "myResourceName": ["action1", "action2", "action3"],
    "myOtherResourceName":["action4", "action5"],
    "yetAnotherResource": ["action1", "action2"],
  }
}
```


## Append Existing Permissions (modifier only)

**PATCH** `/users/:user_id/permissions`

### Request

```shell
curl \
  -X PATCH \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer xxxxx.yyyyy.zzzzz" \
  -d '{"permissions": { "myResourceName":["action1", "action9"], "myOtherResourceName":["action5", "action6"] }}' \
  http://localhost:3000/users/123/permissions
```

### Response

```json
{
  "ok": true,
  "message": "Permissions updated",
  "permissions": {
    "myResourceName": ["action1", "action2", "action3", "action9"],
    "myOtherResourceName":["action4", "action5", "action6"],
    "yetAnotherResource": ["action1", "action2"],
  }
}
```


## Remove Existing Permissions (modifier only)

**DELETE** `/users/:user_id/permissions`

### Request

```shell
curl \
  -X DELETE \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer xxxxx.yyyyy.zzzzz" \
  -d '{"permissions": { "myResourceName":["action2", "not-an-action"], "myOtherResourceName":["action4"] }}' \
  http://localhost:3000/users/123/permissions
```

### Response

```json
{
  "ok": true,
  "message": "Permissions removed",
  "permissions": {
    "myResourceName": ["action1", "action3", "action9"],
    "myOtherResourceName":["action5", "action6"],
    "yetAnotherResource": ["action1", "action2"],
  }
}
```


## Get Single Permission Details (admin/owner only)

**GET** `/users/:user_id/permissions/:permission_id`

### Request

```shell
curl \
  -X GET \
  -H "Authorization: Bearer xxxxx.yyyyy.zzzzz" \
  http://localhost:3000/users/123/permissions/10
```

### Response

```json
{
  "ok": true,
  "message": "Permission found",
  "permission": {
    "id": 10,
    "userId": 123,
    "resourceId": 345,
    "actions": ["action1", "action2", "action3"],
    "updatedAt": "2018-09-12T19:59:20.419Z",
    "createdAt": "2018-09-12T19:59:20.419Z"
  }
}
```


## Modify and Existing Permission (modifier only)

**PATCH** `/users/:user_id/permissions/:permission_id`

### Request

```shell
curl \
  -X PATCH \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer xxxxx.yyyyy.zzzzz" \
  -d '{"permission": { "userId":123, "resourceId":300, "actions":["action2", "action3"] }}' \
  http://localhost:3000/users/123/permissions/10
```

### Response

```json
{
  "ok": true,
  "message": "Permission updated",
  "permission": {
    "id": 10,
    "userId": 123,
    "resourceId": 300,
    "actions": ["action2", "action3"],
    "updatedAt": "2018-09-12T19:59:20.419Z",
    "createdAt": "2018-09-12T19:59:20.419Z"
  }
}
```


## Destroy Single Permission (modifier only)

**DELETE** `/users/:user_id/permissions/:permission_id`

### Request

```shell
curl \
  -X DELETE \
  -H "Authorization: Bearer xxxxx.yyyyy.zzzzz" \
  http://localhost:3000/users/123/permissions/10
```

### Response

```json
{
  "ok": true,
  "message": "Permission removed",
  "numPermsRemoved": 1
}
```
