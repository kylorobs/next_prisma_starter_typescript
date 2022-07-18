// import Head from 'next/head'
import { getSession, useSession } from 'next-auth/react';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getUser } from '../lib/data';
import { prisma } from '../lib/prisma';
import type { UserT } from '../types/prisma-extracted'

export default function Home({ userData }: { userData: UserT }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === 'loading') {
        return null;
    }

    if (session) {
        console.log(userData)
        router.push('/profile');
    }
    return (
        <Link href="/api/auth/signin">
            <a>login</a>
        </Link>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    const { someParam } = context.params as { someParam: string };
    console.log(someParam);

    const userId = session?.user.id || '';

    const user = await getUser(userId, prisma);

    return {
        props: {
            user,
        },
    };
};
