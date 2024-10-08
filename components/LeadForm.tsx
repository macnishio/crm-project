import React, { useState } from 'react';

interface LeadFormProps {
  onSubmit: (lead: { name: string; email: string; status: string }) => void;
}

const LeadForm: React.FC<LeadFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('新規');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, email, status });
    setName('');
    setEmail('');
    setStatus('新規');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="名前"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="メールアドレス"
        required
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="新規">新規</option>
        <option value="対応中">対応中</option>
        <option value="成約">成約</option>
      </select>
      <button type="submit">追加</button>
    </form>
  );
};

export default LeadForm;