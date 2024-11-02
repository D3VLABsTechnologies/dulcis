//page.tsx
'use client'

import { useState, useEffect, useRef, useMemo, useLayoutEffect } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Plus, Minus, Trash2, Check, Star, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactConfetti from 'react-confetti'
import { Instagram } from 'lucide-react'


//Types for menu and order items
type MenuItem = {
  id: number;
  name: string;
  icon: string;
  category: 'Meals' | 'Drinks' | 'Snacks';
}

type OrderItem = MenuItem & {
  quantity: number;
}

type OrderItems = {
  [key: string]: OrderItem;
}

// Menu data with categorized items
const menuItems: MenuItem[] = [
  // Meals
  { id: 1, name: 'French fries with chicken', icon: '🍟🍗', category: 'Meals' },
  { id: 2, name: 'French fries with Sausage', icon: '🍟🌭', category: 'Meals' },
  { id: 3, name: 'Loaded fries', icon: '🍟🧀', category: 'Meals' },
  { id: 4, name: 'Fried rice with chicken', icon: '🍚🍗', category: 'Meals' },
  { id: 5, name: 'Assorted Fried rice', icon: '🍚🥓', category: 'Meals' },
  { id: 6, name: 'Spicy chicken wings', icon: '🍗🌶️', category: 'Meals' },
  { id: 7, name: 'Pizza', icon: '🍕', category: 'Meals' },
  { id: 8, name: 'French fries with burger', icon: '🍟🍔', category: 'Meals' },
  { id: 9, name: 'French fries with burger and chicken', icon: '🍟🍔🍗', category: 'Meals' },
  
  // Drinks
  { id: 10, name: 'Boba', icon: '🧋', category: 'Drinks' },
  { id: 11, name: 'Sobolo Drink', icon: '🍹', category: 'Drinks' },
  { id: 12, name: 'Asana Drink', icon: '🥤', category: 'Drinks' },
  { id: 16, name: 'Smoothie', icon: '🥤', category: 'Drinks' },
  
  // Snacks
  { id: 13, name: 'Popsicle', icon: '🍦', category: 'Snacks' },
  { id: 14, name: 'Pie', icon: '🥧', category: 'Snacks' },
  { id: 15, name: 'Spring rolls', icon: '🥠', category: 'Snacks' },
  { id: 17, name: 'Sausage roll', icon: '🌭', category: 'Snacks' },
  { id: 18, name: 'Ice cream', icon: '🍦', category: 'Snacks' },
]


/**
 * Generates a deterministic random position based on a seed value
 * Used for creating consistent but random-looking floating animations
 */
const generateRandomPosition = (seed: number) => {
  // Use a seeded random number generator
  const random = (seed: number) => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
  
  return {
    left: `${random(seed) * 100}%`,
    top: `${random(seed + 1) * 100}%`,
  };
};

/**
 * Animated floating icon component that moves in a continuous pattern
 */
const FloatingIcon = ({ icon, seed, color }: { icon: string; seed: number; color: string }) => {
  const position = useMemo(() => generateRandomPosition(seed), [seed]);
  
  return (
    <motion.div
      className="absolute text-4xl sm:text-6xl opacity-20"
      initial={position}
      animate={{
        x: [0, 30, -30, 0],
        y: [0, -30, 30, 0],
        rotate: [0, 180, 360],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 20 + (seed % 10),
        repeat: Infinity,
        repeatType: "reverse",
        ease: "linear"
      }}
      style={{
        left: position.left,
        top: position.top,
        color: color,
      }}
    >
      {icon}
    </motion.div>
  );
};

/**
 * Animated glowing light effect component that creates ambient background lighting effects
 */
const GlowLight = ({ seed, color }: { seed: number; color: string }) => {
  const position = useMemo(() => generateRandomPosition(seed + 100), [seed]);
  
  return (
    <motion.div
      className="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full opacity-30"
      initial={position}
      animate={{
        x: [0, 50, -50, 0],
        y: [0, -50, 50, 0],
        scale: [1, 1.5, 1],
      }}
      transition={{
        duration: 15 + (seed % 10),
        repeat: Infinity,
        repeatType: "reverse",
        ease: "linear"
      }}
      style={{
        left: position.left,
        top: position.top,
        background: `radial-gradient(circle, ${color}40 0%, ${color}00 70%)`,
      }}
    />
  );
};

const SuccessAnimation = ({ onComplete }: { onComplete: () => void }) => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    // Update window size
    const updateWindowSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    updateWindowSize();
    window.addEventListener('resize', updateWindowSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', updateWindowSize);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ReactConfetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={false}
        numberOfPieces={200}
        gravity={0.2}
        colors={['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']}
      />
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 flex flex-col items-center max-w-[280px] sm:max-w-sm mx-auto relative"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <motion.div
          className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500 rounded-full flex items-center justify-center mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
        >
          <Check className="text-white w-8 h-8 sm:w-10 sm:h-10" />
        </motion.div>
        <motion.h2
          className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Thank You!
        </motion.h2>
        <motion.p
          className="text-gray-600 dark:text-gray-300 text-center text-sm sm:text-base"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Your feedback has been successfully submitted.
        </motion.p>
        <motion.button
          className="mt-6 px-6 py-2 bg-orange-500 text-white text-sm sm:text-base rounded-full hover:bg-orange-600 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          onClick={onComplete}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          Close
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

const glowColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];

// Update the styles definitions
const styles = `
  /* Improve the date input appearance on mobile */
  input[type="date"] {
    min-height: 2.5rem;
    -webkit-appearance: none;
    position: relative;
    display: block;
    width: 100%;
  }

  input[type="date"]::-webkit-calendar-picker-indicator {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    color: transparent;
    background: transparent;
    cursor: pointer;
  }

  .select-scroll-container {
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
  }
`;

const selectContentStyles = `
  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2
  relative z-50 min-w-[8rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-md 
  border border-gray-200 dark:border-gray-600 
  bg-white/60 dark:bg-gray-800/60 
  backdrop-blur-xl
  shadow-lg 
  before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/10 before:to-white/5 dark:before:from-white/5 dark:before:to-transparent
`;

const MobileDatePicker = ({ 
  isOpen, 
  onClose, 
  onSelect, 
  initialDate,
  darkMode 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSelect: (date: string) => void;
  initialDate?: string;
  darkMode: boolean;
}) => {
  const [selectedDate, setSelectedDate] = useState(() => {
    return initialDate || new Date().toISOString().split('T')[0];
  });

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={`w-full max-h-[90vh] rounded-t-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <button
            className="text-gray-500 dark:text-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="text-orange-500 font-semibold"
            onClick={() => {
              onSelect(selectedDate);
              onClose();
            }}
          >
            Done
          </button>
        </div>
        <div className="p-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className={`w-full p-4 text-lg rounded-lg border ${
              darkMode 
                ? 'bg-gray-700 text-white border-gray-600' 
                : 'bg-white border-gray-200'
            }`}
            style={{ 
              colorScheme: darkMode ? 'dark' : 'light',
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

/**
 * Interactive star rating component with hover effects
 */
const StarRating = ({ 
  rating, 
  onRatingChange, 
  darkMode 
}: { 
  rating: number; 
  onRatingChange: (rating: number) => void;
  darkMode: boolean;
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`transition-transform duration-200 ${
            hoverRating >= star || rating >= star
              ? 'text-yellow-400 scale-110'
              : `${darkMode ? 'text-gray-600' : 'text-gray-300'}`
          } hover:scale-125`}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => {
            onRatingChange(star);
          }}
        >
          <Star
            className={`w-8 h-8 sm:w-10 sm:h-10 ${
              hoverRating >= star || rating >= star ? 'fill-current' : ''
            }`}
          />
        </button>
      ))}
    </div>
  );
};

// Add this new component after SuccessAnimation
const ErrorAnimation = ({ onClose, message }: { onClose: () => void; message: string }) => {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 flex flex-col items-center max-w-[280px] sm:max-w-sm mx-auto relative"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <motion.div
          className="w-16 h-16 sm:w-20 sm:h-20 bg-red-500 rounded-full flex items-center justify-center mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
        >
          <X className="text-white w-8 h-8 sm:w-10 sm:h-10" />
        </motion.div>
        <motion.h2
          className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Submission Failed
        </motion.h2>
        <motion.p
          className="text-gray-600 dark:text-gray-300 text-center text-sm sm:text-base"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {message}
        </motion.p>
        <motion.button
          className="mt-6 px-6 py-2 bg-red-500 text-white text-sm sm:text-base rounded-full hover:bg-red-600 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          onClick={onClose}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          Try Again
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

/**
 * Main feedback form component: Handles order selection, ratings, and feedback submission
 */
export default function DulcisFeedbackForm() {
  // Add isSubmitting to the state variables
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State management for form data and UI
  const [orderItems, setOrderItems] = useState<OrderItems>({})
  const [date, setDate] = useState('')
  const [suggestion, setSuggestion] = useState('')
  const [mounted, setMounted] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const dateInputRef = useRef<HTMLInputElement>(null)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [rating, setRating] = useState(0);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

// Initialize dark mode based on system preferences
  useLayoutEffect(() => {
    setMounted(true)
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setDarkMode(mediaQuery.matches)
    
    const darkModeListener = (e: MediaQueryListEvent) => {
      setDarkMode(e.matches)
    }
    
    mediaQuery.addListener(darkModeListener)
    
    return () => {
      mediaQuery.removeListener(darkModeListener)
    }
  }, [])

  // Apply dark mode class to document root (Updates whenever dark mode state changes)
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Function to trigger haptic feedback (vibration)
  const triggerHaptic = () => {
    if (navigator.vibrate) {
      navigator.vibrate(10); // 10ms vibration
    }
  };

  // Add useEffect for styles
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  if (!mounted) {
    return null
  }

  const handleAddItem = (itemId: number) => {
    const item = menuItems.find(item => item.id === itemId)
    if (item) {
      const orderKey = `${itemId}`;
      setOrderItems(prev => ({
        ...prev,
        [orderKey]: { 
          ...item, 
          quantity: 1
        }
      }))
    }
  }

  const handleQuantityChange = (itemId: number | string, change: number) => {
    // Convert itemId to number if it's a string
    const numericId = typeof itemId === 'string' ? parseInt(itemId) : itemId;
    const orderKey = `${numericId}`;
    
    setOrderItems(prev => {
      const newQuantity = (prev[orderKey]?.quantity || 0) + change;
      if (newQuantity <= 0) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [orderKey]: removed, ...rest } = prev;
        return rest;
      }

      // If the item doesn't exist yet, create it
      if (!prev[orderKey]) {
        const menuItem = menuItems.find(item => item.id === numericId);
        if (!menuItem) return prev;
        
        return {
          ...prev,
          [orderKey]: {
            ...menuItem,
            quantity: newQuantity
          }
        };
      }

      // Update existing item
      return { 
        ...prev, 
        [orderKey]: { 
          ...prev[orderKey], 
          quantity: newQuantity 
        } 
      };
    });
  }

  // Handle form submission and API interaction
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const feedbackData = {
      orderItems: Object.values(orderItems).map(item => ({
        name: item.name,
        quantity: item.quantity
      })),
      date,
      suggestion,
      rating
    };

    try {
      const response = await Promise.race([
        fetch('/api/suggestions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(feedbackData),
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timed out')), 10000)
        )
      ]) as Response;

      if (response.ok) {
        setShowSuccess(true);
      } else {
        const errorData = await response.json().catch(() => ({ message: 'An unexpected error occurred' }));
        setErrorMessage(errorData.message || 'Failed to submit feedback. Please try again.');
        setShowError(true);
      }
    } catch (error: unknown) {
      setErrorMessage(
        (error as Error).message === 'Request timed out'
          ? 'Request timed out. Please check your connection and try again.'
          : 'An error occurred while submitting your feedback. Please try again.'
      );
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add a function to handle error close
  const handleErrorClose = () => {
    setShowError(false);
    setErrorMessage('');
  };

  const handleSuccessClose = () => {
    setShowSuccess(false)
    setOrderItems({})
    setDate('')
    setSuggestion('')
    //Reload the page after closing the success animation
    window.location.reload();
  }

  return (
    <div className={`min-h-screen py-6 sm:py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ease-in-out relative overflow-hidden ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-b from-orange-100 to-yellow-100'}`}>
      {menuItems.map((item, index) => (
        <FloatingIcon 
          key={item.id} 
          icon={item.icon} 
          seed={index} 
          color={glowColors[index % glowColors.length]} 
        />
      ))}
      {[...Array(15)].map((_, index) => (
        <GlowLight 
          key={index} 
          seed={index} 
          color={glowColors[index % glowColors.length]} 
        />
      ))}
      <Card className={`w-full max-w-3xl mx-auto ${darkMode ? 'bg-gray-800/80 text-white shadow-glow' : 'bg-white/80'} backdrop-blur-md shadow-xl transition-all duration-300 ease-in-out`}>
        <CardHeader className="text-center">
          <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 relative">
            <Image
              src="/logo.jpg"
              alt="DULCIS Logo"
              fill
              style={{ objectFit: "contain" }}
              className="rounded-full"
            />
          </div>
          <CardTitle className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>DULCIS Feedback</CardTitle>
          <CardDescription className={`text-base sm:text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            We value your suggestions to improve our service and food quality.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="order" className="text-base sm:text-lg font-medium">Please select the items you had</Label>
              <Select 
                onValueChange={(value) => {
                  triggerHaptic();
                  handleAddItem(parseInt(value));
                }}
              >
                <SelectTrigger id="order" className={`w-full ${darkMode ? 'bg-gray-700 text-white' : ''}`}>
                  <SelectValue placeholder="Select items to add" />
                </SelectTrigger>
                <SelectContent 
                  className={`${selectContentStyles} select-none`}
                  style={{ position: 'relative' }}
                >
                  {['Meals', 'Drinks', 'Snacks'].map((category) => (
                    <div key={category}>
                      <div className={`px-3 py-2 text-sm font-semibold border-t first:border-t-0 
                        ${darkMode 
                          ? 'bg-gray-700/90 text-orange-400 border-gray-600' 
                          : 'bg-orange-100/90 text-orange-800 border-orange-200'
                        } backdrop-blur-sm`}
                      >
                        {category}
                      </div>
                      {menuItems
                        .filter(item => item.category === category)
                        .map((item) => (
                          <SelectItem 
                            key={item.id} 
                            value={item.id.toString()}
                            className="flex items-start gap-2 whitespace-normal pr-4 ml-2 
                              hover:bg-white/20 dark:hover:bg-gray-700/50 
                              cursor-pointer 
                              data-[highlighted]:bg-white/20 dark:data-[highlighted]:bg-gray-700/50 
                              backdrop-blur-sm 
                              transition-colors duration-200"
                          >
                            <span className="flex-shrink-0">{item.icon}</span>
                            <span className="flex-1 min-w-0">
                              {item.name}
                            </span>
                          </SelectItem>
                        ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-4">
              {Object.entries(orderItems).map(([orderKey, item]) => (
                <div key={orderKey} className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <span className="flex items-center mb-2 sm:mb-0">
                    <span className="mr-2 text-2xl">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </span>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <div className="flex items-center">
                      <Button 
                        type="button" 
                        size="sm" 
                        variant="outline" 
                        onClick={() => {
                          triggerHaptic();
                          handleQuantityChange(item.id, -1);
                        }}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="mx-2 text-lg font-medium">{item.quantity}</span>
                      <Button 
                        type="button" 
                        size="sm" 
                        variant="outline" 
                        onClick={() => {
                          triggerHaptic();
                          handleQuantityChange(item.id, 1);
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => handleQuantityChange(item.id, -item.quantity)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="w-full">
              <div className="space-y-2 max-w-md mx-auto">
                <Label htmlFor="date" className="text-base sm:text-lg font-medium">Date of Purchase/Visit</Label>
                <div className="relative w-full">
                  {isMobile ? (
                    <Button
                      type="button"
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${
                        darkMode ? 'bg-gray-700 text-white' : ''
                      }`}
                      onClick={() => setIsDatePickerOpen(true)}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {date ? new Date(date).toLocaleDateString() : 'Select date'}
                    </Button>
                  ) : (
                    <Input
                      id="date"
                      type="date"
                      ref={dateInputRef}
                      value={date}
                      onChange={(e) => {
                        triggerHaptic();
                        setDate(e.target.value);
                      }}
                      className={`w-full ${
                        darkMode ? 'bg-gray-700 text-white' : ''
                      } pr-8`}
                      style={{ 
                        colorScheme: darkMode ? 'dark' : 'light',
                      }}
                    />
                  )}
                  {!isMobile && (
                    <Calendar 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" 
                      size={20}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rating" className="text-base sm:text-lg font-medium">Rate Your Order</Label>
              <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <StarRating 
                  rating={rating} 
                  onRatingChange={(newRating) => {
                    triggerHaptic();
                    setRating(newRating);
                  }}
                  darkMode={darkMode}
                />
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {rating === 0 ? 'Tap to rate' : 
                   rating === 1 ? 'Poor' :
                   rating === 2 ? 'Fair' :
                   rating === 3 ? 'Good' :
                   rating === 4 ? 'Very Good' : 'Excellent'}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="suggestion" className="text-base sm:text-lg font-medium">Anonymous Feedback</Label>
              <Textarea
                id="suggestion"
                placeholder="Please share your thoughts on our service or food..."
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                className={`w-full h-32 ${darkMode ? 'bg-gray-700 text-white' : ''}`}
              />
            </div>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col items-center space-y-4">
          <Button 
            className={`w-full font-bold py-3 rounded-full transition duration-300 ease-in-out transform hover:scale-105 ${
              darkMode 
                ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-glow-orange' 
                : 'bg-orange-500 hover:bg-orange-600 text-white'
            }`}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Submitting...</span>
              </div>
            ) : (
              'Submit Feedback'
            )}
          </Button>
          
          {/* Social Media Links */}
          <div className="flex items-center gap-4 mt-2">
            <a 
              href="https://x.com/dulcisgh" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`hover:scale-110 transition-transform ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}
            >
              <Image 
                src="/twitterx.svg" 
                alt="X (Twitter)" 
                width={20} 
                height={20}
                className={darkMode ? 'invert' : ''}
              />
            </a>
            <a 
              href="https://instagram.com/dulcis_gh" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`hover:scale-110 transition-transform ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}
            >
              <Instagram size={20} />
            </a>
            <a 
              href="https://tiktok.com/@dulcisgh" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`hover:scale-110 transition-transform ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}
            >
              <Image 
                src="/tiktok.svg" 
                alt="TikTok" 
                width={18} 
                height={18}
                className={darkMode ? 'invert' : ''}
              />
            </a>
          </div>

          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Powered by <span className="font-semibold">D3V.LABs</span> &copy; {new Date().getFullYear()}
          </div>
        </CardFooter>
      </Card>
      <AnimatePresence>
        {showSuccess && <SuccessAnimation onComplete={handleSuccessClose} />}
      </AnimatePresence>
      <AnimatePresence>
        {isDatePickerOpen && (
          <MobileDatePicker
            isOpen={isDatePickerOpen}
            onClose={() => setIsDatePickerOpen(false)}
            onSelect={setDate}
            initialDate={date}
            darkMode={darkMode}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showError && (
          <ErrorAnimation 
            onClose={handleErrorClose}
            message={errorMessage}
          />
        )}
      </AnimatePresence>
    </div>
  )
}