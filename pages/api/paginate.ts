import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(501).end();
    }

    const paginationAmount = 30;

    if (req.method === 'GET') {
        const { take, skip } = req.query as { take?: string; skip?: string };
        const qtake = parseInt(take || `${paginationAmount}`);
        const qskip = parseInt(skip || '0');

        // const videos = await getVideos({ take: qtake, skip: qskip }, prisma);
        res.json({});
    }
}
