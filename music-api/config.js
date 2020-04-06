const path = require("path");

const rootPath = __dirname;

module.exports = {
  rootPath,
  uploadPath: path.join(rootPath, "public", "uploads"),
  database: 'mongodb://localhost/musicApp',
  databaseOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  },
  facebook: {
    appId: '221701545569664',
    appSecret: 'df3ca43cde562f71382c24c17cfd77ac'
  }
};