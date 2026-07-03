import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { FileText, Plus, Search, Copy, Check, Clock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface Quote {
  id: string;
  quoteNumber: string;
  customerName: string;
  customerPhone?: string;
  jobAddress: string;
  total: number;
  status: 'Draft' | 'Sent' | 'Follow-Up' | 'Won' | 'Lost';
  createdAt: string;
  followUpDate?: string;
  lineItems?: any[];
  subtotal?: number;
  gst?: number;
  terms?: string;
  footer?: string;
}

export default function Quotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Draft' | 'Sent' | 'Follow-Up' | 'Won' | 'Lost' | 'Overdue'>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { businessProfile } = useAuth();

  const handleCopyQuoteText = (e: React.MouseEvent, q: Quote) => {
    e.preventDefault();
    e.stopPropagation();
    
    const bizName = businessProfile?.name || businessProfile?.businessName || 'TradieMate';
    
    let text = `=== QUOTE: ${q.quoteNumber} ===\n`;
    text += `From: ${bizName}\n`;
    if (businessProfile?.abn) text += `ABN: ${businessProfile.abn}\n`;
    if (businessProfile?.phone) text += `Phone: ${businessProfile.phone}\n`;
    text += `-----------------------------------\n`;
    text += `Customer: ${q.customerName}\n`;
    if (q.customerPhone) text += `Phone: ${q.customerPhone}\n`;
    if (q.jobAddress) text += `Site Address: ${q.jobAddress}\n`;
    text += `-----------------------------------\n`;
    
    if (q.lineItems && q.lineItems.length > 0) {
      text += `Line Items:\n`;
      q.lineItems.forEach((item) => {
        text += `- ${item.description}: Qty ${item.quantity} x $${item.unitPrice.toFixed(2)} = $${item.total.toFixed(2)}\n`;
      });
      text += `-----------------------------------\n`;
    }
    text += `Subtotal: $${(q.subtotal || 0).toFixed(2)}\n`;
    text += `GST (10%): $${(q.gst || 0).toFixed(2)}\n`;
    text += `TOTAL: $${q.total.toFixed(2)}\n`;
    if (q.terms) text += `\nTerms: ${q.terms}\n`;
    if (q.footer) text += `\n${q.footer}\n`;

    navigator.clipboard.writeText(text);
    setCopiedId(q.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          console.log("Quotes page: User authenticated", user.uid);
          const quotesRef = collection(db, 'users', user.uid, 'quotes');
          const q = query(quotesRef, orderBy('createdAt', 'desc'));
          console.log("Quotes page: Requesting getDocs from Firestore...");
          const querySnapshot = await getDocs(q);
          console.log("Quotes page: getDocs completed successfully");
          const loadedQuotes: Quote[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            loadedQuotes.push({
              id: doc.id,
              quoteNumber: data.quoteNumber || '',
              customerName: data.customerName || '',
              customerPhone: data.customerPhone || '',
              jobAddress: data.jobAddress || '',
              total: data.total || 0,
              status: data.status || 'Draft',
              createdAt: data.createdAt || '',
              followUpDate: data.followUpDate || '',
              lineItems: data.lineItems || [],
              subtotal: data.subtotal || 0,
              gst: data.gst || 0,
              terms: data.terms || '',
              footer: data.footer || ''
            });
          });
          setQuotes(loadedQuotes);
        } catch (err) {
          console.error("Quotes page: Error loading quotes from Firestore:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const filteredQuotes = quotes.filter((q) => {
    const matchesSearch =
      q.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.jobAddress.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesStatus = false;
    if (statusFilter === 'All') {
      matchesStatus = true;
    } else if (statusFilter === 'Overdue') {
      const isQuoteOverdue = (q.status === 'Sent' || q.status === 'Follow-Up') && q.followUpDate && new Date(q.followUpDate) < new Date(new Date().setHours(0,0,0,0));
      matchesStatus = !!isQuoteOverdue;
    } else {
      matchesStatus = q.status === statusFilter;
    }

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: 'Draft' | 'Sent' | 'Follow-Up' | 'Won' | 'Lost') => {
    switch (status) {
      case 'Won':
        return <span className="inline-flex items-center rounded-md bg-aussie-teal/10 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-aussie-teal border border-aussie-teal/30">Won</span>;
      case 'Lost':
        return <span className="inline-flex items-center rounded-md bg-alert-orange/10 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-alert-orange border border-alert-orange/30">Lost</span>;
      case 'Sent':
        return <span className="inline-flex items-center rounded-md bg-hi-vis/10 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-graphite border border-hi-vis/40">Sent</span>;
      case 'Follow-Up':
        return <span className="inline-flex items-center rounded-md bg-concrete/10 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-concrete border border-concrete/40">Follow-Up</span>;
      default:
        return <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-concrete border border-gray-300">Draft</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F4F6]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-graphite border-t-hi-vis"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F4F6] pb-24 font-body">
      {/* Page Header */}
      <div className="bg-graphite text-white px-6 py-8 border-b-4 border-hi-vis shadow-md">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-hi-vis flex items-center justify-center text-graphite shadow-md">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-display uppercase tracking-tight text-white">Quotes</h1>
              <p className="text-concrete text-sm uppercase tracking-wider font-mono">Manage your clients proposals</p>
            </div>
          </div>
          <Link
            to="/quotes/new"
            className="flex items-center gap-2 rounded-md bg-hi-vis px-4 py-3 text-sm font-bold uppercase tracking-wider text-graphite shadow-md hover:bg-white transition-all"
          >
            <Plus className="w-4 h-4 text-graphite" />
            <span>Create Quote</span>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-steel shadow-sm">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-concrete" />
            <input
              type="text"
              placeholder="Search customer, address, or quote number..."
              className="pl-10 pr-4 py-3 block w-full rounded-md border-0 bg-gray-50 text-graphite shadow-sm ring-1 ring-inset ring-steel focus:bg-white focus:ring-2 focus:ring-hi-vis text-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status filters */}
          <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
            {(['All', 'Draft', 'Sent', 'Follow-Up', 'Won', 'Lost', 'Overdue'] as const).map((filter) => {
              let countLabel = '';
              if (filter === 'Overdue') {
                const overdueCount = quotes.filter(q => (q.status === 'Sent' || q.status === 'Follow-Up') && q.followUpDate && new Date(q.followUpDate) < new Date(new Date().setHours(0,0,0,0))).length;
                if (overdueCount > 0) {
                  countLabel = ` (${overdueCount})`;
                }
              }
              
              return (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md border whitespace-nowrap transition-all ${
                    statusFilter === filter
                      ? filter === 'Overdue'
                        ? 'bg-alert-orange text-white border-alert-orange'
                        : 'bg-graphite text-white border-graphite'
                      : 'bg-white text-concrete border-steel hover:border-concrete'
                  }`}
                >
                  {filter}{countLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quotes List */}
        {filteredQuotes.length > 0 ? (
          <div className="bg-white rounded-xl border-2 border-steel shadow-sm overflow-hidden divide-y divide-steel">
            {filteredQuotes.map((quote) => (
              <Link
                key={quote.id}
                to={`/quotes/${quote.id}`}
                className="block p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="font-mono text-sm font-bold text-graphite">{quote.quoteNumber}</span>
                      {getStatusBadge(quote.status)}
                      {(quote.status === 'Sent' || quote.status === 'Follow-Up') && quote.followUpDate && new Date(quote.followUpDate) < new Date(new Date().setHours(0,0,0,0)) && (
                        <span className="inline-flex items-center rounded-md bg-alert-orange/10 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-alert-orange border border-alert-orange/30 animate-pulse">
                          Follow-up Overdue
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-graphite">{quote.customerName}</h3>
                    <p className="text-sm text-concrete">{quote.jobAddress || 'No site address'}</p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                    <div className="sm:text-right space-y-1">
                      <p className="text-xl font-display text-graphite">
                        ${quote.total.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <div className="flex flex-col gap-0.5 text-xs text-concrete font-mono sm:items-end">
                        <span>
                          Created: {new Date(quote.createdAt).toLocaleDateString('en-AU', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                        {quote.followUpDate && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-concrete" />
                            Follow-up: {new Date(quote.followUpDate).toLocaleDateString('en-AU', {
                              day: 'numeric',
                              month: 'short'
                            })}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleCopyQuoteText(e, quote)}
                      className="p-3 rounded-md border border-steel bg-gray-50 text-graphite hover:bg-graphite hover:text-white transition-all shadow-sm flex items-center justify-center flex-shrink-0"
                      title="Copy Quote Text"
                    >
                      {copiedId === quote.id ? (
                        <Check className="w-4 h-4 text-aussie-teal animate-bounce" />
                      ) : (
                        <Copy className="w-4 h-4 text-graphite" />
                      )}
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 text-center rounded-xl border-2 border-steel shadow-sm">
            <FileText className="w-12 h-12 text-steel mx-auto mb-4" />
            <h3 className="text-lg font-bold text-graphite uppercase tracking-wide">No Quotes Found</h3>
            <p className="text-concrete text-sm mt-1">Get started by creating your first client proposal.</p>
            <Link
              to="/quotes/new"
              className="inline-flex items-center gap-2 rounded-md bg-graphite px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-md hover:bg-concrete transition-all mt-6"
            >
              <Plus className="w-4 h-4 text-hi-vis" />
              <span>Create First Quote</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
