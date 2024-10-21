import React from 'react';

interface ExamResultsProps {
  score: number;
  warnings: number;
  studentInfo: {
    name: string;
    usn: string;
    subject: string;
  };
  recordedBlob: Blob | null;
  completionTime: number | null;
}

const ExamResults: React.FC<ExamResultsProps> = ({ score, warnings, studentInfo, recordedBlob, completionTime }) => {
  const handleDownload = () => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${studentInfo.name}_${studentInfo.subject}_exam_recording.webm`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const formatCompletionTime = (timestamp: number | null) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Exam Results</h2>
        <div className="mb-4">
          <p className="text-lg">Name: <span className="font-bold">{studentInfo.name}</span></p>
          <p className="text-lg">USN: <span className="font-bold">{studentInfo.usn}</span></p>
          <p className="text-lg">Subject: <span className="font-bold">{studentInfo.subject}</span></p>
        </div>
        <div className="mb-4">
          <p className="text-lg">Final Score: <span className="font-bold">{score} / 10</span></p>
        </div>
        <div className="mb-4">
          <p className="text-lg">Warnings Received: <span className="font-bold">{warnings}</span></p>
        </div>
        <div className="mb-6">
          <p className="text-lg">Completion Time: <span className="font-bold">{formatCompletionTime(completionTime)}</span></p>
        </div>
        {recordedBlob && (
          <div className="mb-6">
            <button
              onClick={handleDownload}
              className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Download Exam Recording
            </button>
          </div>
        )}
        <div className="text-center">
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Return to Main Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamResults;