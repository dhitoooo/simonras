/* eslint-disable @typescript-eslint/no-explicit-any */
import { GraphQLScalarType, Kind } from 'graphql';
import {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  toggleUserActive,
} from '@/lib/usersRepo';

const DateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  serialize(value: any) {
    return new Date(value).toISOString();
  },
  parseValue(value: any) {
    return new Date(value);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

export const resolvers = {
  DateTime: DateTimeScalar,
  Query: {
    users: async (_: unknown, args: { page?: number; pageSize?: number; filter?: any }) => {
      const page = Math.max(1, args.page ?? 1);
      const pageSize = Math.min(100, Math.max(1, args.pageSize ?? 20));
      const { rows, total } = await listUsers(page, pageSize, args.filter);
      return { data: rows, total, page, pageSize };
    },
    user: async (_: unknown, { id }: { id: string }) => getUser(Number(id)),
  },
  Mutation: {
    createUser: async (_: unknown, { input }: any) => createUser(input),
    updateUser: async (_: unknown, { id, input }: any) => updateUser(Number(id), input),
    deleteUser: async (_: unknown, { id }: any) => deleteUser(Number(id)),
    toggleUserActive: async (_: unknown, { id, is_active }: any) => toggleUserActive(Number(id), is_active),
  },
};
