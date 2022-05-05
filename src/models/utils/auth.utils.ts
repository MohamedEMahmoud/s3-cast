import { User } from '../user.model';
import { Password } from '../../services/Password.service';
import jwt from 'jsonwebtoken';

export class Auth {
  static async authenticate(email: string, password: string) {
    const user = await User.findByEmail(email);

    if (!user) {
      return null;
    }

    const matchPassword = await Password.compare(user.password, password);

    if (matchPassword) {
      return user;
    }
  }

  static async generateToken(id: string) {
    const userJwt = jwt.sign({ id }, process.env.JWT_KEY!);

    return { jwt: userJwt };
  }
}