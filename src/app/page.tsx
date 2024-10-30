'use client'

import { useState, useEffect, useRef, useMemo, useLayoutEffect } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Plus, Minus, Trash2, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type MenuItem = {
  id: number;
  name: string;
  price: number;
  icon: string;
  sizes: string[];
}

type OrderItem = MenuItem & {
  quantity: number;
  size: string;
}

type OrderItems = {
  [key: number]: OrderItem;
}

const menuItems = [
  { id: 1, name: 'French fries with chicken', price: 25, icon: '🍟🍗', sizes: ['Small', 'Medium', 'Large'] },
  { id: 2, name: 'French fries with Sausage', price: 23, icon: '🍟🌭', sizes: ['Small', 'Medium', 'Large'] },
  { id: 3, name: 'Loaded fries', price: 30, icon: '🍟🧀', sizes: ['Small', 'Medium', 'Large'] },
  { id: 4, name: 'Fried rice with chicken', price: 28, icon: '🍚🍗', sizes: ['Small', 'Regular', 'Family'] },
  { id: 5, name: 'Assorted Fried rice', price: 32, icon: '🍚🥓', sizes: ['Small', 'Regular', 'Family'] },
  { id: 6, name: 'Spicy chicken wings', price: 35, icon: '🍗🌶️', sizes: ['6 pcs', '12 pcs', '18 pcs'] },
  { id: 7, name: 'Pizza', price: 45, icon: '🍕', sizes: ['Small', 'Medium', 'Large'] },
  { id: 8, name: 'French fries with burger', price: 35, icon: '🍟🍔', sizes: ['Small', 'Medium', 'Large'] },
  { id: 9, name: 'French fries with burger and chicken', price: 40, icon: '🍟🍔🍗', sizes: ['Small', 'Medium', 'Large'] },
  { id: 10, name: 'Boba', price: 15, icon: '🧋', sizes: ['Regular', 'Large'] },
  { id: 11, name: 'Sobolo Drink', price: 10, icon: '🍹', sizes: ['Small', 'Medium', 'Large'] },
  { id: 12, name: 'Asana Drink', price: 10, icon: '🥤', sizes: ['Small', 'Medium', 'Large'] },
  { id: 13, name: 'Popsicle', price: 5, icon: '🍦', sizes: ['Regular'] },
  { id: 14, name: 'Pie', price: 15, icon: '🥧', sizes: ['Slice', 'Whole'] },
  { id: 15, name: 'Spring rolls', price: 20, icon: '🥠', sizes: ['4 pcs', '8 pcs'] },
  { id: 16, name: 'Smoothie', price: 18, icon: '🥤', sizes: ['Small', 'Medium', 'Large'] },
]

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

const SuccessAnimation = ({ onComplete }: { onComplete: () => void }) => (
  <motion.div
    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      className="bg-white rounded-lg p-8 flex flex-col items-center max-w-sm mx-4"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <motion.div
        className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-4"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
      >
        <Check className="text-white" size={48} />
      </motion.div>
      <motion.h2
        className="text-2xl font-bold text-gray-800 mb-2 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        Thank You!
      </motion.h2>
      <motion.p
        className="text-gray-600 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Your feedback has been successfully submitted.
      </motion.p>
      <motion.button
        className="mt-6 px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
        onClick={onComplete}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        Close
      </motion.button>
    </motion.div>
  </motion.div>
)

export default function DulcisFeedbackForm() {
  const [orderItems, setOrderItems] = useState<OrderItems>({})
  const [date, setDate] = useState('')
  const [branch, setBranch] = useState('')
  const [suggestion, setSuggestion] = useState('')
  const [mounted, setMounted] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const dateInputRef = useRef<HTMLInputElement>(null)

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

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  if (!mounted) {
    return null
  }

  const handleAddItem = (itemId: number) => {
    const item = menuItems.find(item => item.id === itemId)
    if (item) {
      setOrderItems(prev => ({
        ...prev,
        [itemId]: { ...item, quantity: (prev[itemId]?.quantity || 0) + 1, size: item.sizes[0] }
      }))
    }
  }

  const handleQuantityChange = (itemId: number, change: number) => {
    setOrderItems(prev => {
      const newQuantity = (prev[itemId]?.quantity || 0) + change
      if (newQuantity <= 0) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [itemId]: removed, ...rest } = prev
        return rest
      }
      return { ...prev, [itemId]: { ...prev[itemId], quantity: newQuantity } }
    })
  }

  const handleSizeChange = (itemId: number, size: string) => {
    setOrderItems(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], size }
    }))
  }

  const getItemPrice = (item: OrderItem) => {
    const basePrice = item.price
    const sizeIndex = item.sizes.indexOf(item.size)
    return basePrice * (1 + sizeIndex * 0.2)
  }

  const calculateTotal = () => {
    return Object.values(orderItems).reduce((total: number, item: OrderItem) => 
      total + getItemPrice(item) * item.quantity, 0
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const feedbackData = {
      orderItems: Object.values(orderItems).map(item => ({
        name: item.name,
        quantity: item.quantity,
        size: item.size,
        price: getItemPrice(item)
      })),
      total: calculateTotal(),
      date,
      branch,
      suggestion
    };
  
    try {
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackData),
      });
  
      if (response.ok) {
        setShowSuccess(true); // Show success animation
      } else {
        console.error('Submission failed');
      }
    } catch (error) {
      console.error('Error sending feedback:', error);
    }
  };
  

  const handleSuccessClose = () => {
    setShowSuccess(false)
    setOrderItems({})
    setDate('')
    setBranch('')
    setSuggestion('')
  }

  const selectContentStyles = `
  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2
  relative z-50 min-w-[8rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-md border bg-white/80 backdrop-blur-lg shadow-md dark:bg-gray-800/80
`

  const glowColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']

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
              <Select onValueChange={(value) => handleAddItem(parseInt(value))}>
                <SelectTrigger id="order" className={`w-full ${darkMode ? 'bg-gray-700 text-white' : ''}`}>
                  <SelectValue placeholder="Select items to add" />
                </SelectTrigger>
                <SelectContent className={selectContentStyles}>
                  {menuItems.map((item) => (
                    <SelectItem 
                      key={item.id} 
                      value={item.id.toString()}
                      className="flex items-start gap-2 whitespace-normal pr-4"
                    >
                      <span className="flex-shrink-0">{item.icon}</span>
                      <span className="flex-1 min-w-0">
                        {item.name} - GHS {item.price.toFixed(2)}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-4">
              {Object.values(orderItems).map((item) => (
                <div key={item.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <span className="flex items-center mb-2 sm:mb-0">
                    <span className="mr-2 text-2xl">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </span>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    {item.sizes && (
                      <Select value={item.size} onValueChange={(size) => handleSizeChange(item.id, size)}>
                        <SelectTrigger className={`w-24 ${darkMode ? 'bg-gray-600 text-white' : ''}`}>
                          <SelectValue>{item.size}</SelectValue>
                        </SelectTrigger>
                        <SelectContent className={selectContentStyles}>
                          {item.sizes.map((size) => (
                            <SelectItem key={size} value={size}>{size}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    <div className="flex items-center">
                      <Button type="button" size="sm" variant="outline" onClick={() => handleQuantityChange(item.id, -1)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="mx-2 text-lg font-medium">{item.quantity}</span>
                      <Button type="button" size="sm" variant="outline" onClick={() => handleQuantityChange(item.id, 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button type="button" size="sm" variant="destructive" onClick={() => handleQuantityChange(item.id, -item.quantity)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium">GHS  {(getItemPrice(item) * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className={`text-right text-xl sm:text-2xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
              Total: GHS {calculateTotal().toFixed(2)}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-base sm:text-lg font-medium">Date of Purchase/Visit</Label>
                <div className="relative w-full flex items-center">
                  <Input
                    id="date"
                    type="date"
                    ref={dateInputRef}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={`w-full ${darkMode ? 'bg-gray-700 text-white' : ''}`}
                    style={{ 
                      colorScheme: darkMode ? 'dark' : 'light',
                    }}
                  />
                  <div 
                    className="absolute right-3 flex items-center justify-center cursor-pointer"
                    onClick={() => dateInputRef.current?.showPicker()}
                  >
                    <Calendar 
                      className="text-gray-400" 
                      size={20}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch" className="text-base sm:text-lg font-medium">DULCIS Branch</Label>
                <Select value={branch} onValueChange={setBranch}>
                  <SelectTrigger id="branch" className={`w-full ${darkMode ? 'bg-gray-700 text-white' : ''}`}>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent className={selectContentStyles}>
                    <SelectItem value="downtown">JEGA Hostel</SelectItem>
                    <SelectItem value="uptown">GUSS Hostel</SelectItem>
                    <SelectItem value="suburb">Town</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="suggestion" className="text-base sm:text-lg font-medium">Your Feedback</Label>
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
          >
            Submit Feedback
          </Button>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Powered by <span className="font-semibold">D3V.LABs</span>
          </div>
        </CardFooter>
      </Card>
      <AnimatePresence>
        {showSuccess && <SuccessAnimation onComplete={handleSuccessClose} />}
      </AnimatePresence>
    </div>
  )
}