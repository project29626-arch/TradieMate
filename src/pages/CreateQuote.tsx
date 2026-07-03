import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { useAuth } from '../hooks/useAuth';
import { ArrowLeft, Mic, MicOff, Sparkles, Loader2, User, Phone, MapPin, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { processVoiceNote } from '../services/ai';

// Declare SpeechRecognition for browser support
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export default function CreateQuote() {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [jobAddress, setJobAddress] = useState('');
  const [jobDetails, setJobDetails] = useState('');
  const [isListening, setIsListening] = useState(false);
  
  const { businessProfile } = useAuth();
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const [recognition, setRecognition] = useState<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = false; // we only care about complete sentences
      rec.lang = 'en-AU'; // English (Australia) for local vocabulary
      setRecognition(rec);
    }
  }, []);

  const toggleListening = () => {
    if (!recognition) {
      setError("Speech recognition is not supported in this browser. Please use Google Chrome or Safari.");
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      setError(null);
      
      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setJobDetails(prev => prev + (prev ? ' ' : '') + finalTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === 'not-allowed') {
          setError("Microphone permission denied. Please allow microphone access in your browser settings.");
        } else {
          setError(`Voice input error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      try {
        recognition.start();
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
        setIsListening(false);
      }
    }
  };

  const handleGenerateQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDetails.trim()) {
      setError("Please describe the job details or use voice notes.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      setError("You must be logged in to create quotes.");
      return;
    }

    // Stop listening if it's currently running
    if (isListening && recognition) {
      recognition.stop();
      setIsListening(false);
    }

    setGenerating(true);
    setError(null);

    try {
      // Invoke Gemini API or smart mock fallback
      const analysis = await processVoiceNote(jobDetails, businessProfile);

      // Use AI clientName if manually input is empty
      const quoteCustomerName = customerName.trim() || analysis.clientName || 'Client';

      // Parse line items
      const lineItems = analysis.quoteDraft?.lineItems.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.totalPrice
      })) || [];

      // Calculate subtotal, gst, total
      const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
      const gstRegistered = businessProfile?.gstRegistered || false;
      const gst = gstRegistered ? subtotal * 0.1 : 0;
      const total = subtotal + gst;

      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const quoteNumber = `QM-${randomNum}`;

      const now = new Date();
      const threeDaysLater = new Date();
      threeDaysLater.setDate(now.getDate() + 3);
      const createdAt = now.toISOString();
      const followUpDate = threeDaysLater.toISOString().split('T')[0];

      const quotesRef = collection(db, 'users', user.uid, 'quotes');
      const docRef = await addDoc(quotesRef, {
        quoteNumber,
        customerName: quoteCustomerName,
        customerPhone,
        jobAddress,
        scopeOfWork: jobDetails,
        lineItems,
        subtotal,
        gst,
        total,
        terms: businessProfile?.quoteTerms || 'Payment within 7 days of invoice',
        footer: businessProfile?.quoteFooter || 'Thank you for your business!',
        status: 'Draft',
        createdAt,
        followUpDate,
        
        // Save the structured AI outputs for display in QuoteDetail
        tasks: analysis.tasks.map(t => ({
          title: t.title,
          assignee: t.assignee || 'tradie',
          completed: false
        })),
        draftMessages: analysis.draftMessages,
        missingInformation: analysis.missingInformation,
        jobSummary: analysis.jobSummary
      });

      setGenerating(false);
      navigate(`/quotes/${docRef.id}`);

    } catch (err: any) {
      console.error("Error generating quote via AI:", err);
      setError(err.message || "Failed to generate quote. Please try again.");
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F6] pb-24 font-body">
      {/* Header Banner */}
      <div className="bg-graphite text-white px-6 py-6 border-b-4 border-hi-vis shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/quotes" className="p-2 rounded-lg hover:bg-concrete/20 text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-display uppercase tracking-tight text-white">Create New Quote</h1>
            <p className="text-concrete text-xs uppercase tracking-wider font-mono">Input job scope to generate</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleGenerateQuote} className="space-y-6">
          {error && (
            <div className="bg-alert-orange/10 text-alert-orange border border-alert-orange/30 p-4 rounded-md text-sm font-bold uppercase tracking-wider">
              {error}
            </div>
          )}

          {/* Section 1: Customer Details */}
          <div className="bg-white p-6 rounded-xl border-2 border-steel shadow-sm space-y-4">
            <h3 className="text-lg font-display uppercase text-graphite border-b border-steel pb-2">1. Client Info</h3>
            
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-3.5 h-4 w-4 text-concrete" />
                <input
                  type="text"
                  required
                  placeholder="Customer Name *"
                  className="pl-10 pr-4 py-3.5 block w-full rounded-md border-0 bg-gray-50 text-graphite shadow-sm ring-1 ring-inset ring-steel focus:bg-white focus:ring-2 focus:ring-hi-vis text-sm transition-all"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-3.5 h-4 w-4 text-concrete" />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="pl-10 pr-4 py-3.5 block w-full rounded-md border-0 bg-gray-50 text-graphite shadow-sm ring-1 ring-inset ring-steel focus:bg-white focus:ring-2 focus:ring-hi-vis text-sm transition-all"
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                />
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-concrete" />
                <input
                  type="text"
                  placeholder="Job Site Address"
                  className="pl-10 pr-4 py-3.5 block w-full rounded-md border-0 bg-gray-50 text-graphite shadow-sm ring-1 ring-inset ring-steel focus:bg-white focus:ring-2 focus:ring-hi-vis text-sm transition-all"
                  value={jobAddress}
                  onChange={e => setJobAddress(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Job Scope */}
          <div className="bg-white p-6 rounded-xl border-2 border-steel shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-steel pb-2">
              <h3 className="text-lg font-display uppercase text-graphite">2. Job Details / Scope</h3>
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2.5 rounded-lg border flex items-center justify-center gap-2 transition-all ${
                  isListening
                    ? "bg-hi-vis text-graphite border-hi-vis shadow-[0_0_12px_rgba(239,255,0,0.5)] animate-pulse"
                    : "bg-white text-graphite border-steel hover:bg-concrete/10"
                }`}
                title={isListening ? "Click to stop listening" : "Click to speak voice notes"}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-4 h-4 text-alert-orange animate-bounce" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider">Listening...</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 text-graphite" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider">Speak Note</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="relative">
              <FileText className="absolute left-3 top-4 h-4 w-4 text-concrete" />
              <textarea
                rows={5}
                required
                placeholder="Describe the job in detail (e.g. 'Customer needs 4 LED downlights installed in the kitchen, replacement of damaged cable, and safety check.') *"
                className="pl-10 pr-4 py-3.5 block w-full rounded-md border-0 bg-gray-50 text-graphite shadow-sm ring-1 ring-inset ring-steel focus:bg-white focus:ring-2 focus:ring-hi-vis text-sm transition-all resize-none"
                value={jobDetails}
                onChange={e => setJobDetails(e.target.value)}
              />
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={generating}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-graphite py-4 text-sm font-bold uppercase tracking-widest text-white shadow-md hover:bg-concrete transition-all disabled:opacity-50"
          >
            {generating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-hi-vis" />
                <span>Generating Quote Details...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-hi-vis animate-pulse" />
                <span>Generate Quote</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
