import React from 'react';
import { Mermaid } from 'mermaid';

export default function SystemArchitecture() {
  const diagram = `
    graph TB
      subgraph "Frontend"
        Web["Web Application (React.js)"]
        Mobile["Mobile App (React Native)"]
      end

      subgraph "API Gateway"
        API["API Gateway (Express.js)"]
      end

      subgraph "Microservices"
        Auth["Authentication Service"]
        Customer["Customer Management Service"]
        Sales["Sales Management Service"]
        Marketing["Marketing Automation Service"]
        Support["Customer Support Service"]
        Analytics["Analytics #38; Reporting Service"]
        Notification["Notification Service"]
      end

      subgraph "Data Storage"
        DB["PostgreSQL"]
        Cache["Redis Cache"]
        Search["Elasticsearch"]
      end

      subgraph "Message Queue"
        MQ["Apache Kafka"]
      end

      subgraph "AI/ML Engine"
        AI["AI/ML Processing Engine"]
      end

      Web --> API
      Mobile --> API
      API --> Auth
      API --> Customer
      API --> Sales
      API --> Marketing
      API --> Support
      API --> Analytics
      API --> Notification

      Auth --> DB
      Customer --> DB
      Sales --> DB
      Marketing --> DB
      Support --> DB
      Analytics --> DB
      Notification --> DB

      Customer --> Cache
      Sales --> Cache
      Marketing --> Cache
      Support --> Cache

      Analytics --> Search
      Customer --> Search
      Sales --> Search

      Customer --> MQ
      Sales --> MQ
      Marketing --> MQ
      Support --> MQ
      Notification --> MQ

      Analytics --> AI
      Sales --> AI
      Marketing --> AI
  `;

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">System Architecture</h2>
      <Mermaid chart={diagram} />
    </div>
  );
}