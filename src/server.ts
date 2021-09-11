import { app } from "./app";

const port = process.env.PORT || 3000;

const httpServer = app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);

module.exports = {
  app,
  httpServer
};