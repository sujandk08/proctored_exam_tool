import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Camera, Maximize2, Monitor, User, Users } from 'lucide-react';
import ExamContent from './components/ExamContent';
import WarningModal from './components/WarningModal';
import ExamResults from './components/ExamResults';
import UserSelection from './components/UserSelection';
import StudentForm from './components/StudentForm';
import TeacherDashboard from './components/TeacherDashboard';
import * as faceapi from 'face-api.js';

function App() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [warnings, setWarnings] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [userRole, setUserRole] = useState<'student' | 'teacher' | null>(null);
  const [studentInfo, setStudentInfo] = useState({ name: '', usn: '', subject: '' });
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [completionTime, setCompletionTime] = useState<number | null>(null);

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.loadSsdMobilenetv1Model('/models');
      await faceapi.loadFaceLandmarkModel('/models');
      await faceapi.loadFaceRecognitionModel('/models');
    };
    loadModels();
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const newFullscreenState = !!document.fullscreenElement;
      setIsFullscreen(newFullscreenState);
      if (!newFullscreenState && warnings < 3 && !examFinished) {
        incrementWarning('Exited fullscreen');
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && warnings < 3 && !examFinished) {
        incrementWarning('Tab switched');
      }
    };

    const preventScreenCapture = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && e.key === 'PrintScreen') ||
        (e.metaKey && e.shiftKey && e.key === '4')
      ) {
        e.preventDefault();
        incrementWarning('Attempted screen capture');
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('keydown', preventScreenCapture);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('keydown', preventScreenCapture);
    };
  }, [warnings, examFinished]);

  const enterFullscreen = () => {
    document.documentElement.requestFullscreen();
  };

  const incrementWarning = (reason: string) => {
    setWarnings((prev) => {
      const newWarnings = prev + 1;
      console.log(`Warning ${newWarnings}: ${reason}`);
      if (newWarnings >= 3) {
        setShowWarningModal(true);
        endExam();
      }
      return newWarnings;
    });
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    incrementWarning('Right-click attempted');
  };

  const toggleCamera = async () => {
    if (!isCameraOn) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
          };
        }
        setIsCameraOn(true);
        startRecording(stream);
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    } else {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setIsCameraOn(false);
      stopRecording();
    }
  };

  const toggleScreenSharing = async () => {
    if (!isScreenSharing) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        if (screenVideoRef.current) {
          screenVideoRef.current.srcObject = stream;
          screenVideoRef.current.onloadedmetadata = () => {
            screenVideoRef.current?.play();
          };
        }
        setIsScreenSharing(true);
      } catch (err) {
        console.error('Error sharing screen:', err);
      }
    } else {
      const stream = screenVideoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
      if (screenVideoRef.current) {
        screenVideoRef.current.srcObject = null;
      }
      setIsScreenSharing(false);
    }
  };

  const startRecording = (stream: MediaStream) => {
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      setRecordedBlob(blob);
      chunksRef.current = [];
    };
    mediaRecorder.start();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const startExam = () => {
    setExamStarted(true);
    enterFullscreen();
  };

  const endExam = () => {
    setExamFinished(true);
    setExamStarted(false);
    setCompletionTime(Date.now());
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    stopRecording();
  };

  const handleExamCompletion = (finalScore: number) => {
    setScore(finalScore);
    endExam();
  };

  const detectFaces = async () => {
    if (videoRef.current) {
      const detections = await faceapi.detectAllFaces(videoRef.current);
      if (detections.length > 1) {
        incrementWarning('Multiple faces detected');
        endExam();
      }
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCameraOn && examStarted) {
      interval = setInterval(detectFaces, 5000); // Check every 5 seconds
    }
    return () => clearInterval(interval);
  }, [isCameraOn, examStarted]);

  if (examFinished) {
    return (
      <ExamResults
        score={score}
        warnings={warnings}
        studentInfo={studentInfo}
        recordedBlob={recordedBlob}
        completionTime={completionTime}
      />
    );
  }

  if (!userRole) {
    return <UserSelection onSelectRole={setUserRole} />;
  }

  if (userRole === 'student' && !studentInfo.subject) {
    return <StudentForm onSubmit={setStudentInfo} />;
  }

  if (userRole === 'teacher') {
    return <TeacherDashboard />;
  }

  return (
    <div 
      className="min-h-screen bg-gray-100 flex flex-col"
      onContextMenu={handleContextMenu}
    >
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Proctored Exam Portal</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleCamera}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <Camera className="mr-2" />
            {isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
          </button>
          <button
            onClick={toggleScreenSharing}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <Monitor className="mr-2" />
            {isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
          </button>
          {!isFullscreen && !examStarted && (
            <button
              onClick={startExam}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
            >
              <Maximize2 className="mr-2" />
              Start Exam
            </button>
          )}
          <div className="flex items-center">
            <AlertTriangle className="text-yellow-300 mr-2" />
            <span>Warnings: {warnings}/3</span>
          </div>
        </div>
      </header>

      <main className="flex-grow p-8">
        {examStarted ? (
          <ExamContent onComplete={handleExamCompletion} subject={studentInfo.subject} />
        ) : (
          <div className="text-center">
            <p className="text-xl mb-4">Welcome, {studentInfo.name}. Please start the {studentInfo.subject} exam when you're ready.</p>
            <button
              onClick={startExam}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Start Exam
            </button>
          </div>
        )}
      </main>

      {isCameraOn && (
        <div className="fixed bottom-4 right-4 w-64 h-48 bg-black rounded-lg overflow-hidden">
          <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
        </div>
      )}

      {isScreenSharing && (
        <div className="fixed bottom-4 left-4 w-64 h-48 bg-black rounded-lg overflow-hidden">
          <video ref={screenVideoRef} autoPlay muted className="w-full h-full object-cover" />
        </div>
      )}

      <WarningModal 
        isOpen={showWarningModal} 
        onClose={() => setShowWarningModal(false)}
      />
    </div>
  );
}

export default App;