# IPSSI - Express

## Installation
Install dependencies

```bash
$ pnpm i
```

Make sure you define `DATABASE_URL` in your `.env` file
Make sure you define `JWT_SECRET` in your `.env` file

Launch migration on you database

```bash
$ pnpm prisma migrate dev
```

## Development

```bash
$ pnpm dev
```


Launch Prisma studio 
```bash
$ pnpm prisma studio
```

## API Endpoint
/Sign-up (POST)

```json
{
    "username": "John",
    "password": "mypassword",
    "name": "Jean", //optional
    "isAdmin": true //optional (by default: false)
}
```

/Sign-in (POST)

```json
{
    "username": "John",
    "password": "mypassword"
}
```

/api/user (GET user info from token auth)

/api/user (PUT)

```json
{
    "name": "Johnny",
    "username": "John"
}
```

/api/user (DELETE)

```json
{
    "id": "4805eef2-4647-4135-a9e9-8e142b357e85"
}
```

/api/posts (GET)

```bash
Filter use: posts?from={timestamp}
```

/api/post/:uuid (GET)

/api/post (POST)

```json
{
    "name": "Title of post",
    "content": "Content of post" //optional
}
```

/api/post/:uuid (PUT)

```json
{
    "name": "Title of post",
    "content": "Content of post" // optional
}
```

/api/post/:uuid (DELETE)

/api/post/:uuid/comment (POST)

```json
{
    "description": "description of comment"
}
```

/api/:uuid/comment/:uuid (PUT)

```json
{
    "description": "description of comment"
}
```

- ![#f03c15](https://placehold.co/15x15/f03c15/f03c15.png) /api/:uuid/comment/:uuid (DELETE)