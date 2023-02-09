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
/Sign-up

```json
{
    "username": "Mario",
    "password": "azert",
    "name": "Jean", //optional
    "isAdmin": true //optional (by default: false)
}
```

/Sign-in

```json
mettre le json body
```

/api/user

```json
mettre le json body
```

/api/user

```json
mettre le json body
```

/api/posts

```json
mettre le json body
```

/api/post/:uuid

```json
mettre le json body
```

/api/post

```json
mettre le json body
```

/api/post/:uuid

```json
mettre le json body
```

/api/post/:uuid

```json
mettre le json body
```

/api/post/:uuid/comment

```json
mettre le json body
```

/api/:uuid/comment/:uuid

```json
mettre le json body
```

/api/:uuid/comment/:uuid

```json
mettre le json body
```