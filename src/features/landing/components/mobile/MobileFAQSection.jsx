// src/features/landing/components/mobile/MobileFAQSection.jsx

import { useMemo, useState } from "react";
import {
  FiChevronDown,
  FiChevronUp,
  FiCloud,
  FiGrid,
  FiHeadphones,
  FiHelpCircle,
  FiPhone,
  FiSearch,
  FiShield,
  FiSmartphone,
} from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";

import {
  AppBox,
  AppButton,
  AppCard,
  AppHeading,
  AppInput,
  AppText,
} from "@/components";

const MobileFAQSection = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [openIndex, setOpenIndex] = useState(0);
  const [search, setSearch] = useState("");

  const categories = [
    { id: "all", label: "All", icon: <FiGrid /> },
    { id: "pricing", label: "Pricing", icon: <FaRupeeSign /> },
    { id: "features", label: "Features", icon: <FiHelpCircle /> },
    { id: "billing", label: "Billing", icon: <FiSmartphone /> },
    { id: "support", label: "Support", icon: <FiHeadphones /> },
  ];

  const faqs = [
    {
      category: "billing",
      icon: <FiShield />,
      tone: "primary",
      question: "Is PharmaERP GST compliant?",
      answer:
        "Yes, PharmaERP is 100% GST compliant. You can generate GST invoices, e-way bills, GST reports and file GSTR-1 & E-Invoicing directly from the software.",
    },
    {
      category: "features",
      icon: <FiCloud />,
      tone: "info",
      question: "Can I use PharmaERP for multiple stores?",
      answer:
        "Yes, you can manage multiple pharmacy stores, users, inventory, sales and reports from one centralized account.",
    },
    {
      category: "support",
      icon: <FiCloud />,
      tone: "primary",
      question: "Is my data safe and backed up?",
      answer:
        "Yes, your data is protected with secure cloud backup, role-based access and reliable security controls.",
    },
    {
      category: "features",
      icon: <FiSmartphone />,
      tone: "warning",
      question: "Can I access PharmaERP on mobile?",
      answer:
        "Yes, PharmaERP works on desktop, laptop, tablet and mobile browser so you can manage your pharmacy anytime.",
    },
    {
      category: "support",
      icon: <FiHeadphones />,
      tone: "error",
      question: "Do you provide training and support?",
      answer:
        "Yes, onboarding, training and support are available to help your team get started smoothly.",
    },
    {
      category: "pricing",
      icon: <FaRupeeSign />,
      tone: "primary",
      question: "Can I upgrade or downgrade my plan anytime?",
      answer:
        "Yes, you can upgrade or downgrade your plan anytime as your pharmacy business grows.",
    },
  ];

  const filteredFaqs = useMemo(() => {
    return faqs.filter((item) => {
      const matchesCategory =
        activeCategory === "all" || item.category === activeCategory;

      const matchesSearch =
        !search.trim() ||
        item.question.toLowerCase().includes(search.toLowerCase()) ||
        item.answer.toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  const trustItems = [
    {
      icon: <FiShield />,
      title: "Secure & Reliable",
      desc: "Your data is safe with us",
    },
    {
      icon: <FiCloud />,
      title: "Regular Backups",
      desc: "Automatic backups every day",
    },
    {
      icon: <FiHelpCircle />,
      title: "24/7 Support",
      desc: "Always here when you need us",
    },
    {
      icon: <FaRupeeSign />,
      title: "No Hidden Costs",
      desc: "Transparent pricing, no surprises",
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-bg">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_84%_8%,color-mix(in_srgb,var(--app-color-primary)_8%,transparent),transparent_30%)]" />

      <AppBox sx={sectionSx}>
        <div className="grid grid-cols-[1fr_auto] items-center gap-2">
          <div className="min-w-0">
            <AppHeading level={2} weight={800} sx={titleSx}>
              Frequently Asked Questions About{" "}
              <span className="text-primary">PharmaERP</span>
            </AppHeading>

            <AppText variant="body2" weight={600} sx={subtitleSx}>
              Find quick answers to common questions from pharmacy owners like
              you.
            </AppText>
          </div>

          <QuestionIllustration />
        </div>

        <AppInput
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search your question..."
          fullWidth
          size="small"
          variant="bordered"
          rounded="xl"
          startIcon={<FiSearch />}
          sx={{ mt: 3 }}
          inputSx={searchInputSx}
        />

        <div className="mt-3 flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((category) => {
            const isActive = activeCategory === category.id;

            return (
              <AppButton
                key={category.id}
                type="button"
                onClick={() => {
                  setActiveCategory(category.id);
                  setOpenIndex(0);
                }}
                variant={isActive ? "soft" : "outlined"}
                colorVariant="primary"
                rounded="lg"
                startIcon={category.icon}
                sx={{
                  flexShrink: 0,
                  minWidth: "unset",
                  height: 36,
                  px: 1.35,
                  fontSize: "10.8px",
                  fontWeight: 750,
                  textTransform: "none",
                  bgcolor: isActive
                    ? "var(--app-color-primary-soft)"
                    : "var(--app-color-surface)",
                  borderColor: "var(--app-color-border)",
                  color: isActive
                    ? "var(--app-color-primary)"
                    : "var(--app-color-text)",
                }}
              >
                {category.label}
              </AppButton>
            );
          })}
        </div>

        <div className="mt-3 space-y-2">
          {filteredFaqs.map((faq, index) => (
            <FAQItem
              key={faq.question}
              {...faq}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </div>

        <SupportCard />

        <AppCard
          variant="default"
          rounded="xl"
          bordered
          shadow="sm"
          padding="none"
          sx={trustCardSx}
        >
          <div className="grid grid-cols-4 divide-x divide-border">
            {trustItems.map((item) => (
              <TrustItem key={item.title} {...item} />
            ))}
          </div>
        </AppCard>
      </AppBox>
    </section>
  );
};

const FAQItem = ({ icon, tone, question, answer, isOpen, onClick }) => {
  return (
    <AppCard
      variant="default"
      rounded="xl"
      bordered
      shadow="sm"
      padding="none"
      sx={{
        overflow: "hidden",
        bgcolor: "var(--app-color-surface)",
        borderColor: isOpen
          ? "var(--app-color-primary-soft)"
          : "var(--app-color-border)",
      }}
    >
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center gap-2.5 px-2.5 py-2.5 text-left"
      >
        <AppBox sx={iconBoxSx(tone)}>{icon}</AppBox>

        <AppHeading level={3} weight={800} sx={questionSx}>
          {question}
        </AppHeading>

        {isOpen ? (
          <FiChevronUp className="shrink-0 text-[18px] text-primary" />
        ) : (
          <FiChevronDown className="shrink-0 text-[18px] text-text" />
        )}
      </button>

      {isOpen && (
        <div className="border-l-2 border-primary px-4 pb-3 pl-[62px]">
          <AppText variant="body2" weight={500} sx={answerSx}>
            {answer}
          </AppText>
        </div>
      )}
    </AppCard>
  );
};

const SupportCard = () => {
  return (
    <AppCard
      variant="default"
      rounded="xl"
      bordered={false}
      shadow="sm"
      padding="none"
      sx={supportCardSx}
    >
      <div className="grid grid-cols-[88px_1fr] items-center gap-2">
        <AvatarGroup />

        <div className="min-w-0">
          <AppHeading level={3} weight={800} sx={supportTitleSx}>
            Still have questions?
          </AppHeading>

          <AppText variant="body2" weight={600} sx={supportTextSx}>
            Our support team is here to help you.
          </AppText>

          <div className="mt-2 grid grid-cols-2 gap-2">
            <AppButton
              variant="outlined"
              colorVariant="primary"
              rounded="md"
              startIcon={<FiHeadphones />}
              sx={supportButtonSx}
            >
              Chat with Us
            </AppButton>

            <AppButton
              variant="contained"
              colorVariant="primary"
              rounded="md"
              startIcon={<FiPhone />}
              sx={supportButtonSx}
            >
              Call Now
            </AppButton>
          </div>
        </div>
      </div>
    </AppCard>
  );
};

const AvatarGroup = () => {
  return (
    <div className="relative h-[72px] w-[88px]">
      <div className="absolute left-0 top-2 h-14 w-14 overflow-hidden rounded-full border-2 border-surface bg-primary-soft">
        <img
          src="https://i.pravatar.cc/100?img=47"
          alt="Support agent"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="absolute left-8 top-0 h-16 w-16 overflow-hidden rounded-full border-2 border-surface bg-primary-soft">
        <img
          src="https://i.pravatar.cc/100?img=12"
          alt="Support agent"
          className="h-full w-full object-cover"
        />
      </div>

      <span className="absolute bottom-1 right-2 h-4 w-4 rounded-full border-2 border-surface bg-primary" />
    </div>
  );
};

const TrustItem = ({ icon, title, desc }) => {
  return (
    <div className="flex flex-col items-center px-1.5 py-3 text-center">
      <AppBox sx={trustIconSx}>{icon}</AppBox>

      <AppHeading level={4} weight={800} sx={trustTitleSx}>
        {title}
      </AppHeading>

      <AppText variant="body2" weight={500} sx={trustDescSx}>
        {desc}
      </AppText>
    </div>
  );
};

const QuestionIllustration = () => {
  return (
    <div className="relative h-[118px] w-[118px] shrink-0">
      <span className="absolute right-0 top-0 h-16 w-16 rounded-full bg-primary-soft" />
      <span className="absolute bottom-2 left-1 h-12 w-12 rounded-full bg-info-soft" />

      <div className="absolute right-2 top-8 flex h-[62px] w-[78px] items-center justify-center rounded-[28px] bg-surface text-[42px] font-black text-primary shadow-md">
        ?
      </div>

      <div className="absolute bottom-3 left-0 flex h-8 w-12 items-center justify-center rounded-lg bg-info-soft text-[18px] font-black text-info shadow-sm">
        ...
      </div>
    </div>
  );
};

const sectionSx = {
  position: "relative",
  zIndex: 1,
  width: "100%",
  maxWidth: { xs: 390, sm: 430, md: 460 },
  mx: "auto",
  px: { xs: 2, sm: 2.5 },
  py: { xs: 4, sm: 4.5 },
};

const titleSx = {
  m: 0,
  maxWidth: 250,
  fontSize: { xs: "24px", sm: "26px" },
  lineHeight: 1.24,
  letterSpacing: "-0.65px",
  color: "var(--app-color-text)",
};

const subtitleSx = {
  mt: 1.2,
  maxWidth: 235,
  fontSize: { xs: "12.4px", sm: "13px" },
  lineHeight: "20px",
  color: "var(--app-color-text-muted)",
};

const searchInputSx = {
  minHeight: 48,
  fontSize: "12.5px",
  fontWeight: 600,
  bgcolor: "var(--app-color-surface)",
  boxShadow: "var(--app-shadow-sm)",
};

const iconBoxSx = (tone) => ({
  width: 42,
  height: 42,
  minWidth: 42,
  borderRadius: "999px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: `var(--app-color-${tone}-soft)`,
  color: `var(--app-color-${tone})`,
  fontSize: "21px",
});

const questionSx = {
  m: 0,
  flex: 1,
  fontSize: "13px",
  lineHeight: 1.35,
  color: "var(--app-color-text)",
};

const answerSx = {
  fontSize: "11.7px",
  lineHeight: "19px",
  color: "var(--app-color-text-muted)",
};

const supportCardSx = {
  mt: 3,
  px: 2,
  py: 2,
  bgcolor: "var(--app-color-readonly-bg)",
};

const supportTitleSx = {
  m: 0,
  fontSize: "16px",
  lineHeight: 1.2,
  letterSpacing: "-0.25px",
  color: "var(--app-color-text)",
};

const supportTextSx = {
  mt: 0.5,
  fontSize: "11.7px",
  lineHeight: "17px",
  color: "var(--app-color-text-muted)",
};

const supportButtonSx = {
  minWidth: "unset",
  height: 38,
  px: 1,
  fontSize: "11.5px",
  fontWeight: 800,
  textTransform: "none",
};

const trustCardSx = {
  mt: 3,
  overflow: "hidden",
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const trustIconSx = {
  width: 42,
  height: 42,
  borderRadius: "999px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: "var(--app-color-primary-soft)",
  color: "var(--app-color-primary)",
  fontSize: "22px",
};

const trustTitleSx = {
  mt: 1,
  mb: 0,
  minHeight: 28,
  fontSize: "10.8px",
  lineHeight: "14px",
  color: "var(--app-color-text)",
};

const trustDescSx = {
  mt: 0.6,
  fontSize: "9.6px",
  lineHeight: "14px",
  color: "var(--app-color-text-muted)",
};

export default MobileFAQSection;
