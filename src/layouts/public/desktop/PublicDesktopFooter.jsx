// src/layouts/public/desktop/PublicDesktopFooter.jsx

import React from "react";
import { Link } from "react-router-dom";

import {
  FiShield,
  FiCloud,
  FiHeadphones,
  FiSend,
  FiLock,
  FiRefreshCw,
} from "react-icons/fi";

import {
  FaPlus,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa6";

import { HiCurrencyRupee } from "react-icons/hi2";

import {
  AppBox,
  AppButton,
  AppGrid,
  AppHeading,
  AppInput,
  AppLink,
  AppStack,
  AppText,
} from "@/components";

const PublicDesktopFooter = () => {
  const productLinks = [
    { label: "Features", path: "/features" },
    { label: "Inventory Management", path: "/features/inventory-management" },
    { label: "Billing & Invoicing", path: "/features/billing-invoicing" },
    { label: "GST & Compliance", path: "/features/gst-compliance" },
    { label: "Reports & Analytics", path: "/features/reports-analytics" },
  ];

  const solutionLinks = [
    { label: "Independent Pharmacy", path: "/solutions/independent-pharmacy" },
    { label: "Chain Pharmacy", path: "/solutions/chain-pharmacy" },
    { label: "Distributors", path: "/solutions/distributors" },
    { label: "Medical Stores", path: "/solutions/medical-stores" },
  ];

  const companyLinks = [
    { label: "About Us", path: "/about" },
    { label: "Pricing", path: "/pricing" },
    { label: "Testimonials", path: "/testimonials" },
    { label: "Careers", path: "/careers" },
  ];

  const resourceLinks = [
    { label: "Blog", path: "/blog" },
    { label: "Help Center", path: "/help-center" },
    { label: "Guides", path: "/guides" },
    { label: "API Documentation", path: "/api-docs" },
  ];

  const trustItems = [
    {
      icon: <FiCloud />,
      title: "Secure Cloud",
      text: "Your data is safe with us",
    },
    {
      icon: <FiLock />,
      title: "Daily Backups",
      text: "Automatic backups for peace of mind",
    },
    {
      icon: <FiRefreshCw />,
      title: "99.9% Uptime",
      text: "Reliable performance",
    },
    {
      icon: <FiHeadphones />,
      title: "Expert Support",
      text: "We're here to help",
    },
  ];

  return (
    <footer className="w-full bg-surface-alt pt-12 pb-6">
      <div className="mx-auto w-full max-w-7xl px-8">
        <AppGrid
          xs={1}
          gap={4}
          sx={{
            pb: 5,
            borderBottom: "1px solid var(--app-color-border)",
            gridTemplateColumns: "1.35fr 0.8fr 0.8fr 0.8fr 0.8fr 1.25fr",
          }}
        >
          <AppBox>
            <Link
              to="/"
              className="inline-flex items-center gap-3 no-underline"
            >
              <AppBox
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "10px",
                  bgcolor: "var(--app-color-primary-soft)",
                  color: "var(--app-color-primary)",
                  fontSize: "22px",
                  lineHeight: 0,
                }}
              >
                <FaPlus />
              </AppBox>

              <AppText
                variant="h5"
                weight={700}
                sx={{
                  fontSize: "25px",
                  letterSpacing: "-0.4px",
                  color: "var(--app-color-text)",
                }}
              >
                Pharma<span className="text-primary">ERP</span>
              </AppText>
            </Link>

            <AppText
              variant="body2"
              sx={{
                mt: 2,
                maxWidth: 260,
                fontSize: "13px",
                lineHeight: "24px",
                color: "var(--app-color-text-muted)",
              }}
            >
              All-in-one pharmacy management software to simplify operations and
              grow your pharmacy business.
            </AppText>

            <AppStack direction="column" gap={1.5} sx={{ mt: 3 }}>
              <FooterInfo icon={<FiShield />} text="100% Secure & Reliable" />
              <FooterInfo icon={<FiCloud />} text="Cloud Based" />
              <FooterInfo icon={<HiCurrencyRupee />} text="GST Compliant" />
              <FooterInfo icon={<FiHeadphones />} text="Dedicated Support" />
            </AppStack>
          </AppBox>

          <FooterColumn title="Product" links={productLinks} />
          <FooterColumn title="Solutions" links={solutionLinks} />
          <FooterColumn title="Company" links={companyLinks} />
          <FooterColumn title="Resources" links={resourceLinks} />

          <AppBox>
            <AppHeading
              level={3}
              weight={700}
              sx={{
                m: 0,
                fontSize: "15px",
                color: "var(--app-color-text)",
              }}
            >
              Stay Updated
            </AppHeading>

            <AppText
              variant="body2"
              sx={{
                mt: 2,
                fontSize: "13px",
                lineHeight: "24px",
                color: "var(--app-color-text-muted)",
              }}
            >
              Get latest updates, features and pharmacy tips.
            </AppText>

            <AppBox
              component="form"
              onSubmit={(event) => event.preventDefault()}
              sx={{
                mt: 2,
                display: "flex",
                overflow: "hidden",
                borderRadius: "10px",
                border: "1px solid var(--app-color-border)",
                bgcolor: "var(--app-color-surface)",
              }}
            >
              <AppInput
                type="email"
                placeholder="Enter your email"
                variant="surface"
                fullWidth
                inputSx={{
                  border: 0,
                  boxShadow: "none",
                  fontSize: "13px",
                  "& fieldset": {
                    border: "none",
                  },
                }}
                sx={{
                  flex: 1,
                  minWidth: 0,
                }}
              />

              <AppButton
                type="submit"
                variant="contained"
                colorVariant="primary"
                rounded="sm"
                sx={{
                  minWidth: 46,
                  width: 46,
                  px: 0,
                  borderRadius: 0,
                }}
              >
                <FiSend style={{ fontSize: 16 }} />
              </AppButton>
            </AppBox>

            <AppHeading
              level={3}
              weight={700}
              sx={{
                mt: 3,
                mb: 0,
                fontSize: "15px",
                color: "var(--app-color-text)",
              }}
            >
              Follow Us
            </AppHeading>

            <AppStack direction="row" align="center" gap={1.5} sx={{ mt: 2 }}>
              <SocialIcon icon={<FaFacebookF />} path="/" />
              <SocialIcon icon={<FaInstagram />} path="/" />
              <SocialIcon icon={<FaLinkedinIn />} path="/" />
              <SocialIcon icon={<FaYoutube />} path="/" />
            </AppStack>
          </AppBox>
        </AppGrid>

        <AppGrid
          xs={5}
          gap={2.5}
          sx={{
            py: 3,
            borderBottom: "1px solid var(--app-color-border)",
          }}
        >
          <AppStack direction="row" align="center" gap={1.5}>
            <FiShield
              style={{
                fontSize: 36,
                color: "var(--app-color-primary)",
                flexShrink: 0,
              }}
            />

            <AppBox>
              <AppText
                variant="body2"
                weight={600}
                sx={{
                  fontSize: "13px",
                  color: "var(--app-color-text)",
                }}
              >
                Trusted by{" "}
                <span className="font-bold text-primary">5,000+</span>{" "}
                Pharmacies
              </AppText>

              <AppText
                variant="body2"
                sx={{
                  mt: 0.25,
                  fontSize: "12px",
                  color: "var(--app-color-text-muted)",
                }}
              >
                Across India
              </AppText>
            </AppBox>
          </AppStack>

          {trustItems.map((item) => (
            <TrustItem key={item.title} {...item} />
          ))}
        </AppGrid>

        <AppStack
          direction="row"
          align="center"
          justify="space-between"
          gap={2}
          sx={{
            pt: 3,
            fontSize: "12px",
            color: "var(--app-color-text-muted)",
          }}
        >
          <AppText
            variant="caption"
            sx={{
              fontSize: "12px",
              color: "var(--app-color-text-muted)",
            }}
          >
            © 2024 PharmaERP. All rights reserved.
          </AppText>

          <AppStack direction="row" align="center" wrap="wrap" gap={3}>
            {[
              { label: "Privacy Policy", path: "/privacy-policy" },
              { label: "Terms of Service", path: "/terms-of-service" },
              { label: "Refund Policy", path: "/refund-policy" },
              { label: "Security", path: "/security" },
            ].map((item) => (
              <AppLink
                key={item.label}
                component={Link}
                to={item.path}
                underline="none"
                sx={{
                  fontSize: "12px",
                  color: "var(--app-color-text-muted)",
                  transition: "0.2s ease",
                  "&:hover": {
                    color: "var(--app-color-primary)",
                  },
                }}
              >
                {item.label}
              </AppLink>
            ))}
          </AppStack>
        </AppStack>
      </div>
    </footer>
  );
};

const FooterColumn = ({ title, links }) => {
  return (
    <AppBox>
      <AppHeading
        level={3}
        weight={700}
        sx={{
          m: 0,
          fontSize: "15px",
          color: "var(--app-color-text)",
        }}
      >
        {title}
      </AppHeading>

      <AppStack component="ul" direction="column" gap={1.5} sx={{ mt: 2 }}>
        {links.map((link) => (
          <AppBox component="li" key={link.label} sx={{ listStyle: "none" }}>
            <AppLink
              component={Link}
              to={link.path}
              underline="none"
              sx={{
                fontSize: "13px",
                color: "var(--app-color-text-muted)",
                transition: "0.2s ease",
                "&:hover": {
                  color: "var(--app-color-primary)",
                },
              }}
            >
              {link.label}
            </AppLink>
          </AppBox>
        ))}
      </AppStack>
    </AppBox>
  );
};

const FooterInfo = ({ icon, text }) => {
  return (
    <AppStack direction="row" align="center" gap={1.5}>
      <AppBox
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          width: 32,
          height: 32,
          borderRadius: "8px",
          bgcolor: "var(--app-color-primary-soft)",
          color: "var(--app-color-primary)",
          fontSize: "16px",
          lineHeight: 0,
          flexShrink: 0,
        }}
      >
        {icon}
      </AppBox>

      <AppText
        variant="body2"
        weight={500}
        sx={{
          fontSize: "13px",
          color: "var(--app-color-text)",
        }}
      >
        {text}
      </AppText>
    </AppStack>
  );
};

const TrustItem = ({ icon, title, text }) => {
  return (
    <AppStack
      direction="row"
      align="center"
      gap={1.5}
      sx={{
        borderLeft: "1px solid var(--app-color-border)",
        pl: 2.5,
      }}
    >
      <AppBox
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          width: 42,
          height: 42,
          borderRadius: "999px",
          bgcolor: "var(--app-color-primary-soft)",
          color: "var(--app-color-primary)",
          fontSize: "20px",
          lineHeight: 0,
          flexShrink: 0,
        }}
      >
        {icon}
      </AppBox>

      <AppBox>
        <AppText
          variant="body2"
          weight={600}
          sx={{
            fontSize: "13px",
            color: "var(--app-color-text)",
          }}
        >
          {title}
        </AppText>

        <AppText
          variant="body2"
          sx={{
            mt: 0.25,
            fontSize: "12px",
            color: "var(--app-color-text-muted)",
          }}
        >
          {text}
        </AppText>
      </AppBox>
    </AppStack>
  );
};

const SocialIcon = ({ icon, path }) => {
  return (
    <AppLink
      component={Link}
      to={path}
      underline="none"
      sx={{
        width: 36,
        height: 36,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "999px",
        border: "1px solid var(--app-color-border)",
        bgcolor: "var(--app-color-surface)",
        color: "var(--app-color-text)",
        fontSize: "15px",
        transition: "0.2s ease",
        "&:hover": {
          color: "var(--app-color-primary)",
          borderColor: "var(--app-color-primary)",
        },
      }}
    >
      {icon}
    </AppLink>
  );
};

export default PublicDesktopFooter;
