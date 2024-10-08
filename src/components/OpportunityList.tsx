import React from 'react';
import { Opportunity } from '@prisma/client';

type OpportunityListProps = {
  opportunities: Opportunity[] | undefined;
};

const OpportunityList: React.FC<OpportunityListProps> = ({ opportunities }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Opportunities</h2>
      <ul>
        {opportunities?.map((opportunity) => (
          <li key={opportunity.id} className="mb-4 p-4 border rounded">
            <h3 className="text-lg font-semibold">{opportunity.name}</h3>
            <p className="text-gray-600">Amount: ${opportunity.amount}</p>
            <p className="text-gray-600">Stage: {opportunity.stage}</p>
            
            <p className="text-gray-600">Close Date: {opportunity.closeDate.toDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OpportunityList;