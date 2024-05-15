import { Request, Response } from "express";
import { db } from "./../db.js";
import * as dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

const logIn = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await db.one(`SELECT * FROM users WHERE username=$1`, username);

  if (user && user.password === password) {
    const payload = {
      id: user.id,
      username,
    };
    const { SECRET = "" } = process.env;
    const token = jwt.sign(payload, SECRET);
    console.log(token);

    await db.none(`UPDATE users SET token=$2 WHERE id=$1`, [user.id, token]);
    res.status(200).json({ id: user.id, username, token });
  } else {
    res.status(400).json({ msg: `Username or Password, not valid.` });
  }
};

const signUp = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await db.oneOrNone(
    `SELECT * FROM users WHERE username=$1`,
    username
  );

  if (user) {
    res.status(409).json({ msg: "Username already exist! try different." });
  } else {
    const { id } = await db.one(
      `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id`,
      [username, password]
    );
    res.status(201).json({ id, msg: "Signup successful. Now you can log in." });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  const users = await db.many(`SELECT * FROM users;`);
  res.status(200).json(users);
};

const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const users = await db.many(`SELECT * FROM users WHERE id=$1;`, Number(id));
  const user = users.find((p) => p.id === Number(id));
  res.status(200).json(user);
};

export { logIn, signUp, getUser, getAllUsers };
