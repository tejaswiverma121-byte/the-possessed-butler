'use client';

import React from 'react';
import { TasksView } from '../../components/sentinel/TasksView';

export default function TasksPage() {
  return (
    <div className="h-full overflow-hidden">
      <TasksView />
    </div>
  );
}
