import React from 'react';
import { Outlet } from 'react-router';

export const Root: React.FC = () => {
  return (
    <div className="root-container">
      <main>
        <Outlet />
      </main>
    </div>
  );
};
