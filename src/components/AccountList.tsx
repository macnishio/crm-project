import React from 'react';
import { Account } from '@prisma/client';

type AccountListProps = {
  accounts: Account[] | undefined;
};

const AccountList: React.FC<AccountListProps> = ({ accounts }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Accounts</h2>
      <ul>
        {accounts?.map((account) => (
          <li key={account.id} className="mb-4 p-4 border rounded">
            <h3 className="text-lg font-semibold">{account.name}</h3>
            <p className="text-gray-600">{account.industry}</p>
            <a href={account.website} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
              {account.website}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AccountList;