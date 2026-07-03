import React, { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../hooks/useAuth';
import { HardHat, Save, Loader2, Image as ImageIcon } from 'lucide-react';

const TRADE_TYPES = [
  "Electrician", "Plumber", "Builder", "Carpenter", "Painter",
  "Roofer", "Tiler", "Landscaper", "Concreter", "Air Conditioning",
  "Locksmith", "Handyman", "Other"
];

export default function Profile() {
  const { user, businessProfile, refreshBusinessProfile, loading } = useAuth();

  const [form, setForm] = useState({
    name: '',
    abn: '',
    tradeType: '',
    gstRegistered: false,
    phone: '',
    email: '',
    serviceArea: '',
    defaultLabourRate: '',
    defaultCallOutFee: '',
    quoteTerms: 'Payment within 7 days of invoice',
    quoteFooter: 'Thank you for your business!',
    logoUrl: '' // placeholder URL
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (businessProfile) {
      setForm({
        name: businessProfile.name || '',
        abn: businessProfile.abn || '',
        tradeType: businessProfile.tradeType || '',
        gstRegistered: businessProfile.gstRegistered || false,
        phone: businessProfile.phone || '',
        email: businessProfile.email || '',
        serviceArea: businessProfile.serviceArea || '',
        defaultLabourRate: businessProfile.defaultLabourRate ? String(businessProfile.defaultLabourRate) : '',
        defaultCallOutFee: businessProfile.defaultCallOutFee ? String(businessProfile.defaultCallOutFee) : '',
        quoteTerms: businessProfile.quoteTerms || 'Payment within 7 days of invoice',
        quoteFooter: businessProfile.quoteFooter || 'Thank you for your business!',
        logoUrl: businessProfile.logoUrl || ''
      });
    }
  }, [businessProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Business name is required.");
      return;
    }

    if (!user) {
      setError("You must be logged in to save profile details.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const docRef = doc(db, 'users', user.uid, 'profile', 'business');
      await setDoc(docRef, {
        name: form.name,
        abn: form.abn,
        tradeType: form.tradeType,
        gstRegistered: form.gstRegistered,
        phone: form.phone,
        email: form.email,
        serviceArea: form.serviceArea,
        defaultLabourRate: form.defaultLabourRate ? Number(form.defaultLabourRate) : 0,
        defaultCallOutFee: form.defaultCallOutFee ? Number(form.defaultCallOutFee) : 0,
        quoteTerms: form.quoteTerms,
        quoteFooter: form.quoteFooter,
        logoUrl: form.logoUrl,
        updatedAt: new Date().toISOString()
      });
      await refreshBusinessProfile();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error("Error saving profile:", err);
      setError(err.message || "Failed to save profile.");
    } finally {
      setSaving(false);
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
      {/* Brand Header Banner */}
      <div className="bg-graphite text-white px-6 py-10 border-b-4 border-hi-vis shadow-md">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-hi-vis flex items-center justify-center text-graphite shadow-md">
            <HardHat className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-display uppercase tracking-tight text-white">Business Profile</h1>
            <p className="text-concrete text-sm uppercase tracking-wider font-mono">Setup your trade details & rates</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-alert-orange/10 text-alert-orange border border-alert-orange/30 p-4 rounded-md text-sm font-bold uppercase tracking-wider">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-aussie-teal/10 text-aussie-teal border border-aussie-teal/30 p-4 rounded-md text-sm font-bold uppercase tracking-wider">
              Profile Saved Successfully!
            </div>
          )}

          {/* Section 1: Company Details */}
          <div className="bg-white p-6 rounded-xl border-2 border-steel shadow-sm space-y-4">
            <h3 className="text-lg font-display uppercase text-graphite border-b border-steel pb-2">1. Company Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-concrete mb-1">Business Name *</label>
                <input
                  type="text"
                  required
                  className="block w-full rounded-md border-0 bg-gray-50 py-3 px-4 text-graphite shadow-sm ring-1 ring-inset ring-steel focus:bg-white focus:ring-2 focus:ring-hi-vis text-sm transition-all"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Smith Electrical Services"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-concrete mb-1">ABN (Australian Business Number)</label>
                <input
                  type="text"
                  maxLength={11}
                  className="block w-full rounded-md border-0 bg-gray-50 py-3 px-4 text-graphite shadow-sm ring-1 ring-inset ring-steel focus:bg-white focus:ring-2 focus:ring-hi-vis text-sm transition-all"
                  value={form.abn}
                  onChange={e => setForm({ ...form, abn: e.target.value.replace(/\D/g, '') })}
                  placeholder="11-digit number"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-concrete mb-1">Trade Type</label>
                <select
                  className="block w-full rounded-md border-0 bg-gray-50 py-3 px-4 text-graphite shadow-sm ring-1 ring-inset ring-steel focus:bg-white focus:ring-2 focus:ring-hi-vis text-sm transition-all"
                  value={form.tradeType}
                  onChange={e => setForm({ ...form, tradeType: e.target.value })}
                >
                  <option value="">Select Trade</option>
                  {TRADE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="gstRegistered"
                  className="h-5 w-5 rounded border-steel text-graphite focus:ring-hi-vis"
                  checked={form.gstRegistered}
                  onChange={e => setForm({ ...form, gstRegistered: e.target.checked })}
                />
                <label htmlFor="gstRegistered" className="text-sm font-bold uppercase text-graphite">GST Registered (Adds 10% tax)</label>
              </div>
            </div>
          </div>

          {/* Section 2: Contact Information */}
          <div className="bg-white p-6 rounded-xl border-2 border-steel shadow-sm space-y-4">
            <h3 className="text-lg font-display uppercase text-graphite border-b border-steel pb-2">2. Contact Info</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-concrete mb-1">Phone Number</label>
                <input
                  type="tel"
                  className="block w-full rounded-md border-0 bg-gray-50 py-3 px-4 text-graphite shadow-sm ring-1 ring-inset ring-steel focus:bg-white focus:ring-2 focus:ring-hi-vis text-sm transition-all"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="e.g. +61 400 000 000"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-concrete mb-1">Email Address</label>
                <input
                  type="email"
                  className="block w-full rounded-md border-0 bg-gray-50 py-3 px-4 text-graphite shadow-sm ring-1 ring-inset ring-steel focus:bg-white focus:ring-2 focus:ring-hi-vis text-sm transition-all"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="e.g. contact@business.com"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-concrete mb-1">Service Area</label>
                <input
                  type="text"
                  className="block w-full rounded-md border-0 bg-gray-50 py-3 px-4 text-graphite shadow-sm ring-1 ring-inset ring-steel focus:bg-white focus:ring-2 focus:ring-hi-vis text-sm transition-all"
                  value={form.serviceArea}
                  onChange={e => setForm({ ...form, serviceArea: e.target.value })}
                  placeholder="e.g. Greater Sydney, NSW"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Services & Pricing */}
          <div className="bg-white p-6 rounded-xl border-2 border-steel shadow-sm space-y-4">
            <h3 className="text-lg font-display uppercase text-graphite border-b border-steel pb-2">3. Services & Pricing</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-concrete mb-1">Default Labour Rate ($/hr)</label>
                <input
                  type="number"
                  className="block w-full rounded-md border-0 bg-gray-50 py-3 px-4 text-graphite shadow-sm ring-1 ring-inset ring-steel focus:bg-white focus:ring-2 focus:ring-hi-vis text-sm transition-all"
                  value={form.defaultLabourRate}
                  onChange={e => setForm({ ...form, defaultLabourRate: e.target.value })}
                  placeholder="e.g. 120"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-concrete mb-1">Default Call-Out Fee ($)</label>
                <input
                  type="number"
                  className="block w-full rounded-md border-0 bg-gray-50 py-3 px-4 text-graphite shadow-sm ring-1 ring-inset ring-steel focus:bg-white focus:ring-2 focus:ring-hi-vis text-sm transition-all"
                  value={form.defaultCallOutFee}
                  onChange={e => setForm({ ...form, defaultCallOutFee: e.target.value })}
                  placeholder="e.g. 95"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Quote Configurations & Logo */}
          <div className="bg-white p-6 rounded-xl border-2 border-steel shadow-sm space-y-4">
            <h3 className="text-lg font-display uppercase text-graphite border-b border-steel pb-2">4. Quote Settings & Logo</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-concrete mb-1">Payment Terms</label>
                <input
                  type="text"
                  className="block w-full rounded-md border-0 bg-gray-50 py-3 px-4 text-graphite shadow-sm ring-1 ring-inset ring-steel focus:bg-white focus:ring-2 focus:ring-hi-vis text-sm transition-all"
                  value={form.quoteTerms}
                  onChange={e => setForm({ ...form, quoteTerms: e.target.value })}
                  placeholder="e.g. Payment within 7 days of invoice"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-concrete mb-1">Quote Footer / Signature Notes</label>
                <textarea
                  rows={2}
                  className="block w-full rounded-md border-0 bg-gray-50 py-3 px-4 text-graphite shadow-sm ring-1 ring-inset ring-steel focus:bg-white focus:ring-2 focus:ring-hi-vis text-sm transition-all resize-none"
                  value={form.quoteFooter}
                  onChange={e => setForm({ ...form, quoteFooter: e.target.value })}
                  placeholder="e.g. Thank you for your business!"
                />
              </div>

              {/* Logo Area */}
              <div>
                <label className="block text-xs font-bold uppercase text-concrete mb-1">Company Logo URL</label>
                <div className="flex gap-4 items-center mt-2">
                  <div className="w-20 h-20 rounded-lg border-2 border-steel flex items-center justify-center bg-gray-50 overflow-hidden flex-shrink-0">
                    {form.logoUrl ? (
                      <img src={form.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-concrete" />
                    )}
                  </div>
                  <input
                    type="url"
                    className="block w-full rounded-md border-0 bg-gray-50 py-3 px-4 text-graphite shadow-sm ring-1 ring-inset ring-steel focus:bg-white focus:ring-2 focus:ring-hi-vis text-sm transition-all"
                    value={form.logoUrl}
                    onChange={e => setForm({ ...form, logoUrl: e.target.value })}
                    placeholder="Paste logo image URL (e.g. https://...)"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-graphite py-4 text-sm font-bold uppercase tracking-widest text-white shadow-md hover:bg-concrete transition-all disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin text-hi-vis" />
            ) : (
              <>
                <Save className="w-5 h-5 text-hi-vis" />
                <span>Save Profile</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
