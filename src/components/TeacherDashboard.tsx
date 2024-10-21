import React, { useState, useEffect } from 'react';

interface StudentResult {
  name: string;
  usn: string;
  subject: string;
  score: number;
  warnings: number;
  completionTime: number;
}

const TeacherDashboard: React.FC = () => {
  const [results, setResults] = useState<StudentResult[]>([]);

  useEffect(() => {
    // In a real application, you would fetch this data from a backend
    // For now, we'll use mock data and update it every 5 seconds
    const fetchData = () => {
      const mockResults: StudentResult[] = [
        { name: 'John Doe', usn: 'USN001', subject: 'HTML', score: 8, warnings: 1, completionTime: Date.now() - 1000000 },
        { name: 'Jane Smith', usn: 'USN002', subject: 'CSS', score: 9, warnings: 0, completionTime: Date.now() - 500000 },
        { name: 'Bob Johnson', usn: 'USN003', subject: 'JavaScript', score: 7, warnings: 2, completionTime: Date.now() - 200000 },
      ];
      setResults(mockResults);
    };

    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const formatCompletionTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-2xl font-bold mb-6">Teacher Dashboard</h2>
      <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">USN</th>
            <th className="p-3 text-left">Subject</th>
            <th className="p-3 text-left">Score</th>
            <th className="p-3 text-left">Warnings</th>
            <th className="p-3 text-left">Completion Time</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
              <td className="p-3">{result.name}</td>
              <td className="p-3">{result.usn}</td>
              <td className="p-3">{result.subject}</td>
              <td className="p-3">{result.score}/10</td>
              <td className="p-3">{result.warnings}</td>
              <td className="p-3">{formatCompletionTime(result.completionTime)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherDashboard;