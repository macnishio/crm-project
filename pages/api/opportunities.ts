import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ここでデータベースからopportunitiesを取得するロジックを実装
  const opportunities = [
    { id: 1, name: 'Opportunity 1', value: 10000 },
    { id: 2, name: 'Opportunity 2', value: 20000 },
  ];

  res.status(200).json(opportunities);
}