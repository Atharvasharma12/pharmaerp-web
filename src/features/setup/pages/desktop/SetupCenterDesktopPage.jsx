// src/features/setup/pages/desktop/SetupCenterDesktopPage.jsx

import React from "react";
import { motion } from "framer-motion";
import { 
  SetupFlowHeader, 
  SetupFlowCanvas, 
  SetupStepInspector 
} from "../../components";

const SetupCenterDesktopPage = ({
  mappedSetupSteps = [],
  selectedStep = null,
  onSelectStep = () => {},
  completedStepsCount = 0,
  progress = 0,
  nextStep = null,
  canGoLive = false,
  isLiveMode = true,
  onToggleLiveMode = () => {},
  onRunDiagnostics = () => {},
  isRunningDiagnostics = false,
  onTestStep = () => {},
  isTestingStep = false,
  onGoLive = () => {},
}) => {
  return (
    <motion.section 
      initial={{ opacity: 0, transform: "translateY(8px)" }}
      animate={{ opacity: 1, transform: "translateY(0px)" }}
      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
      className="min-h-[calc(100dvh-60px)] flex flex-col bg-bg text-text"
    >
      {/* 1. Top Workflow Control Bar */}
      <SetupFlowHeader
        title="Setup Flow — Business Onboarding"
        subtitle="Configure core business entities to activate full ERP operations."
        completedCount={completedStepsCount}
        totalCount={mappedSetupSteps.length}
        progress={progress}
        isLiveMode={isLiveMode}
        onToggleLiveMode={onToggleLiveMode}
        onRunDiagnostics={onRunDiagnostics}
        isRunningDiagnostics={isRunningDiagnostics}
        onGoLive={onGoLive}
        canGoLive={canGoLive}
        nextStep={nextStep}
      />

      {/* 2. Main Dual-Pane Workspace (Canvas on Left, Inspector on Right) */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        {/* Central Stepped Workflow Canvas */}
        <SetupFlowCanvas
          steps={mappedSetupSteps}
          selectedStep={selectedStep}
          onSelectStep={onSelectStep}
          completedStepsCount={completedStepsCount}
          progress={progress}
          canGoLive={canGoLive}
          onGoLive={onGoLive}
        />

        {/* Right-Hand Node Inspector Sidebar */}
        <SetupStepInspector
          step={selectedStep}
          allSteps={mappedSetupSteps}
          onTestStep={onTestStep}
          isTesting={isTestingStep}
        />
      </div>
    </motion.section>
  );
};

export default SetupCenterDesktopPage;
