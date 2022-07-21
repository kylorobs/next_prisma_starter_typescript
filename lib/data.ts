import type { PrismaClient, Prisma, User, Product, Purchase } from '@prisma/client';

export type ProductAuthor = Product & { author: User };

export type PurchaseWithProduct = Purchase & { product: Product };

export const getUser = async (id: string, prisma: PrismaClient): Promise<User | null> => {
    return prisma.user.findUnique({
        where: {
            id,
        },
    });
};

export const getProducts = async (options: { author?: string }, prisma: PrismaClient) => {
    const data = {
        where: {},
        orderBy: [
            {
                createdAt: 'desc',
            },
        ],
    } as Partial<Prisma.ProductFindManyArgs>;

    if (options.author) data.where = { author: { id: options.author } };

    const products = await prisma.product.findMany(data);
    console.log(products);

    return products;
};

export const getProduct = async (id: string, prisma: PrismaClient): Promise<ProductAuthor> => {
    const product = (await prisma.product.findUnique({
        where: {
            id,
        },
        include: {
            author: true,
        },
    })) as ProductAuthor;

    return product;
};

export const getPurchases = async (options: { author?: string }, prisma: PrismaClient) => {
    const data = {
        where: { paid: true },
        orderBy: [
            {
                createdAt: 'desc',
            },
        ],
        include: {
            product: true,
        },
    } as Partial<Prisma.PurchaseFindManyArgs>;

    if (options.author) data.where = { author: { id: options.author } };

    const purchases = (await prisma.purchase.findMany(data)) as PurchaseWithProduct[];

    return purchases;
};
