import { NextApiRequest, NextApiResponse } from 'next';

interface Account {
  id: number;
  name: string;
}

let accounts: Account[] = [
  { id: 1, name: '株式会社A' },
  { id: 2, name: '株式会社B' },
  { id: 3, name: '株式会社C' },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json(accounts);
  } else if (req.method === 'POST') {
    const { name } = req.body;
    const newAccount: Account = {
      id: accounts.length + 1,
      name,
    };
    accounts.push(newAccount);
    res.status(201).json(newAccount);
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}