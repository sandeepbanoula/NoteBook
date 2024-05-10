<div align = "center">

<img height=200px src="./public/images/logo.svg">

# NOTEBOOK - A new way to assignment

</div>

# Requirements

- Node.js (lts version recommended)

```bash
  https://nodejs.org/
```

- XAMPP (for MySQL)

```bash
  https://www.apachefriends.org/download.html
```

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

- Create .env file

```bash
  touch .env
```

- Create database on MySql

```bash
  create database notebook_manager
```

- Start the server(after editing env)

```bash
  npm run start
```

- The database tables will be automatically created using Sequelize on very first run.

- Make sure to change view - 'asAdmin' in `nb_users` table after first login.

- Enjoy

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
    <td align="center"><a href="https://github.com/sandeepbanoula" target="_blank"><img src="https://avatars.githubusercontent.com/u/65235940?v=4" width="100px;" alt=""/><br /><sub><b>Sandeep Banoula</b></sub></a><br /></td>
    <td align="center"><a href="https://github.com/blehnk" target="_blank"><img src="https://avatars.githubusercontent.com/u/59351771?v=4" width="100px;" alt=""/><br /><sub><b>Asish Nath</b></sub></a><br /></td>
    <td align="center"><a href="https://github.com/himanshinegi23" target="_blank"><img src="https://avatars.githubusercontent.com/u/143116065?v=4" width="100px;" alt=""/><br /><sub><b>Himanshi Negi</b></sub></a><br /></td>
  </tr>
</table>
