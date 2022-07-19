import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { createRouter } from 'next-connect';
import S3 from 'aws-sdk/clients/s3';
import type { PutObjectRequest } from 'aws-sdk/clients/s3';
import fs from 'fs';
import path from 'path';
import fileParser from '../../middleware';
import { prisma } from '../../lib/prisma';

// DOCS
// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/s3clientconfig.html#bucketendpoint
const bucket = new S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
});

const uploadFile = (filePath: fs.PathOrFileDescriptor, fileName: string, id: number): Promise<string> => {
    return new Promise((resolve, reject) => {
        const content = fs.readFileSync(filePath);

        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: `post-${id}-${Math.floor(Math.random() * 10000)}-${Math.floor(Date.now() / 1000)}${path.extname(
                fileName
            )}`,
            Body: content,
        } as PutObjectRequest;

        bucket.upload(params, (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data.Location);
        });
    });
};

type File = {
    path: fs.PathOrFileDescriptor;
    originalFilename: string;
    size: number;
};

interface ExtendedRequest {
    files?: {
        product: File[];
        image: File[];
    };
}

const router = createRouter<NextApiRequest & ExtendedRequest, NextApiResponse>();

router.use(fileParser).post(async (req, res) => {
    const session = await getSession({ req });

    if (!session) return res.status(401).json({ message: 'Not logged in' });
    console.log('UPLOADING');
    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
    });

    if (!user) return res.status(401).json({ message: 'User not found' });

    // CHECK IF VIDEO WAS UPLOADED
    let productLocation;
    let imageLocation;
    if (req?.files && req.files.product[0] && req.files.product[0].size > 0) {
        productLocation = await uploadFile(
            req.files.product[0].path,
            req.files.product[0].originalFilename,
            +session.user.id
        );
    }

    if (req?.files && req.files.image[0] && req.files.image[0].size > 0) {
        imageLocation = await uploadFile(
            req.files.image[0].path,
            req.files.image[0].originalFilename,
            +session.user.id
        );
    }

    if (imageLocation && productLocation) {
        const { title, description, price, free } = req.body as {
            title: string[];
            description: string[];
            free: string[];
            price: string[];
        };

        await prisma.product.create({
            data: {
                free: !!free[0],
                price: price[0] ? +price[0] * 100 : 0,
                title: title[0],
                description: description[0],
                url: productLocation,
                image: imageLocation,
                author: {
                    connect: { id: user.id },
                },
            },
        });
    }

    res.json({ success: true });
});

const handler = router.handler({
    onError: (err, req: NextApiRequest, res: NextApiResponse) => {
        res.status(500).end({ success: false });
    },
    onNoMatch: (req, res) => {
        res.status(404).end({ success: false });
    },
});

export const config = {
    api: {
        bodyParser: false,
    },
};

export default handler;
