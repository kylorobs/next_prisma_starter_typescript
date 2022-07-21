/* eslint-disable camelcase */
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).end(); // Method Not Allowed
        return;
    }

    const session = await getSession({ req });
    if (!session) return res.status(401).json({ message: 'Not logged in' });
    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
    });

    const { product_id } = req.body as { product_id: string };

    if (!user) return res.status(401).json({ message: 'User not found' });
    const product = await prisma.product.findUnique({
        where: {
            id: product_id,
        },
    });

    if (product && !product.free) {
        return res.status(401).json({ message: 'Product not free' });
    }

    await prisma.purchase.create({
        data: {
            amount: 0,
            paid: true,
            author: {
                connect: { id: user.id },
            },
            product: {
                connect: { id: product_id },
            },
        },
    });

    res.end();
}
