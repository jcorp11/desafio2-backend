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

app.post("/canciones", async (req, res) => {
  const cancion = req.body;
  if (!cancion.titulo) {
    res.status(400).json({ message: "Cancion Vacia" });
  } else {
    const canciones = await getCanciones();
    canciones.push(cancion);
    await writeFile("repertorio.json", JSON.stringify(canciones));
    res.json(cancion);
  }
});

app.put("/canciones/:id", async (req, res) => {
  const { id } = req.params;
  const cancion = req.body;
  const canciones = await getCanciones();
  const index = canciones.findIndex((c) => c.id == id);
  canciones[index] = cancion;
  await writeFile("repertorio.json", JSON.stringify(canciones));
  res.json(canciones);
});

app.delete("/canciones/:id", async (req, res) => {
  const { id } = req.params;
  let canciones = await getCanciones();
  const cancion = canciones.find((c) => c.id == id);
  if (!cancion) {
    return res.status(404).json({ message: "Cancion no encontrada" });
  }

  canciones = canciones.filter((c) => c.id != id);
  await writeFile("repertorio.json", JSON.stringify(canciones));
  res.json(canciones);
});

app.listen(PORT, () => {
  console.log(`Desafio 2 listening on port ${PORT}`);
});
