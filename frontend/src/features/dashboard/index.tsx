import styles from './index.module.scss';
import { useEffect } from 'react';
import { useTestRunner } from '@/hooks/useTestRunner';
import { COLORS } from '@/config/appConfig';

const Dashboard: React.FC = () => {
    const { results } = useTestRunner();
    useEffect(() => {
        window.dispatchEvent(new Event('resize'));
    }, []);

    return (
        <div
            className={`p-6 overflow-x-auto ${styles.DASHBOARD}`}
            id='DASHBOARD'
            style={{ backgroundColor: COLORS.background, color: COLORS.text }}
        >
            <h1 className="text-2xl font-bold mb-4">Generated Test Cases</h1>
            {results.length === 0 ? (
                <p>No test cases yet. Click the button above.</p>
            ) : (
                <div className={`${styles.table_container} w-full max-w-full overflow-x-auto`}>
                    <table className="w-full min-w-full border border-gray-700 table-fixed">
                        <thead className="bg-gray-800">
                            <tr>
                                <th className="px-4 py-2 border border-gray-700 text-left">Name</th>
                                <th className="px-4 py-2 border border-gray-700 text-left">Category</th>
                                <th className="px-4 py-2 border border-gray-700 text-left">Method</th>
                                <th className="px-4 py-2 border border-gray-700 text-left">Endpoint</th>
                                <th className="px-4 py-2 border border-gray-700 text-left">Headers</th>
                                <th className="px-4 py-2 border border-gray-700 text-left">Body</th>
                                <th className="px-4 py-2 border border-gray-700 text-left">Expected Response</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((tc, i) => (
                                <tr key={i} className="hover:bg-gray-700 break-all">
                                    <td className="px-4 py-2 border border-gray-700">{tc.name}</td>
                                    <td className="px-4 py-2 border border-gray-700">{tc.category}</td>
                                    <td className="px-4 py-2 border border-gray-700">{tc.method}</td>
                                    <td className="px-4 py-2 border border-gray-700">{tc.endpoint}</td>
                                    <td className="px-4 py-2 border border-gray-700 break-words">{JSON.stringify(tc.headers)}</td>
                                    <td className="px-4 py-2 border border-gray-700 break-words">
                                        {tc.body ? JSON.stringify(tc.body) : "null"}
                                    </td>
                                    <td className="px-4 py-2 border border-gray-700">{tc.expected_response_code}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
