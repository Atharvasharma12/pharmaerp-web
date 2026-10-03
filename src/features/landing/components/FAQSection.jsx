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

import {
  AppBadge,
  AppBox,
  AppButton,
  AppCard,
  AppHeading,
  AppStack,
  AppText,
} from "@/components";

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
    <section className="w-full bg-bg py-10">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <AppBadge
            variant="soft"
            colorVariant="success"
            rounded="full"
            startIcon={<FiHelpCircle />}
            label="FAQ"
            sx={{
              mb: 1.5,
              px: 1.5,
              py: 0.5,
              fontSize: "12px",
              fontWeight: 700,
            }}
          />

          <AppHeading
            level={2}
            weight={800}
            sx={{
              m: 0,
              fontSize: { xs: "30px", sm: "36px", lg: "44px" },
              lineHeight: 1.08,
              letterSpacing: "-0.8px",
              color: "var(--app-color-text)",
            }}
          >
            Frequently Asked Questions
          </AppHeading>

          <AppText
            variant="body2"
            sx={{
              mx: "auto",
              mt: 1.5,
              fontSize: "15px",
              lineHeight: "24px",
              color: "var(--app-color-text-muted)",
            }}
          >
            Find answers to common questions about{" "}
            <span className="font-bold text-primary">PharmaERP</span>
          </AppText>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.33fr_0.67fr]">
          <AppCard
            variant="default"
            rounded="xl"
            bordered
            shadow="sm"
            padding="none"
            sx={{
              p: 3,
              borderColor: "var(--app-color-success-soft)",
              bgcolor: "var(--app-color-readonly-bg)",
            }}
          >
            <AppBox sx={{ textAlign: "center" }}>
              <AppBox
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{
                  mx: "auto",
                  width: 100,
                  height: 100,
                  borderRadius: "999px",
                  bgcolor: "var(--app-color-success-soft)",
                  color: "var(--app-color-success)",
                  fontSize: "58px",
                  fontWeight: 800,
                  lineHeight: 1,
                }}
              >
                ?
              </AppBox>

              <AppHeading
                level={3}
                weight={800}
                sx={{
                  mt: 2.5,
                  mb: 0,
                  fontSize: "20px",
                  lineHeight: 1.35,
                  color: "var(--app-color-text)",
                }}
              >
                Everything You Need to Know
                <span className="block">
                  About <span className="text-primary">PharmaERP</span>
                </span>
              </AppHeading>

              <AppBox
                component="span"
                sx={{
                  mx: "auto",
                  mt: 1.5,
                  display: "block",
                  width: 44,
                  height: 2,
                  borderRadius: "999px",
                  bgcolor: "var(--app-color-primary)",
                }}
              />
            </AppBox>

            <AppText
              variant="body2"
              sx={{
                mt: 2.5,
                fontSize: "14px",
                lineHeight: "24px",
                color: "var(--app-color-text-muted)",
              }}
            >
              PharmaERP is designed to simplify pharmacy operations and help you
              grow your business with confidence.
            </AppText>

            <AppBox
              sx={{
                mt: 2.5,
                "& > * + *": {
                  borderTop: "1px solid var(--app-color-border)",
                },
              }}
            >
              {infoItems.map((item) => (
                <InfoItem key={item.title} {...item} />
              ))}
            </AppBox>
          </AppCard>

          <AppStack direction="column" gap={1.25}>
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <AppCard
                  key={faq.question}
                  variant="default"
                  rounded="lg"
                  bordered
                  shadow="sm"
                  padding="none"
                  sx={{
                    overflow: "hidden",
                    borderColor: isOpen
                      ? "var(--app-color-success-soft)"
                      : "var(--app-color-border)",
                    bgcolor: isOpen
                      ? "var(--app-color-readonly-bg)"
                      : "var(--app-color-surface)",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <AppText
                      variant="body2"
                      weight={800}
                      sx={{
                        fontSize: "15px",
                        lineHeight: "24px",
                        color: isOpen
                          ? "var(--app-color-success)"
                          : "var(--app-color-text)",
                      }}
                    >
                      {index + 1}. {faq.question}
                    </AppText>

                    <AppBox
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      sx={{
                        width: 24,
                        height: 24,
                        minWidth: 24,
                        flexShrink: 0,
                        borderRadius: "999px",
                        border: "1px solid",
                        borderColor: isOpen
                          ? "var(--app-color-success)"
                          : "var(--app-color-border-strong)",
                        bgcolor: isOpen
                          ? "var(--app-color-success)"
                          : "var(--app-color-surface)",
                        color: isOpen
                          ? "var(--app-color-success-contrast)"
                          : "var(--app-color-text)",
                        fontSize: "16px",
                        lineHeight: 0,
                      }}
                    >
                      {isOpen ? <FiMinus /> : <FiPlus />}
                    </AppBox>
                  </button>

                  {isOpen && (
                    <AppText
                      variant="body2"
                      sx={{
                        px: 2.5,
                        pb: 2.5,
                        pr: 7,
                        fontSize: "14px",
                        lineHeight: "24px",
                        color: "var(--app-color-text-muted)",
                      }}
                    >
                      {faq.answer}
                    </AppText>
                  )}
                </AppCard>
              );
            })}
          </AppStack>
        </div>

        <AppCard
          variant="default"
          rounded="xl"
          bordered
          shadow="sm"
          padding="none"
          sx={{
            mt: 3,
            px: 2.5,
            py: 2,
            borderColor: "var(--app-color-success-soft)",
            bgcolor: "var(--app-color-readonly-bg)",
          }}
        >
          <div className="grid items-center gap-5 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-4">
              <AppBox
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{
                  width: 56,
                  height: 56,
                  minWidth: 56,
                  flexShrink: 0,
                  borderRadius: "999px",
                  bgcolor: "var(--app-color-success-soft)",
                  color: "var(--app-color-success)",
                  fontSize: "28px",
                  lineHeight: 0,
                }}
              >
                <FiHeadphones />
              </AppBox>

              <AppBox>
                <AppHeading
                  level={4}
                  weight={800}
                  sx={{
                    m: 0,
                    fontSize: "16px",
                    color: "var(--app-color-text)",
                  }}
                >
                  Still have questions?
                </AppHeading>

                <AppText
                  variant="body2"
                  sx={{
                    mt: 0.5,
                    fontSize: "12.5px",
                    lineHeight: "20px",
                    color: "var(--app-color-text-muted)",
                  }}
                >
                  Our team is here to help you with anything you need.
                </AppText>
              </AppBox>
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

            <AppBox sx={{ textAlign: { xs: "center", lg: "left" } }}>
              <AppButton
                variant="contained"
                colorVariant="success"
                rounded="md"
                fullWidth
                sx={{
                  px: 2.5,
                  py: 1.5,
                  fontSize: "14px",
                  fontWeight: 700,
                  boxShadow: "var(--app-shadow-sm)",
                }}
              >
                Request a Free Demo
              </AppButton>

              <AppText
                variant="caption"
                align="center"
                sx={{
                  mt: 1,
                  fontSize: "12px",
                  color: "var(--app-color-text-muted)",
                }}
              >
                No commitment. No credit card required.
              </AppText>
            </AppBox>
          </div>
        </AppCard>
      </div>
    </section>
  );
};

const InfoItem = ({ icon, title, desc }) => {
  return (
    <AppStack direction="row" gap={1.5} sx={{ py: 1.5 }}>
      <AppBox
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          width: 40,
          height: 40,
          minWidth: 40,
          flexShrink: 0,
          borderRadius: "8px",
          border: "1px solid var(--app-color-success-soft)",
          bgcolor: "var(--app-color-surface)",
          color: "var(--app-color-success)",
          fontSize: "20px",
          lineHeight: 0,
        }}
      >
        {icon}
      </AppBox>

      <AppBox>
        <AppHeading
          level={4}
          weight={700}
          sx={{
            m: 0,
            fontSize: "13px",
            color: "var(--app-color-text)",
          }}
        >
          {title}
        </AppHeading>

        <AppText
          variant="body2"
          sx={{
            mt: 0.5,
            fontSize: "12.5px",
            lineHeight: "20px",
            color: "var(--app-color-text-muted)",
          }}
        >
          {desc}
        </AppText>
      </AppBox>
    </AppStack>
  );
};

const ContactItem = ({ icon, title, desc, subDesc }) => {
  return (
    <AppStack
      direction="row"
      align="center"
      gap={2}
      sx={{
        pl: { lg: 4 },
        borderLeft: {
          xs: "none",
          lg: "1px solid var(--app-color-border)",
        },
      }}
    >
      <AppBox
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          width: 48,
          height: 48,
          minWidth: 48,
          flexShrink: 0,
          borderRadius: "999px",
          bgcolor: "var(--app-color-success-soft)",
          color: "var(--app-color-success)",
          fontSize: "24px",
          lineHeight: 0,
        }}
      >
        {icon}
      </AppBox>

      <AppBox>
        <AppHeading
          level={4}
          weight={700}
          sx={{
            m: 0,
            fontSize: "14px",
            color: "var(--app-color-text)",
          }}
        >
          {title}
        </AppHeading>

        <AppText
          variant="body2"
          sx={{
            mt: 0.5,
            fontSize: "12px",
            lineHeight: "20px",
            color: "var(--app-color-text-muted)",
          }}
        >
          {desc}
        </AppText>

        {subDesc && (
          <AppText
            variant="body2"
            sx={{
              fontSize: "12px",
              lineHeight: "20px",
              color: "var(--app-color-text-muted)",
            }}
          >
            {subDesc}
          </AppText>
        )}
      </AppBox>
    </AppStack>
  );
};

export default FAQSection;
