import React from 'react';

interface Account {
  id: number;
  name: string;
}

interface Opportunity {
  id: number;
  name: string;
  value: number;
}

interface Campaign {
  id: number;
  name: string;
  status: string;
}

interface DashboardProps {
  accounts: Account[];
  opportunities: Opportunity[];
  campaigns: Campaign[];
}

const Dashboard: React.FC<DashboardProps> = ({ accounts, opportunities, campaigns }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">ダッシュボード</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">取引先</h2>
          <ul>
            {accounts.map(account => (
              <li key={account.id} className="mb-2">{account.name}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">商談</h2>
          <ul>
            {opportunities.map(opportunity => (
              <li key={opportunity.id} className="mb-2">
                {opportunity.name} - ¥{opportunity.value.toLocaleString()}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">キャンペーン</h2>
          <ul>
            {campaigns.map(campaign => (
              <li key={campaign.id} className="mb-2">
                {campaign.name} - {campaign.status}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;