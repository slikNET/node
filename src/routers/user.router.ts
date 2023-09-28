import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { commonMiddleware } from "../middlewares/common.middleware";
import { userMiddleware } from "../middlewares/user.middleware";

const router = Router();

//  GET ALL
router.get("", userController.getAll);

//  GET BY ID
router.get(
  "/:id",
  commonMiddleware.isIdValid,
  userMiddleware.getByIdOrThrow,
  userController.getById,
);

//  CREATE NEW
router.post(
  "/",
  userMiddleware.ifExistedByEmail,
  userMiddleware.validDataOnCreate,
  userController.create,
);

//  DELETE BY ID
router.delete(
  "/:id",
  commonMiddleware.isIdValid,
  userMiddleware.getByIdOrThrow,
  //  TODO: чи потрібно тут робити дві перевірки? mongoose.isObjectIdOrHexString - не робить перевірку на існування id?
  userController.deleteById,
);

//  UPDATE BY ID
router.put(
  "/:id",
  commonMiddleware.isIdValid,
  userMiddleware.getByIdOrThrow,
  userMiddleware.validDataOnUpdate,
  userController.updateById,
);

export const userRouter = router;
