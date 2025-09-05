import TerminalComponent from '@/components/Terminal';
import React from 'react';

const Terminal: React.FC = () => {
    return (
        <div className='h-screen bg-slate-950'>
            <div className="test-logs-panel">
                <h2>Live Logs</h2>
                <TerminalComponent />
            </div>
        </div>
    );
};

export default Terminal;