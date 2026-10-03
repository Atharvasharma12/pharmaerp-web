import React from "react";
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

const PublicFooter = () => {
  const productLinks = [
    "Features",
    "Inventory Management",
    "Billing & Invoicing",
    "GST & Compliance",
    "Reports & Analytics",
  ];

  const solutionLinks = [
    "Independent Pharmacy",
    "Chain Pharmacy",
    "Distributors",
    "Medical Stores",
  ];

  const companyLinks = ["About Us", "Pricing", "Testimonials", "Careers"];

  const resourceLinks = ["Blog", "Help Center", "Guides", "API Documentation"];

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
    <footer className="w-full bg-surface-alt pt-10 pb-5">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* TOP SECTION */}
        <AppGrid
          xs={1}
          md={2}
          gap={4}
          sx={{
            pb: 4,
            borderBottom: "1px solid var(--app-color-border)",
            "@media (min-width: 1024px)": {
              gridTemplateColumns: "1.3fr 0.8fr 0.8fr 0.8fr 0.8fr 1.2fr",
            },
          }}
        >
          {/* BRAND */}
          <AppBox>
            <AppLink
              href="/"
              underline="none"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1.25,
              }}
            >
              <AppBox
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "8px",
                  bgcolor:
                    "var(--app-color-success-soft, var(--app-color-surface))",
                  color: "var(--app-color-success)",
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
                  fontSize: "24px",
                  letterSpacing: "-0.4px",
                  color: "var(--app-color-text)",
                }}
              >
                Pharma
                <span className="text-primary">ERP</span>
              </AppText>
            </AppLink>

            <AppText
              variant="body2"
              sx={{
                mt: 2,
                maxWidth: 240,
                fontSize: "13px",
                lineHeight: "24px",
                color: "var(--app-color-text-muted)",
              }}
            >
              All-in-one pharmacy management software to simplify operations and
              grow your pharmacy business.
            </AppText>

            <AppStack direction="column" gap={1.5} sx={{ mt: 2.5 }}>
              <FooterInfo icon={<FiShield />} text="100% Secure & Reliable" />
              <FooterInfo icon={<FiCloud />} text="Cloud Based" />
              <FooterInfo icon={<HiCurrencyRupee />} text="GST Compliant" />
              <FooterInfo icon={<FiHeadphones />} text="Dedicated Support" />
            </AppStack>
          </AppBox>

          {/* COLUMNS */}
          <FooterColumn title="Product" links={productLinks} />
          <FooterColumn title="Solutions" links={solutionLinks} />
          <FooterColumn title="Company" links={companyLinks} />
          <FooterColumn title="Resources" links={resourceLinks} />

          {/* NEWSLETTER */}
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
              sx={{
                mt: 2,
                display: "flex",
                overflow: "hidden",
                borderRadius: "8px",
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
                colorVariant="success"
                rounded="sm"
                sx={{
                  minWidth: 44,
                  width: 44,
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
              <SocialIcon icon={<FaFacebookF />} />
              <SocialIcon icon={<FaInstagram />} />
              <SocialIcon icon={<FaLinkedinIn />} />
              <SocialIcon icon={<FaYoutube />} />
            </AppStack>
          </AppBox>
        </AppGrid>

        {/* TRUST BAR */}
        <AppGrid
          xs={1}
          md={2}
          lg={5}
          gap={2.5}
          sx={{
            py: 2.5,
            borderBottom: "1px solid var(--app-color-border)",
          }}
        >
          <AppStack direction="row" align="center" gap={1.5}>
            <FiShield
              style={{
                fontSize: 34,
                color: "var(--app-color-success)",
                flexShrink: 0,
              }}
            />

            <AppBox>
              <AppText
                variant="body2"
                weight={600}
                sx={{ fontSize: "13px", color: "var(--app-color-text)" }}
              >
                Trusted by{" "}
                <span className="font-bold text-primary">5,000+</span>{" "}
                Pharmacies
              </AppText>

              <AppText
                variant="body2"
                sx={{
                  fontSize: "13px",
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

        {/* BOTTOM */}
        <AppStack
          direction={{ xs: "column", md: "row" }}
          align={{ xs: "flex-start", md: "center" }}
          justify="space-between"
          gap={1.5}
          sx={{
            pt: 2.5,
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

          <AppStack direction="row" align="center" wrap="wrap" gap={2.5}>
            {[
              "Privacy Policy",
              "Terms of Service",
              "Refund Policy",
              "Security",
            ].map((item) => (
              <AppLink
                key={item}
                href="/"
                underline="none"
                sx={{
                  fontSize: "12px",
                  color: "var(--app-color-text-muted)",
                  transition: "0.2s ease",
                  "&:hover": {
                    color: "var(--app-color-success)",
                  },
                }}
              >
                {item}
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
          <AppBox component="li" key={link} sx={{ listStyle: "none" }}>
            <AppLink
              href="/"
              underline="none"
              sx={{
                fontSize: "13px",
                color: "var(--app-color-text-muted)",
                transition: "0.2s ease",
                "&:hover": {
                  color: "var(--app-color-success)",
                },
              }}
            >
              {link}
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
          bgcolor: "var(--app-color-success-soft, var(--app-color-surface))",
          color: "var(--app-color-success)",
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
        borderLeft: {
          xs: "none",
          lg: "1px solid var(--app-color-border)",
        },
        pl: {
          xs: 0,
          lg: 2.5,
        },
      }}
    >
      <AppBox
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          width: 40,
          height: 40,
          borderRadius: "999px",
          bgcolor: "var(--app-color-success-soft, var(--app-color-surface))",
          color: "var(--app-color-success)",
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

const SocialIcon = ({ icon }) => {
  return (
    <AppLink
      href="/"
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
          color: "var(--app-color-success)",
          borderColor: "var(--app-color-success)",
        },
      }}
    >
      {icon}
    </AppLink>
  );
};

export default PublicFooter;
