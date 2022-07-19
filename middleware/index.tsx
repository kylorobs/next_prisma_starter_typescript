/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import multiparty from 'multiparty';
import type { NextApiRequest, NextApiResponse } from 'next';

const fileParser = async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    console.log('PARSING FORM');
    const form = new multiparty.Form();
    const reqWithFiles = req as NextApiRequest & { files: string };
    console.log(req);

    const parse = () => {
        return new Promise((resolve, reject) => {
            form.parse(req, (_err, fields, files) => {
                console.log(_err);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                reqWithFiles.body = fields;
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                reqWithFiles.files = files;
                resolve('success');
            });
        });
    };
    await parse();
    next();
};

export default fileParser;
