import React, { useState } from 'react';
import { NextPage } from 'next';
import Layout from '../../components/Layout';

const NewAccount: NextPage = () => {
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/accounts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    if (response.ok) {
      setName('');
      alert('取引先が追加されました');
    } else {
      alert('エラーが発生しました');
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">新規取引先</h1>
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
            取引先名
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          追加
        </button>
      </form>
    </Layout>
  );
};

export default NewAccount;