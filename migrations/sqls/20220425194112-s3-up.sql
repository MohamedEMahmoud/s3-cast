/* Replace with your SQL commands */
CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(20) NOT NULL,
      last_name VARCHAR(20) NOT NULL,
      email VARCHAR(40) NOT NULL,
      password VARCHAR NOT NULL,
      gender VARCHAR(20) NOT NULL,
      picture VARCHAR(200) NOT NULL,
      bucket_id VARCHAR(100) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);