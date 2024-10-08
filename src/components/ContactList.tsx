import React from 'react';
import { Contact } from '@prisma/client';

type ContactListProps = {
  contacts: Contact[] | undefined;
};

const ContactList: React.FC<ContactListProps> = ({ contacts }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Contacts</h2>
      <ul>
        {contacts?.map((contact) => (
          <li key={contact.id} className="mb-4 p-4 border rounded">
            <h3 className="text-lg font-semibold">{contact.firstName} {contact.lastName}</h3>
            <p className="text-gray-600">{contact.email}</p>
            <p className="text-gray-600">{contact.phone}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactList;