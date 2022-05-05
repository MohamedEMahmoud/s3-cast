import { Request, Response } from 'express';
import { User } from '../models/user.model';
import { Auth } from '../models/utils/auth.utils';
import { GenderType } from '../types/gender-type';
import { PictureType } from '../types/picture-type';
import { deleteFile, upload } from '../S3/storage';
import { randomBytes } from 'crypto';

const signup = async (req: Request, res: Response) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[]; };

  const { email } = req.body;

  const existingUser = await User.findByEmail(email);

  if (existingUser) {
    return res
      .status(400)
      .send({ status: 400, message: 'email is already exist', success: false });
  }

  const user = { ...req.body };

  if (files.picture) {

    const key = `${randomBytes(8).toString('hex')}/img/${Date.now()}-${files.picture[0].originalname}`;

    const bucket = process.env.BUCKET_NAME!;

    const contentType = files.picture[0].mimetype;
    const data = await upload(bucket, key, contentType, files.picture[0].buffer);

    if (data) {
      user.picture = data.Location;
      user.bucket_id = key.split('/')[0];
    }
  } else {
    if (user.gender === GenderType.Male) {
      user.picture = PictureType.Male;
    } else {
      user.picture = PictureType.Female;
    }
  }

  const userData = await User.insert({ ...user });

  const { id } = userData;

  req.session = await Auth.generateToken(id);


  res.status(201).send({ status: 201, user: userData, success: true });
};

const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await Auth.authenticate(email, password);

  if (!user) {
    return res.status(400).send({
      status: 400,
      message: 'Email Or Password is Invalid',
      success: false,
    });
  }

  req.session = await Auth.generateToken(user!.id);

  res.status(200).send({ status: 200, user, success: true });
};

const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await User.delete(id);
  req.session = null;
  res.send({ status: 204, user, success: true });

};

const updateUser = async (req: Request, res: Response) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[]; };

  const { id } = req.params;
  const existingUser = await User.findById(id);

  if (!existingUser) {
    return res
      .status(400)
      .send({ status: 400, message: 'user is not exist', success: false });
  }

  const user = { ...req.body };

  if (files.picture) {

    const key = existingUser.bucketId;

    const bucket = process.env.BUCKET_NAME!;

    const filePath = `${key}/img/${existingUser.picture.slice(existingUser.picture.lastIndexOf('/') + 1)}`;

    const newFile = `${key}/img/${Date.now()}-${files.picture[0].originalname}`;

    try {
      await deleteFile(bucket, filePath);
    } catch (err) { }

    const contentType = files.picture[0].mimetype;

    const data = await upload(bucket, newFile, contentType, files.picture[0].buffer);

    if (data) {
      user.picture = data.Location;
    }
  }

  const userData = await User.update(id, user);

  res.status(200).send({ status: 200, user: userData, success: true });


};

export {
  signup,
  signin,
  deleteUser,
  updateUser
};