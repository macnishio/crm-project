import React from 'react';
import { Mermaid } from 'mermaid';

export default function DataModel() {
  const diagram = `
    classDiagram
      class Account {
        +String id
        +String name
        +String industry
        +String website
        +createAccount()
        +updateAccount()
        +deleteAccount()
      }

      class Contact {
        +String id
        +String firstName
        +String lastName
        +String email
        +String phone
        +createContact()
        +updateContact()
        +deleteContact()
      }

      class Lead {
        +String id
        +String name
        +String email
        +String status
        +createLead()
        +updateLead()
        +convertLead()
      }

      class Opportunity {
        +String id
        +String name
        +Float amount
        +String stage
        +Date closeDate
        +createOpportunity()
        +updateOpportunity()
        +closeOpportunity()
      }

      class Campaign {
        +String id
        +String name
        +Date startDate
        +Date endDate
        +Float budget
        +createCampaign()
        +updateCampaign()
        +calculateROI()
      }

      Account "1" -- "many" Contact : has
      Account "1" -- "many" Opportunity : has
      Lead "1" -- "1" Contact : converts to
      Campaign "1" -- "many" Lead : generates
      Campaign "1" -- "many" Opportunity : influences
  `;

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Data Model</h2>
      <Mermaid chart={diagram} />
    </div>
  );
}