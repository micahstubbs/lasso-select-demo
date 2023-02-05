import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.post("/api/v1/lasso", (req, res) => {
  const lassoCoordinates = req.body;

  console.log("lasso coordinates received", lassoCoordinates.length);
  res.status(200).send({
    message: `${lassoCoordinates.length} Lasso coordinate pairs received:`,
    success: true,
    body: req.body,
  });
});

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
