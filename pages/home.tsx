import { useSession } from 'next-auth/react';

export default function Home() {
    const { data: session, status } = useSession();
    console.log(session);
    console.log(status);
    return <div>{session ? <p>You are logged in!</p> : <p>You are not logged in 😞</p>}</div>;
}
