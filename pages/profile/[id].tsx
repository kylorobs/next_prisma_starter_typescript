import Head from 'next/head';
import Link from 'next/link';
import type { Product, User } from '@prisma/client';
import { GetServerSideProps } from 'next';
import { getProducts, getUser } from '../../lib/data';
import Heading from '../../components/Heading';
import { prisma } from '../../lib/prisma';

export default function Profile({ user, products }: { user: User; products: Product[] }) {
    return (
        <div>
            <Head>
                <title>Digital Downloads</title>
                <meta name="description" content="Digital Downloads Website" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Heading />

            <h1 className="flex justify-center mt-20 text-xl">Products made by {user.name}</h1>

            <div className="flex justify-center mt-10">
                <div className="flex flex-col w-full ">
                    {products &&
                        products.map((product, index) => (
                            <div
                                className=" bg-white border flex justify-between w-full md:w-2/3 xl:w-1/3 mx-auto px-4 my-2 py-5 "
                                key={index}
                            >
                                {product.image && <img src={product.image} className="w-14 h-14 flex-initial" />}
                                <div className="flex-1 ml-3">
                                    <p className="text-black">{product.title}</p>
                                    {product.free ? (
                                        <span className="bg-black text-white px-1 uppercase font-bold">free</span>
                                    ) : (
                                        <p className="bg-black text-white w-fit px-1">${+product.price! / 100}</p>
                                    )}
                                </div>
                                <div className="">
                                    <Link href={`/product/${product.id}`}>
                                        <a className="text-sm text-black border p-2 font-bold uppercase ml-2">View</a>
                                    </Link>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.params as { id: string };
    let user = await getUser(id, prisma);
    user = JSON.parse(JSON.stringify(user)) as User;

    let products = await getProducts({ author: id }, prisma);
    products = JSON.parse(JSON.stringify(products)) as Product[];

    return {
        props: {
            user,
            products,
        },
    };
};
