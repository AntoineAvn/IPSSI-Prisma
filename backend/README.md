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
- (POST) /Sign-up

```json
{
    "username": "John",
    "password": "mypassword",
    "name": "Jean", //optional
    "isAdmin": true //optional (by default: false)
}
```

- (POST) /Sign-in

```json
{
    "username": "John",
    "password": "mypassword"
}
```

- (GET) /api/user

- (PUT) /api/user

```json
{
    "id": "uuid",
    "name": "Johnny",
    "username": "John"
}
```

- (DELETE) /api/user

```json
{
    "id": "4805eef2-4647-4135-a9e9-8e142b357e85"
}
```

- (GET) /api/posts

```bash
Filter use: posts?from={timestamp}
```

- (GET) /api/post/:uuid

- (POST) /api/post

```json
{
    "name": "Title of post",
    "content": "Content of post" //optional
}
```

- (PUT) /api/post/:uuid

```json
{
    "name": "Title of post",
    "content": "Content of post" // optional
}
```

- (DELETE) /api/post/:uuid

- (POST) /api/post/:uuid/comment

```json
{
    "description": "description of comment"
}
```

- (PUT) /api/:uuid/comment/:uuid

```json
{
    "description": "description of comment"
}
```

- (DELETE) /api/:uuid/comment/:uuid 