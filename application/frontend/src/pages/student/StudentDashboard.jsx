import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, User, Clock, AlertCircle, CheckCircle, XCircle, Search, Home } from 'lucide-react';

export default function StudentDashboard() {
  // Get active tab from URL hash (default to 'home')
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'home';
  });
  
  // User state
  const [user, setUser] = useState(null);
  
  // Search state
  const [query, setQuery] = useState("");
  
  // Messages state
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messageFilter, setMessageFilter] = useState('all');

  // Load user from storage
  useEffect(() => {
    const raw = localStorage.getItem("demoUser") || sessionStorage.getItem("demoUser");
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        setUser(null);
      }
    }
  }, []);

  // Load messages when messages tab is active
  useEffect(() => {
    if (activeTab === 'messages') {
      loadMessages();
    }
  }, [activeTab]);

  // Update URL hash when tab changes
  useEffect(() => {
    window.location.hash = activeTab;
  }, [activeTab]);

  async function loadMessages() {
    setMessagesLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/student/messages', {
      //   credentials: 'include'
      // });
      // const data = await response.json();
      
      // Mock data
      const mockMessages = [
        {
          message_id: 1,
          recipient_tutor_name: "John Smith",
          recipient_tutor_user_id: 101,
          tutor_profile_id: 201,
          created_at: new Date().toISOString(),
          message_status: "Sent",
          message_content: "Hi, I need help with CSC 648 project",
        },
        {
          message_id: 2,
          recipient_tutor_name: "Sarah Johnson",
          recipient_tutor_user_id: 102,
          tutor_profile_id: 202,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          message_status: "Sent",
          message_content: "Can we schedule a session for calculus?",
        },
        {
          message_id: 3,
          recipient_tutor_name: "Mike Chen",
          recipient_tutor_user_id: 103,
          tutor_profile_id: 203,
          created_at: new Date(Date.now() - 172800000).toISOString(),
          message_status: "Reported",
          message_content: "Need help with Python assignment",
        },
      ];
      
      setMessages(mockMessages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      setMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  }

  const displayName = useMemo(() => {
    if (!user?.email) return "Student";
    const left = user.email.split("@")[0];
    if (!left) return "Student";
    return left.charAt(0).toUpperCase() + left.slice(1);
  }, [user]);

  function onSearch(e) {
    e.preventDefault();
    const target = query.trim();
    if (!target) {
      window.location.href = "/";
      return;
    }
    window.location.href = `/?q=${encodeURIComponent(target)}`;
  }

  function switchTab(tab) {
    setActiveTab(tab);
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Sent':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'Reported':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'Removed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <MessageSquare className="w-5 h-5 text-slate-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Sent':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Reported':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Removed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const filteredMessages = messages.filter(msg => {
    if (messageFilter === 'all') return true;
    return msg.message_status.toLowerCase() === messageFilter;
  });

  return (
    <section className="space-y-6 max-w-6xl mx-auto p-4">
      {/* Header Card with User Info and Tabs */}
      <div className="rounded-2xl border border-slate-300 bg-white shadow-sm">
        {/* User Welcome Section */}
        <div className="border-b border-slate-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-2xl">
                👤
              </div>
              <div>
                <div className="text-lg md:text-xl font-semibold">Welcome, {displayName}!</div>
                <div className="text-sm text-slate-600">SFSU Tutoring Platform</div>
              </div>
            </div>
            <a href="/" className="text-2xl hover:opacity-80" title="Home">
              🏠
            </a>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => switchTab('home')}
            className={`
              flex-1 px-6 py-3 text-sm font-medium transition-colors
              ${activeTab === 'home'
                ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }
            `}
          >
            <div className="flex items-center justify-center gap-2">
              <Search className="w-4 h-4" />
              <span>Find Tutors</span>
            </div>
          </button>
          <button
            onClick={() => switchTab('messages')}
            className={`
              flex-1 px-6 py-3 text-sm font-medium transition-colors relative
              ${activeTab === 'messages'
                ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }
            `}
          >
            <div className="flex items-center justify-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span>My Messages</span>
              {messages.length > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-blue-600 text-white">
                  {messages.length}
                </span>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* Search Section */}
            <div className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm">
              <h2 className="text-xl md:text-2xl font-bold text-center mb-4">Find A Tutor</h2>
              
              <form onSubmit={onSearch} className="flex items-center justify-center">
                <div className="flex items-center gap-2 rounded-full border border-slate-300 pl-4 pr-2 py-2 w-full max-w-lg bg-white">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by course, subject, or name"
                    className="flex-1 outline-none text-sm"
                  />
                  <button
                    type="submit"
                    className="grid place-items-center h-9 w-9 rounded-full bg-slate-900 text-white hover:bg-black"
                    aria-label="Search"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-4 w-4"
                    >
                      <circle cx="11" cy="11" r="7" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => switchTab('messages')}
                className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm hover:shadow-md transition-shadow text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">✉️</div>
                  <div>
                    <h3 className="font-semibold text-lg">My Messages</h3>
                    <p className="text-sm text-slate-600">
                      {messages.length} message{messages.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </button>

              <a
                href="/results"
                className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm hover:shadow-md transition-shadow block"
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">🔍</div>
                  <div>
                    <h3 className="font-semibold text-lg">Browse All Tutors</h3>
                    <p className="text-sm text-slate-600">View available tutors</p>
                  </div>
                </div>
              </a>
            </div>

            {/* Recent Activity */}
            <div className="rounded-2xl border border-slate-300 bg-white">
              <div className="border-b border-slate-200 p-4 font-semibold">Recent Activity</div>
              <div className="p-4 text-sm text-slate-700">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p>No scheduled tutoring sessions yet.</p>
                  <p>Start by finding a tutor!</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-4">
            {/* Message Filters */}
            <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-sm">
              <div className="flex gap-2 overflow-x-auto">
                {[
                  { key: 'all', label: 'All Messages', count: messages.length },
                  { key: 'sent', label: 'Sent', count: messages.filter(m => m.message_status === 'Sent').length },
                  { key: 'reported', label: 'Reported', count: messages.filter(m => m.message_status === 'Reported').length },
                  { key: 'removed', label: 'Removed', count: messages.filter(m => m.message_status === 'Removed').length },
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setMessageFilter(tab.key)}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                      ${messageFilter === tab.key
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                      }
                    `}
                  >
                    {tab.label}
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                      messageFilter === tab.key ? 'bg-blue-500' : 'bg-slate-200'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Messages List */}
            {messagesLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-slate-600">Loading messages...</p>
                </div>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-slate-700 mb-1">No messages found</h3>
                <p className="text-sm text-slate-500 mb-4">
                  {messageFilter === 'all' 
                    ? "You haven't sent any messages yet. Start by searching for a tutor!"
                    : `No ${messageFilter} messages to display.`
                  }
                </p>
                <button
                  onClick={() => switchTab('home')}
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Find a Tutor
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredMessages.map((msg, index) => (
                  <motion.div
                    key={msg.message_id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Tutor Info */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-slate-100 rounded-lg">
                            <User className="w-5 h-5 text-slate-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-900 truncate">
                              {msg.recipient_tutor_name}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <Clock className="w-3 h-3" />
                              <span>{formatDate(msg.created_at)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Message Preview */}
                        <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                          {msg.message_content}
                        </p>

                        {/* Metadata */}
                        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1">
                            <span className="font-medium">Profile ID:</span>
                            {msg.tutor_profile_id}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="inline-flex items-center gap-1">
                            <span className="font-medium">User ID:</span>
                            {msg.recipient_tutor_user_id}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="inline-flex items-center gap-1">
                            <span className="font-medium">Message ID:</span>
                            {msg.message_id}
                          </span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex flex-col items-end gap-2">
                        <div className={`
                          inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border
                          ${getStatusColor(msg.message_status)}
                        `}>
                          {getStatusIcon(msg.message_status)}
                          <span>{msg.message_status}</span>
                        </div>
                        
                        {/* Action Button */}
                        <a
                          href={`/tutors/${msg.tutor_profile_id}`}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline"
                        >
                          View Profile →
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Stats Footer */}
            {messages.length > 0 && (
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-slate-900">{messages.length}</div>
                    <div className="text-xs text-slate-600">Total Messages</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {messages.filter(m => m.message_status === 'Sent').length}
                    </div>
                    <div className="text-xs text-slate-600">Active</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">
                      {messages.filter(m => m.message_status === 'Reported').length}
                    </div>
                    <div className="text-xs text-slate-600">Reported</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </section>
  );
}