import pool from '../database';
import { toCamelCase } from './utils/to-camel-case';
import { Password } from '../services/Password.service';
import { UpdateHelper } from './utils/update-helper';
import { GenderType } from 'aws-sdk/clients/rekognition';
import { PictureType } from '../types/picture-type';

export type UserAttrs = {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  gender: GenderType;
  picture: PictureType;
  bucket_id: string;
  created_at?: string;
  updated_at?: string;
};

export class User {
  static async find() {
    const result = await pool.query('SELECT * FROM users;');

    return toCamelCase(result!.rows);
  }

  static async findById(id: string) {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

    return toCamelCase(result!.rows)[0];
  }

  static async insert(user: UserAttrs) {
    const { first_name, last_name, email, password, picture, gender, bucket_id } = user;

    const passwordHashed = await Password.toHash(password);

    const result = await pool.query(
      'INSERT INTO users(first_name, last_name, email, password, picture, gender, bucket_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [first_name, last_name, email, passwordHashed, picture, gender, bucket_id]
    );

    return toCamelCase(result!.rows)[0];
  }

  static async findByEmail(email: string) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);
    return toCamelCase(result!.rows)[0];
  }
  static async update(id: string, user: UserAttrs) {

    const { query, values, keys } = await UpdateHelper(user);
    
    const result = await pool.query(
      `UPDATE users SET ${query} WHERE id=$${keys.length + 1} RETURNING *;`, [...values, id]
    );

    return toCamelCase(result!.rows)[0];
  }

  static async delete(id: string) {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *;', [
      id,
    ]);
    return toCamelCase(result!.rows)[0];
  }
}