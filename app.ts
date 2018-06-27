import * as express from "express";
import * as ejs from "ejs";
import Request = express.Request;
import Response = express.Response;

const app = express();
const port = 3000;

app.use("/dist/public", express.static(`${__dirname}/public`));

app.engine('ejs', ejs.renderFile);

app.get("/chapter/1", (req: Request, res: Response) => {
  res.status(200).render('chapter1.ejs');
});

app.listen(port, (error: Error) => {
  if (error) {
    console.error(error);
  }

  console.log(`server start at http://localhost:${port}`);
});
