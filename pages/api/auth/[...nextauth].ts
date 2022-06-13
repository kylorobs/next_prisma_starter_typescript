/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '../../../lib/prisma';

export default NextAuth({
    providers: [
        EmailProvider({
            server: process.env.EMAIL_SERVER,
            from: process.env.EMAIL_FROM,
        }),
    ],

    secret: process.env.SECRET,

    session: {
        strategy: 'database',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    debug: true,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    adapter: PrismaAdapter(prisma),

    callbacks: {
        async session({ session, user }) {
            session.user.id = user.id;
            return Promise.resolve(session);
        },
    },
});
