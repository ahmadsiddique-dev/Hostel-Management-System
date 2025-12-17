import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, X, Send, Minimize2, MessageSquare, GripHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { getAccessToken } from '@/utils/tokenManager';
import Draggable from 'react-draggable';
import ReactMarkdown from 'react-markdown';

const ChatbotWidget = ({ role, endpoint, title, context }) => {
  if (role === 'admin') return null;
  const STORAGE_KEY = `chat_history_${role}`;
  const [isOpen, setIsOpen] = useState(() => {
    return localStorage.getItem('chat_isOpen') === 'true';
  });

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [
      { id: 1, text: `Hello! I'm your ${role === 'visitor' ? 'Hostel' : 'AI'} Assistant. How can I help you?`, sender: 'bot' }
    ];
  });

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const nodeRef = useRef(null); // Reference for Draggable
  const token = getAccessToken();

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, isLoading]);

  // Persist State
  // useEffect(() => {
  //   localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  // }, [messages, role]);

  // useEffect(() => {
  //   localStorage.setItem('chat_isOpen', isOpen);
  // }, [isOpen]);

  // Handle Role Change (Load new history or default)
  useEffect(() => {
      setMessages([
        { id: Date.now(), text: `Hello! I'm your ${role === 'visitor' ? 'Hostel' : 'AI'} Assistant. How can I help you?`, sender: 'bot' }
      ]);
  }, [role]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMsg = { id: Date.now(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const headers = { 'Content-Type': 'application/json' }; 
      if (token && role !== 'visitor') {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const body = {
        prompt: userMsg.text,
        history: messages.slice(-10).map(m => ({ role: m.sender, content: m.text })) // Send last 10 messages
      };
      if (role === 'student' && context) {
        body.studentData = context;
        console.log("studentData", context);
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (data.status === 'success') {
        // Check if it's a JSON action (Admin) or text
        const aiText = typeof data.aiResponse === 'object' && data.aiResponse !== null
          ? "I've generated a database query for that: " + JSON.stringify(data.aiResponse, null, 2)
          : data.aiResponse;

        const botMsg = { id: Date.now() + 1, text: aiText, sender: 'bot' };
        setMessages(prev => [...prev, botMsg]);
      } else {
        throw new Error(data.message || 'Failed to get response');
      }

    } catch (error) {
      console.error('Chatbot Error:', error);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "Sorry, I'm having trouble connecting to the server.", sender: 'bot', isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50 animate-bounce-slow">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 transition-all hover:scale-110"
        >
          <Bot className="w-8 h-8" />
        </Button>
      </div>
    );
  }

  return (
    <Draggable nodeRef={nodeRef} handle=".drag-handle">
      <div ref={nodeRef} className="fixed bottom-6 right-6 z-[100] w-[350px] shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
        <Card className="border-primary/20 shadow-2xl overflow-hidden flex flex-col h-[500px]">
          <CardHeader className="p-3 bg-primary text-primary-foreground flex flex-row items-center justify-between drag-handle cursor-move select-none rounded-t-xl">
            <div className="flex items-center gap-2">
              <GripHorizontal className="w-5 h-5 opacity-70" />
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <CardTitle className="text-sm font-medium">{title || 'AI Assistant'}</CardTitle>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20 cursor-pointer" onClick={() => setIsOpen(false)}>
              <Minimize2 className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0 bg-background/95 backdrop-blur-sm flex-1 flex flex-col h-full overflow-hidden">
            <div className="flex-1 p-4 overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
              <div
                onWheel={(e) => e.stopPropagation()} // Prevent scroll from bubbling to parent
                style={{
                  overscrollBehavior: 'contain' // Prevent scroll chaining
                }}
                className="space-y-4 pb-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-start gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-primary/20' : 'bg-muted'}`}>
                        {msg.sender === 'user' ? <MessageSquare className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      <div className={`p-3 rounded-lg text-sm ${msg.sender === 'user'
                        ? 'bg-primary text-primary-foreground rounded-tr-none'
                        : msg.isError ? 'bg-destructive/10 text-destructive rounded-tl-none' : 'bg-muted text-foreground rounded-tl-none'
                        }`}>
                        {msg.sender === 'bot' ? (
                          <div className="prose prose-sm max-w-none dark:prose-invert break-words">
                            <ReactMarkdown>
                              {msg.text}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          msg.text
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted p-3 rounded-lg rounded-tl-none text-sm flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
            <div className="p-3 border-t bg-background mt-auto">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  placeholder="Type your question..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={!inputText.trim() || isLoading}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </Draggable>
  );
};

export default ChatbotWidget;
