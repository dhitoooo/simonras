import { createYoga, createSchema } from 'graphql-yoga';
import type { NextRequest } from 'next/server';
import { resolvers } from '@/graphql/resolvers';
import fs from 'node:fs';
import path from 'node:path';

const typeDefs = fs.readFileSync(path.join(process.cwd(), 'schema.graphql'), 'utf8');
const schema = createSchema({ typeDefs, resolvers });

const yoga = createYoga<{ req: NextRequest }>({
  schema,
  graphqlEndpoint: '/api/graphql',
});

export { yoga as GET, yoga as POST, yoga as OPTIONS };
