import { useTestRunner } from '@/hooks/useTestRunner';

const Dashboard: React.FC = () => {
    const { results } = useTestRunner();
    return (
        <div className="p-6 bg-slate-950 text-white" id='DASHBOARD'>
            <h1 className="text-2xl font-bold mb-4">Generated Test Cases</h1>
            {results.length === 0 ? (
                <p>No test cases yet. Click the button above.</p>
            ) : (
                <table className="min-w-full border border-gray-700">
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
                            <tr key={i} className="hover:bg-gray-700">
                                <td className="px-4 py-2 border border-gray-700">{tc.name}</td>
                                <td className="px-4 py-2 border border-gray-700">{tc.category}</td>
                                <td className="px-4 py-2 border border-gray-700">{tc.method}</td>
                                <td className="px-4 py-2 border border-gray-700">{tc.endpoint}</td>
                                <td className="px-4 py-2 border border-gray-700">{JSON.stringify(tc.headers)}</td>
                                <td className="px-4 py-2 border border-gray-700">{tc.body ? JSON.stringify(tc.body) : "null"}</td>
                                <td className="px-4 py-2 border border-gray-700">{tc.expected_response_code}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>

    );
};

export default Dashboard;