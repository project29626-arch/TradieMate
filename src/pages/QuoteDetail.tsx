import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../hooks/useAuth';
import { ArrowLeft, Edit, Save, Trash2, Copy, Check, Plus, Minus, Loader2, AlertTriangle, ListTodo, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface TaskItem {
  title: string;
  assignee: string;
  completed: boolean;
}

interface DraftMessage {
  channel: 'sms' | 'email';
  recipient: string;
  subject?: string;
  body: string;
}

interface Quote {
  quoteNumber: string;
  customerName: string;
  customerPhone: string;
  jobAddress: string;
  scopeOfWork: string;
  lineItems: LineItem[];
  subtotal: number;
  gst: number;
  total: number;
  terms: string;
  footer: string;
  status: 'Draft' | 'Sent' | 'Follow-Up' | 'Won' | 'Lost';
  createdAt: string;
  followUpDate?: string;
  tasks?: TaskItem[];
  draftMessages?: DraftMessage[];
  missingInformation?: string[];
  jobSummary?: string;
}

export default function QuoteDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quote, setQuote] = useState<Quote | null>(null);
  const { user, businessProfile } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states for editing
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [jobAddress, setJobAddress] = useState('');
  const [scopeOfWork, setScopeOfWork] = useState('');
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [status, setStatus] = useState<'Draft' | 'Sent' | 'Follow-Up' | 'Won' | 'Lost'>('Draft');
  const [terms, setTerms] = useState('');
  const [footer, setFooter] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');

  // AI & Operation states
  const [tasks, setTasks] = useState<any[]>([]);
  const [draftMessages, setDraftMessages] = useState<any[]>([]);
  const [missingInformation, setMissingInformation] = useState<string[]>([]);
  const [activeMessageTab, setActiveMessageTab] = useState<'sms' | 'email'>('sms');
  const [copiedMessageIndex, setCopiedMessageIndex] = useState<number | null>(null);

  useEffect(() => {
    if (user && id) {
      const loadQuote = async () => {
        try {
          // Fetch Quote
          const quoteRef = doc(db, 'users', user.uid, 'quotes', id);
          const quoteSnap = await getDoc(quoteRef);
          if (quoteSnap.exists()) {
            const data = quoteSnap.data() as any;
            setQuote(data);
            
            // Populate form states
            setCustomerName(data.customerName || '');
            setCustomerPhone(data.customerPhone || '');
            setJobAddress(data.jobAddress || '');
            setScopeOfWork(data.scopeOfWork || '');
            setLineItems(data.lineItems || []);
            setStatus(data.status || 'Draft');
            setTerms(data.terms || '');
            setFooter(data.footer || '');
            setFollowUpDate(data.followUpDate || '');
            
            // Populate AI states
            setTasks(data.tasks || []);
            setDraftMessages(data.draftMessages || []);
            setMissingInformation(data.missingInformation || []);
          }
        } catch (err) {
          console.error("Error loading quote details:", err);
          setError("Failed to load quote details.");
        } finally {
          setLoading(false);
        }
      };
      
      loadQuote();
    } else if (!user) {
      setLoading(false);
    }
  }, [user, id]);

  // Recalculates subtotal, gst, and total
  const recalculateTotals = (items: LineItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const gstRegistered = businessProfile?.gstRegistered || false;
    const gst = gstRegistered ? subtotal * 0.1 : 0;
    const total = subtotal + gst;
    return { subtotal, gst, total };
  };

  const handleLineItemChange = (index: number, field: keyof LineItem, value: any) => {
    const updatedItems = [...lineItems];
    const item = { ...updatedItems[index] };
    
    if (field === 'quantity') {
      item.quantity = Number(value);
    } else if (field === 'unitPrice') {
      item.unitPrice = Number(value);
    } else if (field === 'description') {
      item.description = String(value);
    }
    
    item.total = item.quantity * item.unitPrice;
    updatedItems[index] = item;
    setLineItems(updatedItems);
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { description: '', quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const removeLineItem = (index: number) => {
    const updatedItems = lineItems.filter((_, i) => i !== index);
    setLineItems(updatedItems);
  };

  const handleSave = async () => {
    if (!user || !id) return;

    setSaving(true);
    setError(null);

    const { subtotal, gst, total } = recalculateTotals(lineItems);

    try {
      const quoteRef = doc(db, 'users', user.uid, 'quotes', id);
      await updateDoc(quoteRef, {
        customerName,
        customerPhone,
        jobAddress,
        scopeOfWork,
        lineItems,
        subtotal,
        gst,
        total,
        status,
        terms,
        footer,
        followUpDate,
        tasks,
        draftMessages
      });

      // Update local state
      setQuote({
        ...quote!,
        customerName,
        customerPhone,
        jobAddress,
        scopeOfWork,
        lineItems,
        subtotal,
        gst,
        total,
        status,
        terms,
        footer,
        followUpDate,
        tasks,
        draftMessages
      });

      setIsEditing(false);
    } catch (err: any) {
      console.error("Error saving quote:", err);
      setError("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleTask = async (idx: number) => {
    if (!user || !id || !quote) return;
    const updatedTasks = [...tasks];
    updatedTasks[idx].completed = !updatedTasks[idx].completed;
    setTasks(updatedTasks);
    
    try {
      const quoteRef = doc(db, 'users', user.uid, 'quotes', id);
      await updateDoc(quoteRef, { tasks: updatedTasks });
      setQuote({ ...quote, tasks: updatedTasks });
    } catch (err) {
      console.error("Error updating task status:", err);
    }
  };

  const handleTaskTextChange = (idx: number, value: string) => {
    const updated = [...tasks];
    updated[idx] = { ...updated[idx], title: value };
    setTasks(updated);
  };

  const handleAddTask = () => {
    setTasks([...tasks, { title: '', assignee: 'tradie', completed: false }]);
  };

  const handleRemoveTask = (idx: number) => {
    setTasks(tasks.filter((_, i) => i !== idx));
  };

  const handleDraftMessageChange = (idx: number, body: string) => {
    const updated = [...draftMessages];
    updated[idx] = { ...updated[idx], body };
    setDraftMessages(updated);
  };

  const handleDraftMessageSubjectChange = (idx: number, subject: string) => {
    const updated = [...draftMessages];
    updated[idx] = { ...updated[idx], subject };
    setDraftMessages(updated);
  };

  const handleCopyMessage = (body: string, idx: number) => {
    navigator.clipboard.writeText(body);
    setCopiedMessageIndex(idx);
    setTimeout(() => setCopiedMessageIndex(null), 2000);
  };

  const handleDelete = async () => {
    if (!user || !id) return;

    if (window.confirm("Are you sure you want to delete this quote?")) {
      try {
        const quoteRef = doc(db, 'users', user.uid, 'quotes', id);
        await deleteDoc(quoteRef);
        navigate('/quotes');
      } catch (err) {
        console.error("Error deleting quote:", err);
        setError("Failed to delete quote.");
      }
    }
  };

  const handleStatusChange = async (newStatus: 'Draft' | 'Sent' | 'Follow-Up' | 'Won' | 'Lost') => {
    if (!user || !id || !quote) return;

    try {
      const quoteRef = doc(db, 'users', user.uid, 'quotes', id);
      await updateDoc(quoteRef, { status: newStatus });
      setQuote({ ...quote, status: newStatus });
      setStatus(newStatus);
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleCopyText = () => {
    if (!quote) return;
    const bizName = businessProfile?.name || 'TradieMate';
    
    let text = `=== QUOTE: ${quote.quoteNumber} ===\n`;
    text += `From: ${bizName}\n`;
    if (businessProfile?.abn) text += `ABN: ${businessProfile.abn}\n`;
    if (businessProfile?.phone) text += `Phone: ${businessProfile.phone}\n`;
    text += `-----------------------------------\n`;
    text += `Customer: ${quote.customerName}\n`;
    if (quote.jobAddress) text += `Site Address: ${quote.jobAddress}\n`;
    text += `-----------------------------------\n`;
    text += `Scope of Work:\n${quote.scopeOfWork}\n\n`;
    text += `Line Items:\n`;
    lineItems.forEach((item) => {
      text += `- ${item.description}: Qty ${item.quantity} x $${item.unitPrice.toFixed(2)} = $${item.total.toFixed(2)}\n`;
    });
    text += `-----------------------------------\n`;
    text += `Subtotal: $${quote.subtotal.toFixed(2)}\n`;
    text += `GST (10%): $${quote.gst.toFixed(2)}\n`;
    text += `TOTAL: $${quote.total.toFixed(2)}\n`;
    if (quote.terms) text += `\nTerms: ${quote.terms}\n`;
    if (quote.footer) text += `\n${quote.footer}\n`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F4F6]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-graphite border-t-hi-vis"></div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-h-screen bg-[#F4F4F6] flex items-center justify-center font-body text-concrete">
        Quote not found.
      </div>
    );
  }

  const { subtotal: currentSubtotal, gst: currentGst, total: currentTotal } = recalculateTotals(lineItems);

  const isOverdue = quote && (quote.status === 'Sent' || quote.status === 'Follow-Up') && quote.followUpDate && new Date(quote.followUpDate) < new Date(new Date().setHours(0,0,0,0));

  return (
    <div className="min-h-screen bg-[#F4F4F6] pb-24 font-body">
      {/* Header */}
      <div className="bg-graphite text-white px-6 py-6 border-b-4 border-hi-vis shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/quotes" className="p-2 rounded-lg hover:bg-concrete/20 text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-display uppercase tracking-tight text-white">{quote.quoteNumber}</h1>
            <p className="text-concrete text-xs uppercase tracking-wider font-mono">Proposal Details</p>
          </div>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-2.5 rounded-md bg-concrete/20 text-white border border-steel hover:bg-concrete/40 transition-all"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2.5 rounded-md bg-alert-orange/20 text-alert-orange border border-alert-orange/30 hover:bg-alert-orange hover:text-white transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={handleSave}
              disabled={saving}
              className="p-2.5 rounded-md bg-hi-vis text-graphite border border-hi-vis hover:bg-white transition-all flex items-center gap-1 font-bold text-xs uppercase tracking-wider"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {error && (
          <div className="bg-alert-orange/10 text-alert-orange border border-alert-orange/30 p-4 rounded-md text-sm font-bold uppercase tracking-wider">
            {error}
          </div>
        )}

        {/* Overdue Alert Banner */}
        {!isEditing && isOverdue && (
          <div className="bg-alert-orange/15 border-2 border-alert-orange text-alert-orange p-4 rounded-xl flex items-center justify-between shadow-sm animate-pulse">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <div>
                <h4 className="font-display text-sm uppercase tracking-wider font-bold">Follow-Up Is Overdue!</h4>
                <p className="text-xs font-semibold text-concrete">This quote was sent and is due for a follow-up call or message.</p>
              </div>
            </div>
          </div>
        )}

        {/* Status Actions */}
        {!isEditing && (
          <div className="bg-white p-4 rounded-xl border border-steel shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="text-xs font-bold uppercase text-concrete tracking-wider">Change Status:</span>
            <div className="flex flex-wrap gap-2">
              {(['Draft', 'Sent', 'Follow-Up', 'Won', 'Lost'] as const).map((s) => {
                const isSelected = quote.status === s;
                let buttonStyle = 'bg-white text-concrete border-steel hover:border-concrete';
                
                if (isSelected) {
                  switch (s) {
                    case 'Won':
                      buttonStyle = 'bg-aussie-teal text-white border-aussie-teal shadow-md';
                      break;
                    case 'Lost':
                      buttonStyle = 'bg-alert-orange text-white border-alert-orange shadow-md';
                      break;
                    case 'Sent':
                      buttonStyle = 'bg-hi-vis text-graphite border-hi-vis shadow-md';
                      break;
                    case 'Follow-Up':
                      buttonStyle = 'bg-concrete text-white border-concrete shadow-md';
                      break;
                    default:
                      buttonStyle = 'bg-graphite text-white border-graphite shadow-md';
                  }
                }
                
                return (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-md border transition-all ${buttonStyle}`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Invoice Body Card */}
        <div className="bg-white rounded-xl border-2 border-steel shadow-lg overflow-hidden relative">
          <div className="h-3 bg-gradient-to-r from-graphite via-concrete to-hi-vis" />
          
          <div className="p-4 sm:p-8 space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-start border-b border-steel pb-6 gap-4">
              <div className="space-y-1">
                {businessProfile?.logoUrl && (
                  <img src={businessProfile.logoUrl} alt="Logo" className="h-10 object-contain mb-3" />
                )}
                <h2 className="text-2xl font-display uppercase tracking-tight text-graphite">
                  {businessProfile?.name || 'TradieMate'}
                </h2>
                <p className="text-xs text-concrete font-mono uppercase">
                  {businessProfile?.tradeType || 'General Trade Operator'}
                </p>
                {businessProfile?.abn && (
                  <p className="text-xs text-concrete font-mono">ABN: {businessProfile.abn}</p>
                )}
                {businessProfile?.phone && (
                  <p className="text-xs text-concrete font-mono">Ph: {businessProfile.phone}</p>
                )}
              </div>
              <div className="text-left sm:text-right space-y-1">
                <span className="inline-block text-4xl font-display uppercase tracking-wider text-graphite">Quote</span>
                <p className="text-sm font-mono text-hi-vis bg-graphite font-bold px-2 py-0.5 rounded inline-block">
                  {quote.quoteNumber}
                </p>
              </div>
            </div>

            {/* Customer metadata details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-4 rounded-lg border border-steel">
              <div>
                <span className="block text-[10px] font-bold uppercase text-concrete tracking-widest mb-1">Prepared For</span>
                {isEditing ? (
                  <input
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-graphite bg-white ring-1 ring-inset ring-steel focus:ring-2 focus:ring-hi-vis text-sm transition-all"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                  />
                ) : (
                  <p className="text-sm font-bold text-graphite uppercase">{quote.customerName}</p>
                )}

                {isEditing ? (
                  <input
                    type="tel"
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-graphite bg-white ring-1 ring-inset ring-steel focus:ring-2 focus:ring-hi-vis text-sm transition-all mt-2"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                  />
                ) : (
                  quote.customerPhone && <p className="text-xs text-concrete font-mono mt-1">Ph: {quote.customerPhone}</p>
                )}
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase text-concrete tracking-widest mb-1">Site Address</span>
                {isEditing ? (
                  <input
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-graphite bg-white ring-1 ring-inset ring-steel focus:ring-2 focus:ring-hi-vis text-sm transition-all"
                    value={jobAddress}
                    onChange={e => setJobAddress(e.target.value)}
                  />
                ) : (
                  <p className="text-sm text-concrete">{quote.jobAddress || 'Not Provided'}</p>
                )}
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase text-concrete tracking-widest mb-1">Follow-Up Date</span>
                {isEditing ? (
                  <input
                    type="date"
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-graphite bg-white ring-1 ring-inset ring-steel focus:ring-2 focus:ring-hi-vis text-sm transition-all"
                    value={followUpDate}
                    onChange={e => setFollowUpDate(e.target.value)}
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-graphite font-mono">
                      {quote.followUpDate ? new Date(quote.followUpDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not Scheduled'}
                    </span>
                    {isOverdue && (
                      <span className="inline-block text-[9px] font-extrabold uppercase bg-alert-orange text-white px-2 py-0.5 rounded animate-pulse">Overdue</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Scope of Work */}
            <div>
              <span className="block text-xs font-bold uppercase text-concrete tracking-wider mb-2">Scope of Work</span>
              {isEditing ? (
                <textarea
                  rows={3}
                  className="block w-full rounded-md border-0 py-2.5 px-3 bg-gray-50 text-graphite shadow-sm ring-1 ring-inset ring-steel focus:bg-white focus:ring-2 focus:ring-hi-vis text-sm transition-all resize-none"
                  value={scopeOfWork}
                  onChange={e => setScopeOfWork(e.target.value)}
                />
              ) : (
                <p className="text-sm text-graphite whitespace-pre-wrap leading-relaxed bg-gray-50/50 p-3 rounded border border-steel/50">
                  {quote.scopeOfWork}
                </p>
              )}
            </div>

            {/* Line Items section */}
            <div className="space-y-3">
              <span className="block text-xs font-bold uppercase text-concrete tracking-wider">Line Items</span>
              
              <div className="border border-steel rounded-lg overflow-hidden overflow-x-auto">
                <table className="min-w-[600px] w-full text-left text-sm divide-y divide-steel">
                  <thead className="bg-gray-50 text-xs font-bold uppercase text-concrete tracking-wider">
                    <tr>
                      <th className="p-3 w-3/5">Description</th>
                      <th className="p-3 text-center w-12">Qty</th>
                      <th className="p-3 text-right w-24">Price</th>
                      <th className="p-3 text-right w-24">Total</th>
                      {isEditing && <th className="p-3 w-8"></th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-steel">
                    {lineItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/30">
                        <td className="p-3">
                          {isEditing ? (
                            <input
                              type="text"
                              className="w-full rounded border-steel py-1 px-2 text-xs bg-white text-graphite focus:ring-1 focus:ring-hi-vis focus:border-hi-vis outline-none"
                              value={item.description}
                              onChange={e => handleLineItemChange(idx, 'description', e.target.value)}
                              placeholder="e.g. Labour"
                            />
                          ) : (
                            <span className="font-semibold text-graphite text-xs">{item.description}</span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {isEditing ? (
                            <input
                              type="number"
                              className="w-12 rounded border-steel py-1 text-center text-xs bg-white text-graphite focus:ring-1 focus:ring-hi-vis outline-none"
                              value={item.quantity}
                              onChange={e => handleLineItemChange(idx, 'quantity', e.target.value)}
                            />
                          ) : (
                            <span className="text-concrete text-xs">{item.quantity}</span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          {isEditing ? (
                            <input
                              type="number"
                              className="w-20 rounded border-steel py-1 text-right text-xs bg-white text-graphite focus:ring-1 focus:ring-hi-vis outline-none"
                              value={item.unitPrice}
                              onChange={e => handleLineItemChange(idx, 'unitPrice', e.target.value)}
                            />
                          ) : (
                            <span className="text-concrete text-xs">${item.unitPrice.toFixed(2)}</span>
                          )}
                        </td>
                        <td className="p-3 text-right font-mono text-xs font-bold text-graphite">
                          ${(item.quantity * item.unitPrice).toFixed(2)}
                        </td>
                        {isEditing && (
                          <td className="p-3 text-center">
                            <button
                              type="button"
                              onClick={() => removeLineItem(idx)}
                              className="text-alert-orange hover:text-red-700"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {isEditing && (
                <button
                  type="button"
                  onClick={addLineItem}
                  className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-graphite hover:text-hi-vis bg-white border border-steel p-2 rounded-md hover:bg-graphite transition-all shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Item</span>
                </button>
              )}
            </div>

            {/* Totals */}
            <div className="flex justify-end pt-4 border-t border-steel">
              <div className="w-64 space-y-2 text-right">
                <div className="flex justify-between text-xs text-concrete uppercase font-bold tracking-wider">
                  <span>Subtotal</span>
                  <span className="font-mono text-graphite">${currentSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-concrete uppercase font-bold tracking-wider">
                  <span>GST (10%)</span>
                  <span className="font-mono text-graphite">${currentGst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-display uppercase border-t-2 border-steel pt-2 text-graphite">
                  <span>Total</span>
                  <span className="font-mono font-bold text-graphite">
                    ${currentTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Terms and Footer Info */}
            <div className="border-t border-steel pt-6 space-y-4">
              <div>
                <span className="block text-[10px] font-bold uppercase text-concrete tracking-widest mb-1">Terms & Conditions</span>
                {isEditing ? (
                  <input
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-graphite bg-white ring-1 ring-inset ring-steel focus:ring-2 focus:ring-hi-vis text-sm transition-all"
                    value={terms}
                    onChange={e => setTerms(e.target.value)}
                  />
                ) : (
                  <p className="text-xs text-concrete italic">{quote.terms}</p>
                )}
              </div>

              <div>
                {isEditing ? (
                  <textarea
                    rows={2}
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-graphite bg-white ring-1 ring-inset ring-steel focus:ring-2 focus:ring-hi-vis text-sm transition-all resize-none"
                    value={footer}
                    onChange={e => setFooter(e.target.value)}
                  />
                ) : (
                  <p className="text-xs text-concrete border-t border-dashed border-steel pt-4 text-center font-medium">
                    {quote.footer}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* AI Warnings / Missing Details */}
        {!isEditing && missingInformation && missingInformation.length > 0 && (
          <div className="bg-alert-orange/5 border-2 border-alert-orange/30 p-5 rounded-xl shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-alert-orange">
              <AlertTriangle className="w-5 h-5 text-alert-orange" />
              <h4 className="font-display text-sm uppercase tracking-wider font-bold">AI Job Checklist: Missing Details</h4>
            </div>
            <ul className="list-disc pl-5 text-xs text-graphite/85 space-y-1.5 font-medium">
              {missingInformation.map((info, idx) => (
                <li key={idx}>{info}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Tasks Checklist Card */}
        {((tasks && tasks.length > 0) || isEditing) && (
          <div className="bg-white p-6 rounded-xl border-2 border-steel shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-steel pb-3">
              <div className="flex items-center gap-2">
                <ListTodo className="w-5 h-5 text-hi-vis fill-graphite" />
                <h4 className="font-display text-base uppercase text-graphite font-bold">Site Operations Checklist</h4>
              </div>
              {!isEditing && tasks.length > 0 && (
                <span className="text-[10px] font-mono font-bold bg-steel/30 text-graphite px-2 py-0.5 rounded-full">
                  {tasks.filter(t => t.completed).length}/{tasks.length} Done
                </span>
              )}
            </div>

            <div className="space-y-3">
              {tasks.map((task, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3 group">
                  <div className="flex items-center gap-3 flex-1">
                    {isEditing ? (
                      <input
                        type="text"
                        className="w-full rounded border-steel py-1.5 px-3 text-xs bg-white text-graphite focus:ring-1 focus:ring-hi-vis focus:border-hi-vis outline-none"
                        value={task.title}
                        onChange={e => handleTaskTextChange(idx, e.target.value)}
                        placeholder="Task description"
                      />
                    ) : (
                      <label className="flex items-start gap-3 cursor-pointer select-none py-1 flex-1">
                        <input
                          type="checkbox"
                          checked={task.completed || false}
                          onChange={() => handleToggleTask(idx)}
                          className="mt-0.5 h-4 w-4 rounded border-steel text-hi-vis focus:ring-hi-vis accent-graphite"
                        />
                        <span className={`text-sm font-medium ${task.completed ? 'line-through text-concrete' : 'text-graphite'}`}>
                          {task.title}
                        </span>
                      </label>
                    )}
                  </div>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTask(idx)}
                      className="text-alert-orange hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  )}
                </div>
              ))}
              {tasks.length === 0 && !isEditing && (
                <p className="text-xs text-concrete italic">No tasks created.</p>
              )}
            </div>

            {isEditing && (
              <button
                type="button"
                onClick={handleAddTask}
                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-graphite hover:text-hi-vis bg-white border border-steel p-2 rounded-md hover:bg-graphite transition-all shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>
            )}
          </div>
        )}

        {/* Client Communications Card */}
        {((draftMessages && draftMessages.length > 0) || isEditing) && (
          <div className="bg-white p-6 rounded-xl border-2 border-steel shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-steel pb-3">
              <MessageSquare className="w-5 h-5 text-hi-vis fill-graphite" />
              <h4 className="font-display text-base uppercase text-graphite font-bold">AI Communication Drafts</h4>
            </div>

            {/* Tabs for SMS / Email */}
            <div className="flex border-b border-steel">
              <button
                type="button"
                onClick={() => setActiveMessageTab('sms')}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider border-b-2 text-center transition-all ${
                  activeMessageTab === 'sms'
                    ? 'border-hi-vis text-graphite bg-hi-vis/5 font-extrabold'
                    : 'border-transparent text-concrete hover:text-graphite'
                }`}
              >
                SMS / Text
              </button>
              <button
                type="button"
                onClick={() => setActiveMessageTab('email')}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider border-b-2 text-center transition-all ${
                  activeMessageTab === 'email'
                    ? 'border-hi-vis text-graphite bg-hi-vis/5 font-extrabold'
                    : 'border-transparent text-concrete hover:text-graphite'
                }`}
              >
                Email Draft
              </button>
            </div>

            {/* Tab content */}
            <div className="space-y-4 pt-2">
              {draftMessages.map((msg, idx) => {
                // Determine channel
                if (msg.channel !== activeMessageTab) return null;

                return (
                  <div key={idx} className="space-y-3">
                    {/* Recipient */}
                    <div className="flex justify-between items-center bg-gray-50 px-3 py-1.5 rounded border border-steel">
                      <span className="text-[10px] font-bold text-concrete uppercase tracking-wider">Recipient:</span>
                      <span className="text-xs font-mono font-bold text-graphite">{msg.recipient || quote.customerName || 'Client'}</span>
                    </div>

                    {/* Email Subject if channel is Email */}
                    {msg.channel === 'email' && (
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-concrete uppercase tracking-wider">Subject:</label>
                        {isEditing ? (
                          <input
                            type="text"
                            className="w-full rounded border-steel py-1.5 px-3 text-xs bg-white text-graphite focus:ring-1 focus:ring-hi-vis focus:border-hi-vis outline-none"
                            value={msg.subject || ''}
                            onChange={e => handleDraftMessageSubjectChange(idx, e.target.value)}
                            placeholder="Email Subject"
                          />
                        ) : (
                          <div className="bg-gray-50/50 p-2 rounded border border-steel/50 text-xs font-semibold text-graphite">
                            {msg.subject || `Quote from ${businessProfile?.name || 'TradieMate'}`}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Body */}
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-concrete uppercase tracking-wider">Message Body:</label>
                      {isEditing ? (
                        <textarea
                          rows={6}
                          className="w-full rounded border-steel py-2 px-3 text-xs bg-white text-graphite focus:ring-1 focus:ring-hi-vis focus:border-hi-vis outline-none resize-none font-sans"
                          value={msg.body}
                          onChange={e => handleDraftMessageChange(idx, e.target.value)}
                          placeholder="Write message content here..."
                        />
                      ) : (
                        <div className="bg-concrete/5 p-4 rounded-lg border border-steel/60 text-xs text-graphite whitespace-pre-wrap leading-relaxed font-sans shadow-inner">
                          {msg.body}
                        </div>
                      )}
                    </div>

                    {/* Copy message button */}
                    {!isEditing && (
                      <button
                        type="button"
                        onClick={() => handleCopyMessage(msg.body, idx)}
                        className="flex w-full items-center justify-center gap-1.5 rounded-md border border-steel bg-gray-50 py-2.5 text-xs font-bold uppercase tracking-wider text-graphite hover:bg-graphite hover:text-white transition-all shadow-sm"
                      >
                        {copiedMessageIndex === idx ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-aussie-teal animate-bounce" />
                            <span className="text-aussie-teal">Copied to Clipboard!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-hi-vis" />
                            <span>Copy Message Text</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Copy text action footer */}
        {!isEditing && (
          <button
            onClick={handleCopyText}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-graphite py-4 text-sm font-bold uppercase tracking-widest text-white shadow-md hover:bg-concrete transition-all"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5 text-aussie-teal animate-bounce" />
                <span>Text Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-5 h-5 text-hi-vis" />
                <span>Copy Quote Text</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
