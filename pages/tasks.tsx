import React from 'react';
import { NextPage } from 'next';
import Layout from '@/components/Layout';

const TasksPage: NextPage = () => {
  const tasks = [
    { id: 1, title: '株式会社Aへの提案書作成', dueDate: '2023-05-10', status: '進行中' },
    { id: 2, title: '新規リードへの電話連絡', dueDate: '2023-05-05', status: '未着手' },
  ];

  return (
    <Layout>
      <h1>タスク一覧</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title} - 期限: {task.dueDate} - 状態: {task.status}
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default TasksPage;