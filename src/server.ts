import express from "express";
import "express-async-errors";
import morgan from "morgan";
import multer from "multer";
import {
  getAll,
  getOneById,
  create,
  updateById,
  deleteById,
  createImage,
} from "./controller/planets.js";

import { logIn, signUp, getAllUsers, getUser } from "./controller/users.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });
const app = express();
const port = 3000;

app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("static"));

app.use(morgan("dev"));
app.use(express.json());

app.get("/api/planets", getAll);
app.get("/api/planets/:id", getOneById);

app.get("/api/users", getAllUsers);
app.get("/api/users/:id", getUser);

app.post("/api/planets", create);
app.post("/api/planets/:id/image", upload.single("image"), createImage);
app.post("/api/users/login", logIn);
app.post("/api/users/signup", signUp);

app.put("/api/planets/:id", updateById);

app.delete("/api/planets/:id", deleteById);

app.listen(port, () => {
  console.log("My server, listening to http://localhost:3000/api/planets");
});
