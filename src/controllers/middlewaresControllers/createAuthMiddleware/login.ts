import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import mongoose from 'mongoose';
import { Request, Response } from 'express';
import authUser from './authUser';

interface LoginOptions {
  userModel: string;
}

const login = async (req: Request, res: Response, { userModel }: LoginOptions) => {
  const UserPasswordModel = mongoose.model(userModel + 'Password');
  const UserModel = mongoose.model(userModel);
  const { email, password } = req.body;

  // validate
  const objectSchema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: true } })
      .required(),
    password: Joi.string().required(),
  });

  const { error, value } = objectSchema.validate({ email, password });
  if (error) {
    return res.status(409).json({
      success: false,
      result: null,
      error: error,
      message: 'Invalid/Missing credentials.',
      errorMessage: error.message,
    });
  }

  const user = await UserModel.findOne({ email: email, removed: false });

  if (!user) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No account with this email has been registered.',
    });
  }

  const databasePassword = await UserPasswordModel.findOne({ user: user._id, removed: false });

  if (!user.enabled) {
    return res.status(409).json({
      success: false,
      result: null,
      message: 'Your account is disabled, contact your account adminstrator',
    });
  }

  //  authUser if your has correct password
  await authUser(req, res, { user, databasePassword, password, UserPasswordModel });
};

export default login;
