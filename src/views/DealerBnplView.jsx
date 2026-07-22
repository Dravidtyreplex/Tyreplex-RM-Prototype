import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronDown, Users, IndianRupee, Clock, Wallet, TrendingUp, FileX, Zap, Check } from 'lucide-react';

const DealerBnplView = () => {
  const navigate = useNavigate();
  const [expandedFaq, setExpandedFaq] = useState(0);

  const stats = [
    { icon: <Users size={18} className="text-[#2563EB]" />, value: '2,400+', label: 'Active Dealers' },
    { icon: <IndianRupee size={18} className="text-slate-600" />, value: '₹10 Cr +', label: 'Total Disbursed' },
    { icon: <Clock size={18} className="text-slate-600" />, value: '24 Hours', label: 'Avg. Approval' },
  ];

  const comparisonLeft = [
    { title: '24-36% high APR', sub: 'Expensive capital' },
    { title: 'Property mortgage', sub: 'Asset risk mortgage' },
    { title: '2-3 weeks delay', sub: 'Expensive capital' },
    { title: 'Heavy paperwork', sub: 'Balance sheets & branch visits' },
  ];

  const comparisonRight = [
    { title: '0% Interest', sub: 'Free for 10 Days' },
    { title: 'Zero collateral', sub: 'No asset mortgage' },
    { title: 'Setup under 24h', sub: 'Instant activation' },
    { title: '100% Digital setup', sub: 'Fast paperless check' },
  ];

  const benefits = [
    { icon: <Wallet size={18} className="text-[#2563EB]" />, title: 'No Cash Upfront', desc: 'Start stocking tyres without any advance payment.' },
    { icon: <IndianRupee size={18} className="text-[#2563EB]" />, title: 'Pay in 30 days. Sell at full margin.', desc: 'Stock Apollo, MRF, CEAT — today' },
    { icon: <TrendingUp size={18} className="text-[#2563EB]" />, title: 'Your CIBIL score goes UP', desc: 'Every repayment improves your credit rating.' },
    { icon: <FileX size={18} className="text-[#2563EB]" />, title: 'No paperwork. No branch visits.', desc: '100% digital. Apply from this app in 2 mins.' },
  ];

  const steps = [
    { num: 1, label: 'Apply', active: true },
    { num: 2, label: 'Verify', active: true },
    { num: 3, label: 'Activate', active: false },
  ];

  const faqs = [
    { q: 'Who pays for the replacement tyre?', a: 'Tyreplex covers 100% of the cost. The new tyre is delivered to your shop or the amount is credited directly to your wallet.' },
    { q: 'Who pays for the replacement tyre?', a: 'Tyreplex covers 100% of the cost.' },
    { q: 'Who pays for the replacement tyre?', a: 'Tyreplex covers 100% of the cost.' },
  ];

  return (
    <div className="flex flex-col min-h-full bg-white">
      {/* Header */}
      <header className="bg-white h-14 flex items-center px-4 border-b border-[#D9D9D9] shrink-0 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="mr-3" aria-label="Go back">
          <ChevronLeft size={24} className="text-black" />
        </button>
        <h1 className="text-[16px] font-medium text-black flex-1 text-center pr-8">Dealer BNPL</h1>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* Hero Banner */}
        <div className="mx-6 mt-4 rounded-[20px] overflow-hidden bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] h-[180px] flex items-center justify-center">
          <div className="text-center text-white px-6">
            <h2 className="text-[20px] font-bold">Tyreplex BNPL</h2>
            <p className="text-[12px] opacity-80 mt-2">Buy Now, Pay Later for Tyre Dealers</p>
            <p className="text-[14px] font-semibold mt-3">0% Interest • 10 Days Free Credit</p>
          </div>
        </div>

        {/* Stats Card */}
        <div className="mx-6 mt-4 border border-[#D9D9D9] rounded-[20px] p-4">
          <div className="flex items-center justify-between">
            {stats.map((stat, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center text-center flex-1">
                  <div className="mb-1.5">{stat.icon}</div>
                  <span className="text-[14px] font-bold text-black">{stat.value}</span>
                  <span className="text-[8px] font-medium text-slate-500">{stat.label}</span>
                </div>
                {i < stats.length - 1 && <div className="w-[0.5px] h-[50px] bg-[#D9D9D9]" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Why Choose — Comparison Table */}
        <div className="mx-6 mt-4 border border-[#D9D9D9] rounded-[20px] p-4">
          <h3 className="text-[14px] font-semibold text-black mb-3">Why Choose Tyreplex BNPL?</h3>
          {/* Column Headers */}
          <div className="flex rounded-t-[15px] overflow-hidden mb-2">
            <div className="flex-1 bg-slate-50 border border-[#D9D9D9] rounded-tl-[15px] py-2 px-3">
              <span className="text-[12px] font-semibold text-black">Informal Credit</span>
            </div>
            <div className="flex-1 bg-[#2563EB]/5 border border-[#D9D9D9] rounded-tr-[15px] py-2 px-3">
              <span className="text-[12px] font-semibold text-[#2563EB]">Tyreplex BNPL</span>
            </div>
          </div>
          {/* Rows */}
          <div className="flex">
            {/* Left column */}
            <div className="flex-1 border border-[#D9D9D9] rounded-bl-[15px] p-3 space-y-4">
              {comparisonLeft.map((item, i) => (
                <div key={i}>
                  <p className="text-[12px] font-semibold text-slate-600">{item.title}</p>
                  <p className="text-[8px] text-slate-500 opacity-70">{item.sub}</p>
                </div>
              ))}
            </div>
            {/* Right column */}
            <div className="flex-1 bg-[#2563EB]/5 border border-[#D9D9D9] rounded-br-[15px] p-3 space-y-4">
              {comparisonRight.map((item, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <Check size={12} className="text-[#2563EB] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[12px] font-semibold text-black">{item.title}</p>
                    <p className="text-[8px] text-slate-500 opacity-70">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits For You */}
        <div className="mx-6 mt-4 border border-[#D9D9D9] rounded-[20px] p-4">
          <h3 className="text-[14px] font-semibold text-black mb-3">Benefits For You</h3>
          <div className="space-y-3">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-start gap-3 bg-slate-50/50 border border-[#D9D9D9] rounded-[15px] p-3">
                <div className="w-[35px] h-[35px] rounded-[10px] bg-[#2563EB]/10 border border-[#2563EB] flex items-center justify-center shrink-0">
                  {b.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-black">{b.title}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3 Step Process */}
        <div className="mx-6 mt-4 border border-[#D9D9D9] rounded-[20px] p-4">
          <h3 className="text-[14px] font-semibold text-black mb-4">3 Step Process</h3>
          <div className="flex items-center justify-between px-2">
            {steps.map((step, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-medium text-[#2563EB] mb-1">Step {step.num}</span>
                  <div className={`w-[30px] h-[30px] rounded-full flex items-center justify-center ${
                    step.active ? 'bg-[#2563EB]' : 'bg-white border border-[#D9D9D9]'
                  }`}>
                    {step.active ? (
                      <Zap size={12} className="text-white" />
                    ) : (
                      <span className="text-[10px] font-medium text-slate-500">{step.num}</span>
                    )}
                  </div>
                  <span className={`text-[10px] font-semibold mt-1 ${step.active ? 'text-[#2563EB]' : 'text-slate-500'}`}>
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex-1 h-[1px] bg-[#2563EB] opacity-10 mx-2" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="mx-6 mt-4 border border-[#D9D9D9] rounded-[20px] p-4">
          <h3 className="text-[14px] font-semibold text-black mb-3">Frequently Asked Question(FAQs)</h3>
          <div className="space-y-0">
            {faqs.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="flex items-center justify-between w-full py-3"
                >
                  <span className="text-[12px] font-medium text-black/80 text-left">{faq.q}</span>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ml-2 ${
                    expandedFaq === i ? 'bg-[#2563EB]/10' : 'bg-slate-100'
                  }`}>
                    <ChevronDown size={12} className={`transition-transform ${expandedFaq === i ? 'rotate-180 text-[#2563EB]' : 'text-slate-500'}`} />
                  </div>
                </button>
                <AnimatePresence>
                  {expandedFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="text-[10px] text-slate-500 font-medium pb-3 leading-[18px]">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                {i < faqs.length - 1 && <div className="h-[0.5px] bg-[#D9D9D9]" />}
              </div>
            ))}
          </div>
        </div>

        {/* Social Proof */}
        <div className="mx-6 mt-4 px-4">
          <p className="text-[12px] leading-[18px]">
            <span className="font-semibold text-black">23 dealers</span>
            <span className="font-medium text-slate-500"> in your area already applied this week.</span>
          </p>
        </div>

        {/* CTA Button */}
        <div className="mx-6 mt-4 mb-8">
          <button className="w-full bg-[#627085] text-white py-4 rounded-[10px] flex items-center justify-center gap-2">
            <Check size={16} className="text-white" />
            <span className="text-[14px] font-medium">Application Submitted</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DealerBnplView;
