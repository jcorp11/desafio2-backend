import express from "express";
import { writeFile, readFile } from "fs/promises";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const PORT = 3500;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());

const getCanciones = async () => {
  const data = await readFile("repertorio.json", "utf-8");
  const canciones = JSON.parse(data);
  return canciones;
};

app.get("/", (req, res) => {
  console.log("enviado html");
  const filePath = join(__dirname, "..", "frontend", "index.html");
  console.log(filePath);
  res.sendFile(filePath);
});

app.get("/canciones", async (req, res) => {
  const canciones = await getCanciones();
  res.json(canciones);
});

app.listen(PORT, () => {
  console.log(`Desafio 2 app listening on port ${PORT}`);
});
