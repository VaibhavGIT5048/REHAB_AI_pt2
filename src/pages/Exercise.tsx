import React, { useState, useEffect } from 'react';
import { Camera, Play, Pause, RotateCcw, CheckCircle, AlertTriangle, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExerciseSession {
  name: string;
  sets: number;
  reps: number;
  description: string;
  image: string;
}

const currentExercise: ExerciseSession = {
  name: "Wall Sit",
  sets: 3,
  reps: 30,
  description: "Stand with your back against a wall, slide down until your thighs are parallel to the floor. Hold this position.",
  image: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=800"
};

const Exercise = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentSet, setCurrentSet] = useState(1);
  const [currentRep, setCurrentRep] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [restTime, setRestTime] = useState(0);
  const [formFeedback, setFormFeedback] = useState<'good' | 'warning' | 'error'>('good');
  const [sessionComplete, setSessionComplete] = useState(false);
  const [aiDetected, setAiDetected] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeRemaining > 0 && !restTime) {
      interval = setInterval(() => {
        setTimeRemaining(time => {
          if (time <= 1) {
            setCurrentRep(prev => prev + 1);
            if (currentRep + 1 >= currentExercise.reps) {
              if (currentSet < currentExercise.sets) {
                setCurrentSet(prev => prev + 1);
                setCurrentRep(0);
                setRestTime(60); // 60 second rest
                return 30; // Reset timer
              } else {
                setSessionComplete(true);
                setIsActive(false);
                return 0;
              }
            }
            return 30; // Reset for next rep
          }
          return time - 1;
        });
      }, 1000);
    } else if (restTime > 0) {
      interval = setInterval(() => {
        setRestTime(time => time - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeRemaining, restTime, currentRep, currentSet]);

  // Simulate AI feedback
  useEffect(() => {
    if (isActive) {
      const feedbackInterval = setInterval(() => {
        const feedbacks: ('good' | 'warning' | 'error')[] = ['good', 'good', 'good', 'warning', 'good'];
        setFormFeedback(feedbacks[Math.floor(Math.random() * feedbacks.length)]);
        setAiDetected(Math.random() > 0.3);
      }, 2000);

      return () => clearInterval(feedbackInterval);
    }
  }, [isActive]);

  const startExercise = () => {
    setIsActive(true);
    setAiDetected(true);
  };

  const pauseExercise = () => {
    setIsActive(false);
  };

  const resetExercise = () => {
    setIsActive(false);
    setCurrentSet(1);
    setCurrentRep(0);
    setTimeRemaining(30);
    setRestTime(0);
    setSessionComplete(false);
  };

  const getFeedbackMessage = () => {
    switch (formFeedback) {
      case 'good':
        return 'Perfect form! Keep it up! 👍';
      case 'warning':
        return 'Straighten your back slightly ⚠️';
      case 'error':
        return 'Adjust your posture - too low! ❌';
      default:
        return '';
    }
  };

  const getFeedbackColor = () => {
    switch (formFeedback) {
      case 'good':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Camera Feed */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">AI Exercise Tracker</h2>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                aiDetected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>
                <div className={`w-2 h-2 rounded-full ${aiDetected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span>{aiDetected ? 'AI Tracking Active' : 'Initializing...'}</span>
              </div>
            </div>
          </div>

          {/* Camera View */}
          <div className="relative aspect-video bg-gray-900">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Camera Feed</p>
                <p className="text-sm opacity-75">AI tracking your movements</p>
              </div>
            </div>

            {/* AI Overlay */}
            {aiDetected && (
              <div className="absolute inset-0">
                {/* Pose points simulation */}
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute top-1/4 left-1/3 w-3 h-3 bg-teal-400 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                  className="absolute top-1/4 right-1/3 w-3 h-3 bg-teal-400 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                  className="absolute top-2/3 left-1/3 w-3 h-3 bg-teal-400 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                  className="absolute top-2/3 right-1/3 w-3 h-3 bg-teal-400 rounded-full"
                />

                {/* Skeleton lines */}
                <svg className="absolute inset-0 w-full h-full">
                  <line x1="33%" y1="25%" x2="67%" y2="25%" stroke="#14B8A6" strokeWidth="2" />
                  <line x1="33%" y1="25%" x2="33%" y2="67%" stroke="#14B8A6" strokeWidth="2" />
                  <line x1="67%" y1="25%" x2="67%" y2="67%" stroke="#14B8A6" strokeWidth="2" />
                  <line x1="33%" y1="67%" x2="67%" y2="67%" stroke="#14B8A6" strokeWidth="2" />
                </svg>
              </div>
            )}

            {/* Form Feedback Overlay */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`absolute top-4 left-4 right-4 p-3 rounded-lg border text-center font-medium ${getFeedbackColor()}`}
                >
                  {getFeedbackMessage()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Exercise Controls */}
        <div className="space-y-6">
          {/* Exercise Info */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-start space-x-4">
              <img
                src={currentExercise.image}
                alt={currentExercise.name}
                className="w-20 h-20 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{currentExercise.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{currentExercise.description}</p>
              </div>
            </div>
          </div>

          {/* Progress Display */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="text-center mb-6">
              <div className="text-6xl font-bold text-teal-600 mb-2">
                {restTime > 0 ? restTime : timeRemaining}
              </div>
              <p className="text-gray-600">
                {restTime > 0 ? 'Rest Time' : 'Seconds Remaining'}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{currentSet}</div>
                <p className="text-sm text-gray-600">Current Set</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{currentRep}</div>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{currentExercise.sets}</div>
                <p className="text-sm text-gray-600">Total Sets</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
              <motion.div
                className="bg-teal-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ 
                  width: `${((currentSet - 1) * currentExercise.reps + currentRep) / (currentExercise.sets * currentExercise.reps) * 100}%` 
                }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Controls */}
            <div className="flex justify-center space-x-4">
              {!isActive ? (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={startExercise}
                  className="bg-teal-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-teal-600 transition-colors flex items-center space-x-2"
                >
                  <Play className="h-5 w-5" />
                  <span>Start Exercise</span>
                </motion.button>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={pauseExercise}
                  className="bg-yellow-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-yellow-600 transition-colors flex items-center space-x-2"
                >
                  <Pause className="h-5 w-5" />
                  <span>Pause</span>
                </motion.button>
              )}
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={resetExercise}
                className="bg-gray-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-600 transition-colors flex items-center space-x-2"
              >
                <RotateCcw className="h-5 w-5" />
                <span>Reset</span>
              </motion.button>
            </div>
          </div>

          {/* Session Stats */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h4 className="font-bold text-gray-900 mb-4">Session Stats</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-xl">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-700">Form Accuracy</span>
                </div>
                <div className="text-2xl font-bold text-green-600">85%</div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-xl">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-700">Consistency</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">92%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Session Complete Modal */}
      <AnimatePresence>
        {sessionComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Trophy className="h-10 w-10 text-teal-600" />
              </motion.div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Great Job! 🎉</h3>
              <p className="text-gray-600 mb-6">
                You've completed your {currentExercise.name} session with excellent form!
              </p>
              
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-teal-600">{currentExercise.sets}</div>
                    <div className="text-sm text-gray-600">Sets</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-teal-600">85%</div>
                    <div className="text-sm text-gray-600">Accuracy</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-teal-600">12m</div>
                    <div className="text-sm text-gray-600">Duration</div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setSessionComplete(false)}
                className="w-full bg-teal-500 text-white py-3 rounded-xl font-medium hover:bg-teal-600 transition-colors"
              >
                Continue
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Exercise;