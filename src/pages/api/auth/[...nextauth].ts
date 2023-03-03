import type { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth';
import { authOptions } from '~/server/auth';

export default NextAuth(authOptions) as NextAuthOptions;
