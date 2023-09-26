import express, { Request, Response } from "express";
import * as mongoose from "mongoose";

import { configs } from "./configs/config";
import { User } from "./models/User.model";
import { IUser } from "./types/user.type";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(
  "/users",
  async (req: Request, res: Response): Promise<Response<IUser[]>> => {
    const users = await User.find();

    return res.json(users);
  },
);

// Endpoint for creating user
app.post(
  "/users",
  async (req: Request, res: Response): Promise<Response<IUser>> => {
    try {
      const createdUser = await User.create({ ...req.body });
      return res.status(201).json(createdUser);
    } catch (e) {
      res.status(400).json(e.message);
    }
  },
);

// Endpoint for getting user by ID
app.get(
  "/users/:id",
  async (req: Request, res: Response): Promise<Response<IUser>> => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        throw new Error("User not found");
      }
      return res.status(201).json(user);
    } catch (e) {
      res.status(404).json(e.message);
    }
  },
);

// Endpoint for delete user by ID
app.delete("/users/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      throw new Error("User not found");
    }

    res.sendStatus(204);
  } catch (e) {
    res.status(404).json(e.message);
  }
});

// Endpoint for update user by ID
app.put(
  "/users/:id",
  async (req: Request, res: Response): Promise<Response<IUser>> => {
    try {
      const { id } = req.params;
      const { name, email, age } = req.body;

      if (typeof name !== "undefined" && name.length < 2) {
        throw new Error("Wrong name");
      }
      if (typeof email !== "undefined" && !email.includes("@")) {
        throw new Error("Wrong email");
      }
      if (typeof age !== "undefined" && (age < 1 || age > 199)) {
        throw new Error("Wrong age");
      }

      const user = await User.findByIdAndUpdate(
        id,
        { ...req.body },
        {
          returnDocument: "after",
        },
      );

      if (!user) {
        throw new Error("User not found");
      }

      return res.status(201).json(user);
    } catch (e) {
      res.status(404).json(e.message);
    }
  },
);

const PORT = 5001;

app.listen(PORT, async () => {
  await mongoose.connect(configs.DB_URI);

  console.log(`Server has successfully started on PORT ${PORT}`);
});
