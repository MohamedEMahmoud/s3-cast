import express from 'express';
import {
  signup,
  signin,
  deleteUser,
  updateUser
} from '../controllers/user.controller';
import { requireAuth } from '../middlewares/require-auth';
import { upload } from '../middlewares/upload-files';

const router = express.Router();

router.post('/api/user/signup',
  upload.fields([
    { name: 'picture', maxCount: 1 },
  ]),
  signup
);

router.post('/api/user/signin', upload.none(), signin);

router.delete('/api/user/:id', [requireAuth], deleteUser);

router.patch('/api/user/:id',
  [
    upload.fields([
      { name: 'picture', maxCount: 1 },
    ]),
    requireAuth
  ],
  updateUser
);



export { router as usersRouter };