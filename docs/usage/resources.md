# Resources


## Create New Resource

**POST** `/resources`

### Request

```shell
curl \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer xxxxx.yyyyy.zzzzz" \
  -d '{"resource": { "name":"My Resource", "url":"https://my.resource.com", "actions":["action1", "action2", "action3"] }}' \
  http://localhost:3000/resources
```

### Response

```json
{
  "ok": true,
  "message": "Resource created",
  "resource": {
    "id": 123,
    "name": "My Resource",
    "url": "https://my.resource.com",
    "actions": ["action1", "action2", "action3"],
    "isActive": true,
    "updatedAt": "2018-09-12T19:59:20.419Z",
    "createdAt": "2018-09-12T19:59:20.419Z"
  }
}
```


## List All Resources

**GET** `/resources`

```shell
curl \
  -X GET \
  -H "Authorization: Bearer xxxxx.yyyyy.zzzzz" \
  http://localhost:3000/resources
```

### Response

```json
{
  "ok": true,
  "message": "Resources found",
  "resources": [
    {
      "id": 123,
      "name": "My Resource",
      "url": "https://my.resource.com",
      "actions": ["action1", "action2", "action3"],
      "isActive": true,
      "updatedAt": "2018-09-12T19:59:20.419Z",
      "createdAt": "2018-09-12T19:59:20.419Z"
    },
    {
      "id": 456,
      "name": "Another Resource",
      "url": "https://another.resource.com",
      "actions": ["action1", "action2", "action3"],
      "isActive": true,
      "updatedAt": "2018-09-12T19:59:20.419Z",
      "createdAt": "2018-09-12T19:59:20.419Z"
    },
    {
      "id": 789,
      "name": "Yet Another Resource",
      "url": "https://yetanother.resource.com",
      "actions": ["action1", "action2", "action3"],
      "isActive": false,
      "updatedAt": "2018-09-12T19:59:20.419Z",
      "createdAt": "2018-09-12T19:59:20.419Z"
    }
  ]
}
```


## Get Resource Details

**GET** `/resources/:id`

```shell
curl \
  -X GET \
  -H "Authorization: Bearer xxxxx.yyyyy.zzzzz" \
  http://localhost:3000/resources/123
```

### Response

```json
{
  "ok": true,
  "message": "Resource found",
  "resource": {
    "id": 123,
    "name": "My Resource",
    "url": "https://my.resource.com",
    "actions": ["action1", "action2", "action3"],
    "isActive": true,
    "updatedAt": "2018-09-12T19:59:20.419Z",
    "createdAt": "2018-09-12T19:59:20.419Z"
  }
}
```


## Modify Resource

**PATCH** `/resources/:id`

```shell
curl \
  -X PATCH \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer xxxxx.yyyyy.zzzzz" \
  -d '{"resource": { "name":"My Renamed Resource" }}' \
  http://localhost:3000/resources/123
```

### Response

```json
{
  "ok": true,
  "message": "Resource updated",
  "resource": {
    "id": 123,
    "name": "My Renamed Resource",
    "url": "https://my.resource.com",
    "actions": ["action1", "action2", "action3"],
    "isActive": true,
    "updatedAt": "2018-09-12T19:59:20.419Z",
    "createdAt": "2018-09-12T19:59:20.419Z"
  }
}
```


## Remove Resource

**DELETE** `/resources/:id`

```shell
curl \
  -X DELETE \
  -H "Authorization: Bearer xxxxx.yyyyy.zzzzz" \
  http://localhost:3000/resources/123
```

### Response

```json
{
  "ok": true,
  "message": "Resource removed",
  "numResourcesRemoved": 1
}
```
