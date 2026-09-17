import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { TimerWidget } from '../timer/TimerWidget';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 relative">
          <div className="max-w-7xl mx-auto w-full h-full">
            {children}
          </div>
        </main>
        {/* Global active timer widget */}
        <TimerWidget />
      </div>
    </div>
  );
};
