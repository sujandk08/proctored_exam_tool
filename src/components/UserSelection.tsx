import React from 'react';
import { User, Users } from 'lucide-react';

interface UserSelectionProps {
  onSelectRole: (role: 'student' | 'teacher') => void;
}

const UserSelection: React.FC<UserSelectionProps> = ({ onSelectRole }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Select Your Role</h2>
        <div className="space-y-4">
          <button
            onClick={() => onSelectRole('student')}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded flex items-center justify-center"
          >
            <User className="mr-2" />
            Student
          </button>
          <button
            onClick={() => onSelectRole('teacher')}
            className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-4 rounded flex items-center justify-center"
          >
            <Users className="mr-2" />
            Teacher
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSelection;