// pages/api/upload.js
import nextConnect from "next-connect";
import multer from "multer";
import path from "path";

const upload = multer({
  storage: multer.diskStorage({
    destination: "./public/uploads", 
    filename: (req, file, cb) => {
      const name = Date.now() + "-" + file.originalname;
      cb(null, name);
    },
  }),
});

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(500).json({ error: `Erro: ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: "Método não permitido" });
  },
});

apiRoute.use(upload.single("file"));

apiRoute.post((req, res) => {
  // devolve o link público para o front
  const url = `/uploads/${req.file.filename}`;
  res.status(200).json({ url });
});

export const config = {
  api: {
    bodyParser: false, // multer cuida do form-data
  },
};

export default apiRoute;
