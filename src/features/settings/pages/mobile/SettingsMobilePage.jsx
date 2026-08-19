import { Smartphone, Monitor } from "lucide-react";

const SettingsMobilePage = () => {
  return (
    <section className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-x-hidden bg-bg px-3.5 sm:px-4 pt-4 pb-16 sm:pb-20">
      <div className="relative z-10 my-auto flex w-full max-w-[390px] flex-col items-center justify-center rounded-[18px] border border-border bg-surface p-6 sm:p-8 text-center shadow-[var(--app-shadow-lg)]">
        <div className="flex size-14 items-center justify-center rounded-[12px] bg-primary-soft text-primary shadow-2xs">
          <Smartphone size={28} />
        </div>
        <h1 className="mt-4 text-[22px] font-extrabold leading-[1.2] text-text">
          Settings
        </h1>
        <p className="mt-2 text-sm text-text-muted leading-[1.6]">
          Mobile settings view is currently a placeholder. Please open on a tablet or desktop workstation for full settings access.
        </p>
        <div className="mt-6 flex items-center gap-2 rounded-full border border-border bg-surface-alt px-4 py-1.5 text-xs font-medium text-text-muted shadow-2xs">
          <Monitor size={14} className="text-primary" />
          <span>Optimized for Desktop View</span>
        </div>
      </div>
    </section>
  );
};

export default SettingsMobilePage;
