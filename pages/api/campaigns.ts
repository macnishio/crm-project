import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ここでデータベースからcampaignsを取得するロジックを実装
  const campaigns = [
    { id: 1, name: 'Campaign 1', status: 'Active' },
    { id: 2, name: 'Campaign 2', status: 'Completed' },
  ];

  res.status(200).json(campaigns);
}