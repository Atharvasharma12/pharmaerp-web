import React, { useState } from "react";
import {
  FiHelpCircle,
  FiShield,
  FiCloud,
  FiHeadphones,
  FiRefreshCw,
  FiMessageSquare,
  FiPhone,
  FiPlus,
  FiMinus,
} from "react-icons/fi";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "Is PharmaERP GST compliant?",
      answer:
        "Yes, PharmaERP is 100% GST compliant. You can easily generate GST invoices, manage tax slabs, file GST reports and export data for e-invoicing.",
    },
    {
      question: "Does PharmaERP work offline?",
      answer:
        "PharmaERP is cloud based, but selected features can be configured for limited offline usage depending on your setup.",
    },
    {
      question: "Can I manage multiple stores from one account?",
      answer:
        "Yes, you can manage multiple pharmacy stores, users, inventory and reports from one centralized account.",
    },
    {
      question: "Does it support barcode scanning and printers?",
      answer:
        "Yes, PharmaERP supports barcode scanners, bill printers and common pharmacy billing hardware.",
    },
    {
      question: "Will my data be safe and secure?",
      answer:
        "Yes, your data is protected with secure cloud backup, role-based access and reliable security controls.",
    },
    {
      question: "Can I access PharmaERP on mobile?",
      answer:
        "Yes, you can access PharmaERP from desktop, laptop, tablet or mobile browser anytime.",
    },
    {
      question: "How easy is it to use PharmaERP?",
      answer:
        "PharmaERP is designed with a simple interface so pharmacy owners and staff can learn it quickly.",
    },
    {
      question: "Do you provide training and support?",
      answer:
        "Yes, onboarding, training and support are available to help your team get started smoothly.",
    },
    {
      question: "Can I upgrade or downgrade my plan anytime?",
      answer:
        "Yes, you can upgrade or downgrade your plan anytime as your pharmacy business grows.",
    },
  ];

  const infoItems = [
    {
      icon: <FiShield />,
      title: "100% Secure & Reliable",
      desc: "Your data is safe with advanced security and daily backups.",
    },
    {
      icon: <FiCloud />,
      title: "Access Anywhere, Anytime",
      desc: "Use on desktop, laptop or mobile from anywhere.",
    },
    {
      icon: <FiHeadphones />,
      title: "Expert Support",
      desc: "Our support team is always ready to help you.",
    },
    {
      icon: <FiRefreshCw />,
      title: "Regular Updates",
      desc: "We continuously update features to keep you ahead.",
    },
  ];

  return (
    <section className="w-full bg-[#fbfcfd] py-10">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* HEADING */}
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[12px] font-semibold text-[#08a84f]">
            <FiHelpCircle className="text-[13px]" />
            FAQ
          </div>

          <h2 className="text-[30px] font-extrabold leading-[1.08] tracking-[-0.8px] text-slate-900 sm:text-[36px] lg:text-[44px]">
            Frequently Asked Questions
          </h2>

          <p className="mx-auto mt-3 text-[15px] leading-6 text-slate-600">
            Find answers to common questions about{" "}
            <span className="font-bold text-[#08a84f]">PharmaERP</span>
          </p>
        </div>

        {/* MAIN FAQ AREA */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[0.33fr_0.67fr]">
          {/* LEFT CARD */}
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/20 p-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <div className="text-center">
              <div className="mx-auto flex h-[100px] w-[100px] items-center justify-center rounded-full bg-emerald-100 text-[58px] font-extrabold text-[#08a84f]">
                ?
              </div>

              <h3 className="mt-5 text-[20px] font-extrabold leading-snug text-slate-900">
                Everything You Need to Know
                <span className="block">
                  About <span className="text-[#08a84f]">PharmaERP</span>
                </span>
              </h3>

              <span className="mx-auto mt-3 block h-[2px] w-11 rounded-full bg-[#08a84f]" />
            </div>

            <p className="mt-5 text-[14px] leading-6 text-slate-600">
              PharmaERP is designed to simplify pharmacy operations and help you
              grow your business with confidence.
            </p>

            <div className="mt-5 divide-y divide-slate-200">
              {infoItems.map((item) => (
                <div key={item.title} className="flex gap-3 py-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-white text-[20px] text-[#08a84f]">
                    {item.icon}
                  </div>

                  <div>
                    <h4 className="text-[13px] font-bold text-slate-900">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-[12.5px] leading-5 text-slate-600">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ LIST */}
          <div className="space-y-2.5">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={faq.question}
                  className={`rounded-xl border bg-white shadow-[0_8px_20px_rgba(15,23,42,0.035)] ${
                    isOpen
                      ? "border-emerald-100 bg-emerald-50/25"
                      : "border-slate-200"
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span
                      className={`text-[15px] font-extrabold leading-6 ${
                        isOpen ? "text-[#08a84f]" : "text-slate-900"
                      }`}
                    >
                      {index + 1}. {faq.question}
                    </span>

                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[16px] ${
                        isOpen
                          ? "border-[#08a84f] bg-[#08a84f] text-white"
                          : "border-slate-300 bg-white text-slate-900"
                      }`}
                    >
                      {isOpen ? <FiMinus /> : <FiPlus />}
                    </span>
                  </button>

                  {isOpen && (
                    <p className="px-5 pb-5 pr-14 text-[14px] leading-6 text-slate-700">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CONTACT STRIP */}
        <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/25 px-5 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <div className="grid items-center gap-5 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[28px] text-[#08a84f]">
                <FiHeadphones />
              </div>
              <div>
                <h4 className="text-[16px] font-extrabold text-slate-900">
                  Still have questions?
                </h4>
                <p className="mt-1 text-[12.5px] leading-5 text-slate-600">
                  Our team is here to help you with anything you need.
                </p>
              </div>
            </div>

            <ContactItem
              icon={<FiMessageSquare />}
              title="Chat with us"
              desc="We typically reply in few minutes"
            />

            <ContactItem
              icon={<FiPhone />}
              title="Call us"
              desc="+91 98765 43210"
              subDesc="Mon - Sat, 9 AM - 7 PM"
            />

            <div className="text-center lg:text-left">
              <button className="w-full rounded-lg bg-[#08a84f] px-5 py-3 text-[14px] font-bold text-white shadow-sm transition hover:bg-[#079447]">
                Request a Free Demo
              </button>
              <p className="mt-2 text-center text-[12px] text-slate-600">
                No commitment. No credit card required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ContactItem = ({ icon, title, desc, subDesc }) => {
  return (
    <div className="flex items-center gap-4 lg:border-l lg:border-slate-200 lg:pl-8">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[24px] text-[#08a84f]">
        {icon}
      </div>

      <div>
        <h4 className="text-[14px] font-bold text-slate-900">{title}</h4>
        <p className="mt-1 text-[12px] leading-5 text-slate-600">{desc}</p>
        {subDesc && (
          <p className="text-[12px] leading-5 text-slate-600">{subDesc}</p>
        )}
      </div>
    </div>
  );
};

export default FAQSection;
