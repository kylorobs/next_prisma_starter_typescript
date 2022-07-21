import { useRouter } from 'next/router';
import { useSession, getSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import type { Product } from '@prisma/client';
import Heading from '../../components/Heading';
import { prisma } from '../../lib/prisma';
import { getProducts, getPurchases } from '../../lib/data';
import type { PurchaseWithProduct } from '../../lib/data';

export default function Dashboard({ products, purchases }: { products: Product[]; purchases: PurchaseWithProduct[] }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    const loading = status === 'loading';

    if (loading) {
        return null;
    }

    if (!session) {
        router.push('/');
    }

    if (session && !session.user.name) {
        router.push('/setup');
    }

    console.log({ products });

    return (
        <div>
            <Head>
                <title>Digital Downloads</title>
                <meta name="description" content="Digital Downloads Website" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Heading />

            <h1 className="flex justify-center mt-20 text-xl">Dashboard</h1>

            <div className="flex justify-center mt-10">
                <Link href="/dashboard/new">
                    <a className="text-xl border p-2 text-white">Create a new product</a>
                </Link>
            </div>

            <div className="flex justify-center mt-10 w-full">
                {products.length > 0 && (
                    <div className="flex flex-col w-full">
                        <h2 className="text-center text-xl mb-4">Products</h2>
                        {products &&
                            products.map((product, index) => (
                                <div
                                    className="border text-black bg-white flex justify-between w-full md:w-2/3  mx-auto px-4 my-2 py-5 "
                                    key={index}
                                >
                                    {product.image && <img src={product.image} className="w-14 h-14 flex-initial" />}
                                    <div className="flex-1 ml-3">
                                        <p className="text-black">{product.title}</p>
                                        {product.free && product.price ? (
                                            <span className="bg-white text-black px-1 uppercase font-bold">free</span>
                                        ) : (
                                            <p className="text-black">${+product.price! / 100}</p>
                                        )}
                                    </div>
                                    <div className="">
                                        <Link href={`/dashboard/product/${product.id}`}>
                                            <a className="text-sm text-black border p-2 font-bold uppercase">Edit</a>
                                        </Link>
                                        <Link href={`/product/${product.id}`}>
                                            <a className="text-sm text-black border p-2 font-bold uppercase">View</a>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}

                {purchases.length > 0 && (
                    <div className="flex flex-col w-full">
                        <h2 className="text-center text-xl mb-4">Purchases</h2>
                        {purchases.map((purchase, index) => (
                            <div
                                className="border flex justify-between w-full md:w-2/3  mx-auto px-4 my-2 py-5 "
                                key={index}
                            >
                                {purchase.product.image && (
                                    <img alt="" src={purchase.product.image} className="w-14 h-14 flex-initial" />
                                )}
                                <div className="flex-1 ml-3">
                                    <p>{purchase.product.title}</p>
                                    {+purchase.amount === 0 ? (
                                        <span className="bg-white text-black px-1 uppercase font-bold">free</span>
                                    ) : (
                                        <p>${+purchase.amount / 100}</p>
                                    )}
                                </div>
                                <div className="">
                                    <a
                                        href={purchase.product.url || ''}
                                        className="text-sm text-white border p-2 font-bold uppercase"
                                    >
                                        Get files
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    if (!session) return { props: {} };
    let products = await getProducts({ author: '' }, prisma);
    products = JSON.parse(JSON.stringify(products)) as Product[];

    let purchases = await getPurchases({ author: session.user.id }, prisma);
    purchases = JSON.parse(JSON.stringify(purchases)) as PurchaseWithProduct[];

    return {
        props: {
            products,
            purchases,
        },
    };
};
