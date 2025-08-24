// src/app/api/graphql/route.ts
import { createYoga, createSchema } from 'graphql-yoga';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/database';

const typeDefs = /* GraphQL */ `
  type User {
    id: ID!
    nrp: String!
    nama: String!
    jabatan: String!
    fungsi: String!
    polsek: String
    phone: String
    email: String
    is_active: Boolean!
    created_at: String
    updated_at: String
  }

  input CreateUserInput {
    nrp: String!
    nama: String!
    jabatan: String!
    fungsi: String!
    polsek: String
    phone: String
    email: String
    password: String!
  }

  input UpdateUserInput {
    nrp: String
    nama: String
    jabatan: String
    fungsi: String
    polsek: String
    phone: String
    email: String
    password: String
    is_active: Boolean
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    createUser(input: CreateUserInput!): User
    updateUser(id: ID!, input: UpdateUserInput!): User
    deleteUser(id: ID!): Boolean
  }
`;

const resolvers = {
  Query: {
    users: async () => {
      const [rows] = await db.query(
        'SELECT id, nrp, nama, jabatan, fungsi, polsek, phone, email, is_active, created_at, updated_at FROM users'
      );
      return rows as any[];
    },
    user: async (_parent: any, { id }: { id: number }) => {
      const [rows] = await db.query(
        'SELECT id, nrp, nama, jabatan, fungsi, polsek, phone, email, is_active, created_at, updated_at FROM users WHERE id = ?',
        [id]
      );
      return (rows as any[])[0] || null;
    }
  },
  Mutation: {
    createUser: async (_parent: any, { input }: any) => {
      const { nrp, nama, jabatan, fungsi, polsek, phone, email, password } = input;
      const hash = await bcrypt.hash(password, 10);
      const [result] = await db.execute(
        'INSERT INTO users (nrp, nama, jabatan, fungsi, polsek, phone, email, password_hash) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [nrp, nama, jabatan, fungsi, polsek, phone, email, hash]
      );
      const id = (result as any).insertId;
      const [rows] = await db.query(
        'SELECT id, nrp, nama, jabatan, fungsi, polsek, phone, email, is_active, created_at, updated_at FROM users WHERE id = ?',
        [id]
      );
      return (rows as any[])[0];
    },
    updateUser: async (_parent: any, { id, input }: any) => {
      const fields: string[] = [];
      const params: any[] = [];
      if (input.nrp !== undefined) {
        fields.push('nrp = ?');
        params.push(input.nrp);
      }
      if (input.nama !== undefined) {
        fields.push('nama = ?');
        params.push(input.nama);
      }
      if (input.jabatan !== undefined) {
        fields.push('jabatan = ?');
        params.push(input.jabatan);
      }
      if (input.fungsi !== undefined) {
        fields.push('fungsi = ?');
        params.push(input.fungsi);
      }
      if (input.polsek !== undefined) {
        fields.push('polsek = ?');
        params.push(input.polsek);
      }
      if (input.phone !== undefined) {
        fields.push('phone = ?');
        params.push(input.phone);
      }
      if (input.email !== undefined) {
        fields.push('email = ?');
        params.push(input.email);
      }
      if (input.is_active !== undefined) {
        fields.push('is_active = ?');
        params.push(input.is_active);
      }
      if (input.password !== undefined) {
        const hash = await bcrypt.hash(input.password, 10);
        fields.push('password_hash = ?');
        params.push(hash);
      }
      if (fields.length === 0) {
        return null;
      }
      params.push(id);
      await db.execute(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, params);
      const [rows] = await db.query(
        'SELECT id, nrp, nama, jabatan, fungsi, polsek, phone, email, is_active, created_at, updated_at FROM users WHERE id = ?',
        [id]
      );
      return (rows as any[])[0];
    },
    deleteUser: async (_parent: any, { id }: { id: number }) => {
      const [result] = await db.execute('DELETE FROM users WHERE id = ?', [id]);
      return (result as any).affectedRows > 0;
    }
  }
};

const { handleRequest } = createYoga({
  schema: createSchema({ typeDefs, resolvers }),
  graphqlEndpoint: '/api/graphql'
});

export { handleRequest as GET, handleRequest as POST };
