<div align = "center">

<img height=200px src="./public/images/logo.svg">

# NOTEBOOK - A new way to assignment

</div>

# Installation

- Clone the project

```bash
  git clone https://github.com/sandeepbanoula/NoteBook.git
```

- Go to the project directory

```bash
  cd NoteBook
```

- Install dependencies

```bash
  npm install
```

- Create .env file

```bash
  touch .env
```

- Start the server

```bash
  npm run start
```

### Edit .env file

- Add these variable to env files:

```bash
  GOOGLE_CLIENT_ID=Your Google app client ID.
  GOOGLE_CLIENT_SECRET=Your Google app client secret.
  APP_SESSIONS_SECRET=NoteBook is neccessary
```

- Google client Id and client secret is neccessary for user signup/login.

- How to get Google client ID and client secret:-
  https://developers.google.com/adwords/api/docs/guides/authentication#webapp

- Add Authorised JavaScript Origins:

```bash
  http://localhost:3000
```

- Add Authorised redirect URIs:

```bash
  http://localhost:3000/auth/google/notebook
```

## Contributors ✨

Contributions are always welcome!

<table>
  <tr>
    <td align="center"><a href="https://www.linkedin.com/in/sandeepbanoula/"><img src="https://avatars.githubusercontent.com/u/65235940?v=4" width="100px;" alt=""/><br /><sub><b>Sandeep Banoula</b></sub></a><br /></td>
  </tr>
</table>
