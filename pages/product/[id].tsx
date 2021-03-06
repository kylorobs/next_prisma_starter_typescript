import Head from 'next/head';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { prisma } from '../../lib/prisma';
import { getProduct } from '../../lib/data';
import Heading from '../../components/Heading';
import type { ProductAuthor } from '../../lib/data';

export default function Product({ product }: { product: ProductAuthor }) {
    const { data: session } = useSession();
    const router = useRouter();

    async function handlePurchase() {
        if (product.free) {
            await fetch('/api/download', {
                body: JSON.stringify({
                    product_id: product.id,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            });

            router.push('/dashboard');
        }
    }

    if (!product) {
        return null;
    }

    return (
        <div>
            <Head>
                <title>Digital Downloads</title>
                <meta name="description" content="Digital Downloads Website" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Heading />

            <div className="flex justify-center">
                <div className="border bg-white flex flex-col w-full md:w-2/3 xl:w-1/3 mx-auto px-4 mt-10">
                    <div className="flex justify-between py-10">
                        {product.image && <img src={product.image} className="w-14 h-14 flex-initial" />}
                        <div className="flex-1 ml-3">
                            <p className="text-black">{product.title}</p>
                            {product.free ? (
                                <span className="bg-black text-white px-1 uppercase font-bold">free</span>
                            ) : (
                                <p className="bg-black text-white w-fit px-1">${+product.price! / 100}</p>
                            )}
                        </div>
                        {!session && <p>Login first</p>}
                        {session &&
                            (session.user.id !== product.author.id ? (
                                <button
                                    onClick={handlePurchase}
                                    type="button"
                                    className="text-sm text-black border p-2 font-bold uppercase"
                                >
                                    {product.free ? 'DOWNLOAD' : 'PURCHASE'}
                                </button>
                            ) : (
                                'Your product'
                            ))}
                    </div>
                    <div className="mb-10">{product.description}</div>
                    <div className="mb-10">
                        Created by
                        <Link href={`/profile/${product.author.id}`}>
                            <a className="font-bold underline ml-1">{product.author.name}</a>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.params as { id: string };
    let product = await getProduct(id, prisma);
    product = JSON.parse(JSON.stringify(product)) as ProductAuthor;

    return {
        props: {
            product,
        },
    };
};
