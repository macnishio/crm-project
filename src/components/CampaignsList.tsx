import React from 'react';
import { Campaign } from '@prisma/client';

type CampaignListProps = {
  campaigns: Campaign[] | undefined;
};

const CampaignList: React.FC<CampaignListProps> = ({ campaigns }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Campaigns</h2>
      <ul>
        {campaigns?.map((campaign) => (
          <li key={campaign.id} className="mb-4 p-4 border rounded">
            <h3 className="text-lg font-semibold">{campaign.name}</h3>
            <p className="text-gray-600">Start Date: {campaign.startDate.toDateString()}</p>
            <p className="text-gray-600">End Date: {campaign.endDate.toDateString()}</p>
            <p className="text-gray-600">Budget: ${campaign.budget}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CampaignList;