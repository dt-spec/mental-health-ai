'use client';
import { useConversation } from '@11labs/react';
import { useCallback, useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

const moods = [
  { emoji: '😟', label: 'Struggling', color: '#FEE2E2' },
  { emoji: '😐', label: 'Neutral', color: '#FEF3C7' },
  { emoji: '🙂', label: 'Okay', color: '#DCFCE7' },
  { emoji: '😄', label: 'Great', color: '#DBEAFE' }
];

const affirmations = [
  "You're doing your best, and that's enough.",
  "Every step forward is progress.",
  "Your feelings are valid and important.",
  "It's okay to take things one moment at a time.",
  "You are stronger than you know."
];

const commonQuestions = [
  {
    category: "Emotional Support",
    icon: "💝",
    questions: [
      "I'm feeling anxious today",
      "How can I manage my stress?",
      "I'm having trouble sleeping",
      "I feel overwhelmed",
      "How can I practice self-care?"
    ]
  },
  {
    category: "Grounding & Mindfulness",
    icon: "🧘",
    questions: [
      "Help me ground myself",
      "Guide me through a breathing exercise",
      "What are some mindfulness techniques?",
      "How can I stay present?",
      "Help me relax right now"
    ]
  },
  {
    category: "Motivation Boost",
    icon: "✨",
    questions: [
      "I need some encouragement",
      "Help me set achievable goals",
      "How can I build better habits?",
      "I'm feeling stuck",
      "How can I celebrate small wins?"
    ]
  },
  {
    category: "Self-Reflection",
    icon: "🤔",
    questions: [
      "Help me understand my feelings",
      "How can I practice self-compassion?",
      "What are my strengths?",
      "How can I grow from this?",
      "Help me process my emotions"
    ]
  },
  {
    category: "Crisis Support",
    icon: "🆘",
    questions: [
      "I need immediate support",
      "How can I reach out for help?",
      "What are emergency resources?",
      "How can I stay safe?",
      "Who can I talk to?"
    ]
  }
];

export function Conversation() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [callDuration, setCallDuration] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [showQuestions, setShowQuestions] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [currentAffirmation, setCurrentAffirmation] = useState(affirmations[0]);
  
  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected');
      setStartTime(Date.now());
      setShowQuestions(false);
      setIsListening(true);
    },
    onDisconnect: () => {
      console.log('Disconnected');
      setStartTime(null);
      setShowQuestions(true);
      setShowAnalytics(true);
      setIsListening(false);
    },
    onMessage: (message) => {
      console.log('Message:', message);
      const content = typeof message === 'string' ? message : message.message || '';
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content,
        timestamp: Date.now()
      }]);
    },
    onError: (error) => {
      console.error('Error:', error);
      const errorMessage = typeof error === 'string' ? error : error.message || 'An error occurred';
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Error: ${errorMessage}`,
        timestamp: Date.now()
      }]);
    },
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (startTime) {
      timer = setInterval(() => {
        setCallDuration(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [startTime]);

  useEffect(() => {
    const affirmationInterval = setInterval(() => {
      setCurrentAffirmation(prev => {
        const currentIndex = affirmations.indexOf(prev);
        return affirmations[(currentIndex + 1) % affirmations.length];
      });
    }, 30000);

    return () => clearInterval(affirmationInterval);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startConversation = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await conversation.startSession({
        agentId: 'eGzlsAlVcxG9S2aijDK9',
      });
    } catch (error) {
      console.error('Failed to start conversation:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to start conversation';
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Error: ${errorMessage}`,
        timestamp: Date.now()
      }]);
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    try {
      await conversation.endSession();
    } catch (error) {
      console.error('Failed to stop conversation:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to stop conversation';
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Error: ${errorMessage}`,
        timestamp: Date.now()
      }]);
    }
  }, [conversation]);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.header}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1>Haven</h1>
            <p>Your compassionate mental health companion</p>
          </motion.div>
        </div>

        {!selectedMood && !conversation.status && (
          <motion.div 
            className={styles.moodSelector}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3>How are you feeling today?</h3>
            <div className={styles.moodGrid}>
              {moods.map((mood) => (
                <motion.button
                  key={mood.label}
                  className={styles.moodButton}
                  style={{ backgroundColor: mood.color }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedMood(mood.label)}
                >
                  <span className={styles.moodEmoji}>{mood.emoji}</span>
                  <span>{mood.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {selectedMood && !conversation.status && (
          <motion.div
            className={styles.affirmation}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p>{currentAffirmation}</p>
          </motion.div>
        )}

        <div className={styles.buttonContainer}>
          <motion.button
            onClick={startConversation}
            disabled={conversation.status === 'connected'}
            className={`${styles.button} ${conversation.status === 'connected' ? styles.disabled : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isListening ? (
              <div className={styles.listeningState}>
                <div className={styles.microphoneIcon} />
                <span>Listening...</span>
              </div>
            ) : (
              'Start Conversation'
            )}
          </motion.button>
          <motion.button
            onClick={stopConversation}
            disabled={conversation.status !== 'connected'}
            className={`${styles.button} ${styles.stopButton} ${conversation.status !== 'connected' ? styles.disabled : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Stop Conversation
          </motion.button>
        </div>

        {showQuestions && (
          <div className={styles.commonQuestions}>
            <h2>How can I help you today?</h2>
            {commonQuestions.map((category, index) => (
              <motion.div
                key={index}
                className={styles.questionCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div 
                  className={styles.categoryHeader}
                  onClick={() => setExpandedCategory(
                    expandedCategory === category.category ? null : category.category
                  )}
                >
                  <h3>
                    <span className={styles.categoryIcon}>{category.icon}</span>
                    {category.category}
                  </h3>
                  <span className={styles.expandIcon}>
                    {expandedCategory === category.category ? '−' : '+'}
                  </span>
                </div>
                <AnimatePresence>
                  {expandedCategory === category.category && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {category.questions.map((question, qIndex) => (
                        <motion.li
                          key={qIndex}
                          whileHover={{ x: 4 }}
                          onClick={() => {
                            console.log('Question clicked:', question);
                          }}
                        >
                          {question}
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}

        {showAnalytics && (
          <motion.div
            className={styles.adminPanel}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2>Conversation Insights</h2>
            <div className={styles.stats}>
              <div className={styles.statCard}>
                <h3>Total Duration</h3>
                <p>{formatDuration(callDuration)}</p>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
} 