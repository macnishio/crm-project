import React from 'react';
import { Lead } from '@prisma/client';

type LeadListProps = {
  leads: Lead[] | undefined;
};

const LeadList: React.FC<LeadListProps> = ({ leads }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Leads</h2>
      <ul>
        {leads?.map((lead) => (
          <li key={lead.id} className="mb-4 p-4 border rounded">
            <h3 className="text-lg font-semibold">{lead.name}</h3>
            <p className="text-gray-600">{lead.email}</p>
            <p className="text-gray-600">Status: {lead.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeadList;