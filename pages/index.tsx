// import Head from 'next/head'
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Home() {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === 'loading') {
        return null;
    }

    if (session) {
        router.push('/home');
    }
    return (
        <Link href="/api/auth/signin">
            <a>login</a>
        </Link>
    );
}
