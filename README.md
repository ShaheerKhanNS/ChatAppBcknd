# Chat APP📲

Build using modern technologies

## Description

The app features users being able to send text messages and images, with the latter being done using AWS S3. Passwords are encrypted using the bcrypt library, and authentication is done through JSON Web Tokens. A password reset link is shared via email using the SendGrid API. Users can create groups, add friends, and make other users admins. The app uses a SQL database and Sequelize ORM, and old chats are moved to an archive using cron jobs. Additionally, the app is made real-time using Socket.IO.

### TechStacks

- Node.JS
- Express.JS
- SQL
- Sequelize ORM
- Axios
- Socket.IO
- AWS S3
- JavaScript
- HTML
- CSS
- BootStrap

#### NPM Packages

- uuid
- sequelize
- socket.io
- multer
- jsonwebtoken
- dotenv
- cron
- cors
- bcrypt
- body-parser
