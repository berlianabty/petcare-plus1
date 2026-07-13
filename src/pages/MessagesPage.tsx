import { useState, useRef, useEffect } from 'react';
import { Search, Send, MessageSquare, ArrowLeft } from 'lucide-react';
import Input from '../components/ui/Input';
import Avatar from '../components/ui/Avatar';
import { useMessageStore } from '../store/messageStore';

export default function MessagesPage() {
  const { conversations, activeConversationId, setActiveConversation, sendMessage, markAsRead } = useMessageStore();
  const [search, setSearch] = useState('');
  const [messageText, setMessageText] = useState('');
  const [mobileChat, setMobileChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find((c) => c.id === activeConversationId);

  const filtered = conversations.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages.length]);

  const handleSelect = (id: string) => {
    setActiveConversation(id);
    markAsRead(id);
    setMobileChat(true);
  };

  const handleSend = () => {
    if (!messageText.trim() || !activeConversationId) return;
    sendMessage(activeConversationId, messageText.trim());
    setMessageText('');
  };

  return (
    <div className="h-[calc(100vh-4rem)] lg:h-screen lg:ml-[260px] flex flex-col lg:flex-row">
      {/* Conversation List */}
      <div className={`w-full lg:w-1/3 border-r border-gray-100 dark:border-gray-800 flex flex-col ${mobileChat ? 'hidden lg:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Messages</h1>
          <Input
            placeholder="Search conversations..."
            leftIcon={<Search className="h-4 w-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800">
                <MessageSquare className="h-8 w-8 text-gray-300 dark:text-gray-600" />
              </div>
              <p className="mt-4 text-sm text-gray-500">No conversations found</p>
            </div>
          ) : (
            filtered.map((conv) => (
              <button
                key={conv.id}
                onClick={() => handleSelect(conv.id)}
                className={`w-full text-left p-4 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                  activeConversationId === conv.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
                    : 'border-l-4 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar name={conv.name} size="md" />
                    {conv.online && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-900" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{conv.name}</p>
                      <span className="text-xs text-gray-400 shrink-0">{conv.lastMessageTime}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-gray-500 truncate">{conv.lastMessage}</p>
                      {conv.unread && <span className="h-2 w-2 bg-blue-500 rounded-full shrink-0" />}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{conv.role}</p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className={`flex-1 flex flex-col ${mobileChat ? 'flex' : 'hidden lg:flex'}`}>
        {activeConversation ? (
          <>
            <div className="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-gray-800">
              <button onClick={() => setMobileChat(false)} className="lg:hidden text-gray-400 hover:text-gray-600">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="relative">
                <Avatar name={activeConversation.name} size="md" />
                {activeConversation.online && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-900" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{activeConversation.name}</p>
                <p className="text-xs text-emerald-500">{activeConversation.online ? 'Online' : 'Offline'}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
              {activeConversation.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
                >
                  <div className={`max-w-[75%] ${msg.sender === 'user' ? 'order-2' : ''}`}>
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-sm ${
                        msg.sender === 'user'
                          ? 'bg-blue-500 text-white rounded-br-md'
                          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-md shadow-sm border border-gray-100 dark:border-gray-700'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <p className={`text-xs text-gray-400 mt-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1"
                />
                <button
                  onClick={handleSend}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors shrink-0 active:scale-95"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800">
              <MessageSquare className="h-10 w-10 text-gray-300 dark:text-gray-600" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Select a conversation</h3>
            <p className="mt-1 text-sm text-gray-500">Choose a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
