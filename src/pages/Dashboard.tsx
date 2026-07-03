import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Plus, 
  RefreshCw, 
  LogOut, 
  HardHat
} from 'lucide-react';

interface Task {
  title: string;
  assignee: string;
  completed: boolean;
}

interface Quote {
  id: string;
  quoteNumber: string;
  customerName: string;
  total: number;
  status: 'Draft' | 'Sent' | 'Follow-Up' | 'Won' | 'Lost';
  createdAt: string;
  followUpDate?: string;
  tasks?: Task[];
}

interface DashboardTask {
  quoteId: string;
  quoteNumber: string;
  customerName: string;
  taskIndex: number;
  title: string;
  assignee: string;
  completed: boolean;
}

export default function Dashboard() {
  const { user, businessProfile, refreshBusinessProfile } = useAuth();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  const fetchDashboardData = async (uid: string) => {
    try {
      const quotesRef = collection(db, 'users', uid, 'quotes');
      const querySnapshot = await getDocs(quotesRef);
      const loadedQuotes: Quote[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        loadedQuotes.push({
          id: doc.id,
          quoteNumber: data.quoteNumber || '',
          customerName: data.customerName || '',
          total: data.total || 0,
          status: data.status || 'Draft',
          createdAt: data.createdAt || '',
          followUpDate: data.followUpDate || '',
          tasks: data.tasks || []
        });
      });
      setQuotes(loadedQuotes);
    } catch (err) {
      console.error("Dashboard: Error fetching quotes:", err);
    }
  };

  const handleRefresh = async () => {
    if (!user) return;
    setRefreshing(true);
    await Promise.all([
      fetchDashboardData(user.uid),
      refreshBusinessProfile()
    ]);
    setRefreshing(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setLoading(true);
        await fetchDashboardData(currentUser.uid);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogout = () => {
    signOut(auth);
  };

  // 1. Pending Money: Quotes Sent or Follow-Up
  const pendingMoney = quotes
    .filter(q => q.status === 'Sent' || q.status === 'Follow-Up')
    .reduce((sum, q) => sum + q.total, 0);

  // 2. Won Money This Month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const wonThisMonth = quotes
    .filter(q => {
      if (q.status !== 'Won') return false;
      const createdDate = new Date(q.createdAt);
      return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
    })
    .reduce((sum, q) => sum + q.total, 0);

  // 3. Quotes to Follow-Up (Sent or Follow-Up)
  const toFollowUp = quotes.filter(q => q.status === 'Sent' || q.status === 'Follow-Up').length;

  // 4. Overdue Follow-ups (Sent or Follow-Up and followUpDate is in the past)
  const todayStr = new Date().toISOString().split('T')[0];
  const overdueQuotes = quotes.filter(q => {
    if (q.status !== 'Sent' && q.status !== 'Follow-Up') return false;
    if (!q.followUpDate) return false;
    return q.followUpDate < todayStr;
  });
  const overdueCount = overdueQuotes.length;

  // Gather tasks from quotes
  const allTasks: DashboardTask[] = [];
  quotes.forEach(q => {
    if (q.tasks && q.tasks.length > 0) {
      q.tasks.forEach((t, index) => {
        allTasks.push({
          quoteId: q.id,
          quoteNumber: q.quoteNumber,
          customerName: q.customerName,
          taskIndex: index,
          title: t.title,
          assignee: t.assignee,
          completed: t.completed
        });
      });
    }
  });

  const activeTasks = allTasks.filter(t => !t.completed);
  const completedTasks = allTasks.filter(t => t.completed);

  const handleToggleTask = async (task: DashboardTask) => {
    if (!user) return;
    
    const quoteIndex = quotes.findIndex(q => q.id === task.quoteId);
    if (quoteIndex === -1) return;
    
    const quoteToUpdate = quotes[quoteIndex];
    if (!quoteToUpdate.tasks) return;
    
    const updatedTasks = [...quoteToUpdate.tasks];
    updatedTasks[task.taskIndex] = {
      ...updatedTasks[task.taskIndex],
      completed: !task.completed
    };
    
    try {
      // Optimistically update local state first
      const updatedQuotes = [...quotes];
      updatedQuotes[quoteIndex] = {
        ...quoteToUpdate,
        tasks: updatedTasks
      };
      setQuotes(updatedQuotes);

      // Update Firestore document
      const quoteRef = doc(db, 'users', user.uid, 'quotes', task.quoteId);
      await updateDoc(quoteRef, { tasks: updatedTasks });
    } catch (err) {
      console.error("Dashboard: Error updating task checkbox:", err);
      // Revert local state on error
      const originalQuotes = [...quotes];
      setQuotes(originalQuotes);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F4F6]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-graphite border-t-hi-vis"></div>
      </div>
    );
  }

  const bizName = businessProfile?.name || 'mate';
  const displayGreeting = overdueCount > 0 
    ? `G'day ${bizName}! You've got ${overdueCount} quote${overdueCount > 1 ? 's' : ''} overdue for follow-up today.`
    : `G'day ${bizName}! All clear on follow-ups today. Good onya!`;

  return (
    <div className="min-h-screen bg-[#F4F4F6] pb-24 font-body">
      {/* Top Banner Header */}
      <div className="bg-graphite text-white px-6 py-8 border-b-4 border-hi-vis shadow-md">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-hi-vis flex items-center justify-center text-graphite shadow-md">
              <HardHat className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-display uppercase tracking-tight text-white leading-tight">
                {businessProfile?.name || 'TradieMate'}
              </h1>
              <p className="text-concrete text-sm uppercase tracking-wider font-mono">
                {businessProfile?.tradeType || 'General Trade'} Operations
              </p>
            </div>
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-md border border-steel bg-[#333] hover:bg-[#444] px-4 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all"
            >
              <RefreshCw className={`w-4 h-4 text-hi-vis ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-md bg-alert-orange hover:bg-white hover:text-graphite border border-alert-orange px-4 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all shadow-md"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* Today's Admin Assistant Greeting Panel */}
        <div className={`rounded-xl border-2 p-6 shadow-md relative overflow-hidden transition-all ${
          overdueCount > 0 
            ? 'bg-alert-orange/10 border-alert-orange' 
            : 'bg-white border-steel'
        }`}>
          {/* Decorative striped edge representing industrial warnings */}
          {overdueCount > 0 && (
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-alert-orange via-hi-vis to-alert-orange" />
          )}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {overdueCount > 0 ? (
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-alert-orange opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-alert-orange"></span>
                  </span>
                ) : (
                  <span className="h-2.5 w-2.5 rounded-full bg-aussie-teal inline-block"></span>
                )}
                <span className="text-[10px] font-bold uppercase tracking-wider text-concrete font-mono">Today's Admin Assistant</span>
              </div>
              <h2 className="text-xl font-bold text-graphite leading-snug">{displayGreeting}</h2>
              <p className="text-sm text-concrete">
                {overdueCount > 0 
                  ? 'Follow up with these clients soon to lock in the jobs.' 
                  : 'All quotes are in check. Keep up the ripper work!'}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              {overdueCount > 0 && (
                <Link
                  to={`/quotes/${overdueQuotes[0].id}`}
                  className="flex items-center justify-center gap-2 rounded-md bg-graphite text-white px-5 py-3 text-xs font-bold uppercase tracking-wider shadow hover:bg-concrete transition-all text-center"
                >
                  <Clock className="w-4 h-4 text-alert-orange" />
                  <span>Follow Up: {overdueQuotes[0].customerName}</span>
                </Link>
              )}
              <Link
                to="/quotes/new"
                className="flex items-center justify-center gap-2 rounded-md bg-hi-vis text-graphite px-5 py-3 text-xs font-bold uppercase tracking-wider shadow-md hover:bg-graphite hover:text-white transition-all text-center"
              >
                <Plus className="w-4 h-4" />
                <span>New Site Note</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Money Pending */}
          <div className="bg-white rounded-xl border border-steel p-5 shadow-sm space-y-3 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-alert-orange" />
            <div className="flex justify-between items-center text-concrete">
              <span className="text-xs font-bold uppercase tracking-wider font-mono">Pending Money</span>
              <Clock className="w-5 h-5 text-alert-orange" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-display text-graphite">
                ${pendingMoney.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <p className="text-xs text-concrete">Waiting on sent quotes</p>
            </div>
          </div>

          {/* Card 2: Won This Month */}
          <div className="bg-white rounded-xl border border-steel p-5 shadow-sm space-y-3 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-aussie-teal" />
            <div className="flex justify-between items-center text-concrete">
              <span className="text-xs font-bold uppercase tracking-wider font-mono">Won This Month</span>
              <TrendingUp className="w-5 h-5 text-aussie-teal" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-display text-graphite">
                ${wonThisMonth.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <p className="text-xs text-concrete">Jobs approved this month</p>
            </div>
          </div>

          {/* Card 3: Overdue Follow-ups */}
          <div className={`rounded-xl border p-5 shadow-sm space-y-3 relative overflow-hidden transition-all ${
            overdueCount > 0 ? 'bg-white border-alert-orange' : 'bg-white border-steel'
          }`}>
            <div className={`absolute top-0 left-0 w-1 h-full ${overdueCount > 0 ? 'bg-alert-orange' : 'bg-concrete'}`} />
            <div className="flex justify-between items-center text-concrete">
              <span className="text-xs font-bold uppercase tracking-wider font-mono">Overdue Quotes</span>
              <AlertTriangle className={`w-5 h-5 ${overdueCount > 0 ? 'text-alert-orange animate-pulse' : 'text-concrete'}`} />
            </div>
            <div className="space-y-1">
              <h3 className={`text-2xl font-display ${overdueCount > 0 ? 'text-alert-orange font-extrabold' : 'text-graphite'}`}>
                {overdueCount}
              </h3>
              <p className="text-xs text-concrete">Need urgent contact</p>
            </div>
          </div>

          {/* Card 4: Total Sent */}
          <div className="bg-white rounded-xl border border-steel p-5 shadow-sm space-y-3 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-graphite" />
            <div className="flex justify-between items-center text-concrete">
              <span className="text-xs font-bold uppercase tracking-wider font-mono">Active Quotes</span>
              <FileText className="w-5 h-5 text-graphite" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-display text-graphite">
                {toFollowUp}
              </h3>
              <p className="text-xs text-concrete">Sent & Follow-Up quotes</p>
            </div>
          </div>
        </div>

        {/* Site Operations Checklist Section */}
        <div className="bg-white rounded-xl border-2 border-steel shadow-lg overflow-hidden">
          <div className="bg-graphite text-white px-5 py-4 border-b border-steel flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-hi-vis" />
              <h3 className="font-display text-lg uppercase tracking-wider">Site Operations Checklist</h3>
            </div>
            {/* Tabs for switching active vs completed */}
            <div className="flex bg-[#333] p-1 rounded-lg border border-concrete/30 w-full sm:w-auto">
              <button
                onClick={() => setActiveTab('active')}
                className={`flex-1 sm:flex-initial px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
                  activeTab === 'active' 
                    ? 'bg-hi-vis text-graphite shadow' 
                    : 'text-concrete hover:text-white'
                }`}
              >
                Active ({activeTasks.length})
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`flex-1 sm:flex-initial px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
                  activeTab === 'completed' 
                    ? 'bg-hi-vis text-graphite shadow' 
                    : 'text-concrete hover:text-white'
                }`}
              >
                Completed ({completedTasks.length})
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Task list container */}
            {activeTab === 'active' ? (
              activeTasks.length > 0 ? (
                <div className="divide-y divide-steel border border-steel rounded-xl overflow-hidden bg-gray-50">
                  {activeTasks.map((task) => (
                    <div 
                      key={`${task.quoteId}-${task.taskIndex}`} 
                      className="p-4 flex items-start gap-4 hover:bg-white transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleToggleTask(task)}
                        className="mt-1 h-5 w-5 rounded border-steel text-hi-vis focus:ring-hi-vis focus:ring-offset-0 cursor-pointer"
                      />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-bold text-graphite leading-snug">{task.title}</p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-concrete font-mono">
                          <Link 
                            to={`/quotes/${task.quoteId}`} 
                            className="hover:underline font-bold text-graphite/70"
                          >
                            Job: {task.quoteNumber} - {task.customerName}
                          </Link>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1 bg-concrete/10 px-2 py-0.5 rounded text-graphite text-[10px] uppercase font-bold tracking-wider">
                            {task.assignee}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-steel rounded-xl">
                  <CheckCircle className="w-12 h-12 text-aussie-teal mx-auto mb-4" />
                  <h4 className="font-display text-lg uppercase tracking-wide text-graphite">All Clear, Mate!</h4>
                  <p className="text-concrete text-sm mt-1">No pending operational tasks on your queue.</p>
                </div>
              )
            ) : (
              completedTasks.length > 0 ? (
                <div className="divide-y divide-steel border border-steel rounded-xl overflow-hidden bg-gray-50">
                  {completedTasks.map((task) => (
                    <div 
                      key={`${task.quoteId}-${task.taskIndex}`} 
                      className="p-4 flex items-start gap-4 hover:bg-white transition-colors opacity-70"
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleToggleTask(task)}
                        className="mt-1 h-5 w-5 rounded border-steel text-hi-vis focus:ring-hi-vis focus:ring-offset-0 cursor-pointer"
                      />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-semibold text-concrete line-through leading-snug">{task.title}</p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-concrete font-mono">
                          <Link 
                            to={`/quotes/${task.quoteId}`} 
                            className="hover:underline text-concrete"
                          >
                            Job: {task.quoteNumber} - {task.customerName}
                          </Link>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1 bg-concrete/10 px-2 py-0.5 rounded text-concrete text-[10px] uppercase font-bold tracking-wider">
                            {task.assignee}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-steel rounded-xl">
                  <FileText className="w-12 h-12 text-steel mx-auto mb-4" />
                  <h4 className="font-display text-lg uppercase tracking-wide text-graphite">No Completed Tasks</h4>
                  <p className="text-concrete text-sm mt-1">Completed tasks from your quotes will appear here.</p>
                </div>
              )
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
