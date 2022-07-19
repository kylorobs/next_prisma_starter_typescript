// import Head from 'next/head'
import { getSession, useSession } from 'next-auth/react';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getUser } from '../lib/data';
import { prisma } from '../lib/prisma';
import type { UserT } from '../types/prisma-extracted';
import Heading from '../components/Heading';

export default function Home() {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === 'loading') {
        return null;
    }

    if (session) {
        if (!session.user.name) router.push('/setup');
        else router.push('/dashboard');
    }

    return (
        <div>
            <Head>
                <title>Digital Downloads</title>
                <meta name="description" content="A great YouTube Clone" />
                <title>Digital Downloads</title>
                <meta name="description" content="Digital Downloads Website" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Heading />

            <h1 className="flex justify-center mt-20 text-xl">Welcome!</h1>
        </div>
    );
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
//     const session = await getSession(context);
//     const { someParam } = context.params as { someParam: string };
//     console.log(someParam);

//     const userId = session?.user.id || '';

//     const user = await getUser(userId, prisma);

//     return {
//         props: {
//             user,
//         },
//     };
// };
