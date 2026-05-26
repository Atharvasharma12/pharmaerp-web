import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiCheck, FiChevronDown, FiGlobe } from "react-icons/fi";

import useIsMobile from "@/hooks/useIsMobile";

const LANGUAGE_STORAGE_KEY = "app-language";
const TRANSLATE_RELOAD_KEY = "translate-reload-done";

const languageOptions = [
  { value: "en", label: "English", shortLabel: "EN" },
  { value: "hi", label: "Hindi", shortLabel: "HN" },
];

const LanguageSelector = ({ size = "medium", align = "right" }) => {
  const isMobile = useIsMobile();

  const [open, setOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY) || "en";
  });

  const rootRef = useRef(null);

  const activeLanguage = useMemo(
    () =>
      languageOptions.find((item) => item.value === selectedLanguage) ||
      languageOptions[0],
    [selectedLanguage],
  );

  const getRootDomain = () => {
    const hostname = window.location.hostname;

    if (hostname === "localhost" || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
      return "";
    }

    const parts = hostname.split(".");

    if (parts.length <= 2) {
      return `.${hostname}`;
    }

    return `.${parts.slice(-2).join(".")}`;
  };

  const setGoogleTranslateCookie = (lang) => {
    const cookieValue = lang === "hi" ? "/en/hi" : "/en/en";
    const rootDomain = getRootDomain();

    document.cookie = `googtrans=${cookieValue}; path=/;`;
    document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname};`;

    if (rootDomain) {
      document.cookie = `googtrans=${cookieValue}; path=/; domain=${rootDomain};`;
    }
  };

  const clearGoogleTranslateCookie = () => {
    const rootDomain = getRootDomain();

    document.cookie =
      "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;

    if (rootDomain) {
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${rootDomain};`;
    }
  };

  const hideGoogleTranslateBar = () => {
    const banner = document.querySelector(".goog-te-banner-frame");
    const iframe = document.querySelector("iframe.skiptranslate");
    const popup = document.getElementById("goog-gt-tt");

    if (banner) banner.style.display = "none";
    if (iframe) iframe.style.display = "none";
    if (popup) popup.style.display = "none";

    document.body.style.top = "0px";
    document.body.style.position = "static";
  };

  const applyGoogleTranslateSelect = (lang) => {
    let attempts = 0;
    const maxAttempts = 40;

    const interval = setInterval(() => {
      const select = document.querySelector(".goog-te-combo");

      attempts += 1;

      if (select) {
        select.value = lang;
        select.dispatchEvent(new Event("change"));
        hideGoogleTranslateBar();
        clearInterval(interval);
      }

      if (attempts >= maxAttempts) {
        clearInterval(interval);
      }
    }, 250);
  };

  const switchToHindi = () => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, "hi");
    localStorage.removeItem(TRANSLATE_RELOAD_KEY);
    setGoogleTranslateCookie("hi");

    applyGoogleTranslateSelect("hi");

    setTimeout(() => {
      if (!localStorage.getItem(TRANSLATE_RELOAD_KEY)) {
        localStorage.setItem(TRANSLATE_RELOAD_KEY, "true");
        window.location.reload();
      }
    }, 700);
  };

  const switchToEnglish = () => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, "en");
    localStorage.removeItem(TRANSLATE_RELOAD_KEY);

    clearGoogleTranslateCookie();

    const select = document.querySelector(".goog-te-combo");

    if (select) {
      select.value = "en";
      select.dispatchEvent(new Event("change"));
    }

    window.location.reload();
  };

  const handleSelect = (lang) => {
    setOpen(false);

    if (lang === selectedLanguage) {
      return;
    }

    setSelectedLanguage(lang);

    if (lang === "hi") {
      switchToHindi();
      return;
    }

    switchToEnglish();
  };

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  useEffect(() => {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) || "en";

    setSelectedLanguage(savedLanguage);

    if (savedLanguage === "hi") {
      setGoogleTranslateCookie("hi");
      applyGoogleTranslateSelect("hi");
    } else {
      clearGoogleTranslateCookie();
      localStorage.removeItem(TRANSLATE_RELOAD_KEY);
    }

    const hideInterval = setInterval(hideGoogleTranslateBar, 500);

    return () => clearInterval(hideInterval);
  }, []);

  const dropdownAlignClass = align === "left" ? "left-0" : "right-0";

  const buttonLabel = isMobile
    ? activeLanguage.shortLabel
    : activeLanguage.label;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label="Select language"
        className={`flex items-center justify-center rounded-xl border border-border-strong bg-surface text-text shadow-sm transition hover:border-primary hover:bg-primary-soft ${
          size === "small" ? "h-9 gap-1.5 px-2.5" : "h-10 gap-2 px-3"
        }`}
      >
        <FiGlobe className="text-[17px] text-primary" />

        <span className="text-[12px] font-semibold uppercase">
          {buttonLabel}
        </span>

        <FiChevronDown
          className={`text-[15px] text-text-muted transition ${
            open ? "rotate-180 text-primary" : ""
          }`}
        />
      </button>

      {open && (
        <div
          className={`absolute ${dropdownAlignClass} top-full z-50 mt-2 w-[150px] rounded-2xl border border-border bg-surface p-2 shadow-xl`}
        >
          {languageOptions.map((item) => {
            const active = activeLanguage.value === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => handleSelect(item.value)}
                className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left transition ${
                  active
                    ? "bg-primary-soft text-primary"
                    : "text-text hover:bg-surface-alt hover:text-primary"
                }`}
              >
                <span className="text-[12px] font-semibold">
                  {isMobile ? item.shortLabel : item.label}
                </span>

                {active && <FiCheck className="text-[14px]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
