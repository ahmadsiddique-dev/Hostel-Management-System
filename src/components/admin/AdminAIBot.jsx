import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/store/authSlice';

const AdminAIBot = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector((state) => state.auth.user);
  
  // TEMPORARY DEBUG: Remove role check
  // if (!isAuthenticated || user?.role !== 'admin') return null;

  const [isOpen, setIsOpen] = useState(false);
  // Hardcode position to top-left to ensure it's visible
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragStartTime, setDragStartTime] = useState(0);
  
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello Admin! I'm your AI assistant. How can I help you manage the hostel today?", sender: 'bot' }
  ]);
  const [inputText, setInputText] = useState('');
  const botRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Handle Dragging
  const handleMouseDown = (e) => {
    // Only allow left click for dragging
    if (e.button !== 0) return;
    if (e.target.closest('.no-drag')) return; 
    
    setIsDragging(true);
    setDragStartTime(Date.now());
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Boundary checks for the ICON
      const maxX = window.innerWidth - 60;
      const maxY = window.innerHeight - 60;
      
      setPosition({
        x: Math.min(Math.max(0, newX), maxX),
        y: Math.min(Math.max(0, newY), maxY)
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Add user message
    const userMsg = { id: Date.now(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Simulate bot response (Mock)
    setTimeout(() => {
      const botMsg = { 
        id: Date.now() + 1, 
        text: "I'm currently in demo mode. Soon I'll be connected to the database to answer your queries about students, rooms, and finances!", 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, botMsg]);
    }, 1000);
  };

  // Calculate Chat Window Position to keep it on screen
  const getChatPosition = () => {
    const chatWidth = 350;
    const chatHeight = 450; // Approx height
    
    let left = position.x - chatWidth + 60; // Default: open to left of icon
    let top = position.y - chatHeight + 60; // Default: open above icon

    // Check right boundary
    if (left + chatWidth > window.innerWidth) {
      left = window.innerWidth - chatWidth - 20;
    }
    // Check left boundary
    if (left < 0) {
      left = 20;
    }
    
    // Check bottom boundary
    if (top + chatHeight > window.innerHeight) {
      top = window.innerHeight - chatHeight - 20;
    }
    // Check top boundary
    if (top < 0) {
      top = 20;
    }

    return { left, top };
  };

  if (isOpen) {
    const chatPos = getChatPosition();
    return (
      <div 
        style={{ 
          position: 'fixed', 
          left: chatPos.left,
          top: chatPos.top,
          zIndex: 9999 
        }}
        className="w-[350px] shadow-2xl animate-in fade-in zoom-in duration-200"
      >
        <Card className="border-primary/20 shadow-2xl">
          <CardHeader className="p-3 bg-primary text-primary-foreground rounded-t-lg flex flex-row items-center justify-between cursor-move" onMouseDown={handleMouseDown}>
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <CardTitle className="text-sm font-medium">Hostel AI Assistant</CardTitle>
            </div>
            <div className="flex items-center gap-1 no-drag">
              <Button variant="ghost" size="icon" className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20" onClick={() => setIsOpen(false)}>
                <Minimize2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 bg-background/95 backdrop-blur-sm">
            <ScrollArea className="h-[350px] p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-start gap-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                      <Avatar className="w-8 h-8 border">
                        {msg.sender === 'bot' ? (
                          <div className="w-full h-full bg-primary flex items-center justify-center text-primary-foreground">
                            <Bot className="w-5 h-5" />
                          </div>
                        ) : (
                          <AvatarFallback>AD</AvatarFallback>
                        )}
                      </Avatar>
                      <div className={`p-3 rounded-lg text-sm ${
                        msg.sender === 'user' 
                          ? 'bg-primary text-primary-foreground rounded-tr-none' 
                          : 'bg-muted text-foreground rounded-tl-none'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            <div className="p-3 border-t bg-background">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input 
                  placeholder="Ask about students, rooms..." 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={!inputText.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      ref={botRef}
      style={{ 
        position: 'fixed', 
        left: position.x, 
        top: position.y, 
        zIndex: 999999,
        touchAction: 'none',
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={() => setIsOpen(true)}
      className="cursor-move group"
    >
      <div 
        className="w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform cursor-pointer relative"
      >
        <Bot className="w-7 h-7" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
        </span>
      </div>
    </div>
  );
};

export default AdminAIBot;
