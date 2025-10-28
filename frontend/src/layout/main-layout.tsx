import Navbar01 from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';
import Dashboard from '@/features/dashboard';
import SchemaPage from '@/features/schema-input';
import TestDetailsPane from '@/features/test-details';
import TestRunner from '@/features/test-runner';
import React from 'react';

interface MainLayoutProps {
    Navbar?: React.ComponentType;
    Footer_?: React.ComponentType;
}

const MainLayout: React.FC<MainLayoutProps> = ({ Navbar = Navbar01, Footer_ = Footer }) => {
    return (
        <div>
            <Navbar />
            <SchemaPage />
            <TestDetailsPane />
            <Dashboard />
            <TestRunner />
            <Footer_ />
        </div>
    );
};

export default MainLayout;