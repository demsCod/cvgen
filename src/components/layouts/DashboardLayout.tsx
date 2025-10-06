import React from 'react';
import Navbar from './Navbar';

export interface DashboardLayoutProps {
  activeMenu: 'home' | 'profile' | 'settings';
  children?: React.ReactNode;
  className?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ activeMenu, children, className }) => {
  return (
    <div className={className}> 
      <Navbar activeMenu={activeMenu} />
      <main className="container w-full p-4 pb-4">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;