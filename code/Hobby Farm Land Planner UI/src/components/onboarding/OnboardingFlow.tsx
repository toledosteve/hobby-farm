import { useState } from "react";
import { CreateProjectScreen } from "./CreateProjectScreen";
import { FindLandScreen } from "./FindLandScreen";
import { BoundaryCreationScreen } from "./BoundaryCreationScreen";
import { SoilInsightsScreen } from "./SoilInsightsScreen";
import { FarmGoalsScreen } from "./FarmGoalsScreen";
import { SetupCompleteScreen } from "./SetupCompleteScreen";

interface OnboardingFlowProps {
  onComplete: (projectData: {
    name: string;
    location: string;
    acreage: number;
    goals: string[];
  }) => void;
  onCancel: () => void;
  onLogout?: () => void;
}

type OnboardingStep =
  | "create"
  | "find-land"
  | "boundary"
  | "soil"
  | "goals"
  | "complete";

interface ProjectData {
  name: string;
  location: string;
  acreage: number;
  goals: string[];
}

export function OnboardingFlow({ onComplete, onCancel, onLogout }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("create");
  const [projectData, setProjectData] = useState<ProjectData>({
    name: "",
    location: "",
    acreage: 0,
    goals: [],
  });

  const handleCreateProject = (data: {
    name: string;
    location: string;
    acreage: string;
    goals: string[];
  }) => {
    setProjectData({
      name: data.name,
      location: data.location,
      acreage: parseFloat(data.acreage) || 0,
      goals: data.goals,
    });
    setCurrentStep("find-land");
  };

  const handleFindLandComplete = () => {
    setCurrentStep("boundary");
  };

  const handleBoundaryComplete = (acreage: number) => {
    setProjectData((prev) => ({ ...prev, acreage }));
    setCurrentStep("soil");
  };

  const handleSoilComplete = () => {
    setCurrentStep("goals");
  };

  const handleGoalsComplete = (goals: string[]) => {
    setProjectData((prev) => ({ ...prev, goals }));
    setCurrentStep("complete");
  };

  const handleSkipGoals = () => {
    setCurrentStep("complete");
  };

  const handleOpenEditor = () => {
    onComplete(projectData);
  };

  // Step navigation
  const goBack = () => {
    switch (currentStep) {
      case "find-land":
        setCurrentStep("create");
        break;
      case "boundary":
        setCurrentStep("find-land");
        break;
      case "soil":
        setCurrentStep("boundary");
        break;
      case "goals":
        setCurrentStep("soil");
        break;
      default:
        break;
    }
  };

  return (
    <>
      {currentStep === "create" && (
        <CreateProjectScreen
          onContinue={handleCreateProject}
          onCancel={onCancel}
          onLogout={onLogout}
        />
      )}

      {currentStep === "find-land" && (
        <FindLandScreen
          projectName={projectData.name}
          location={projectData.location}
          onContinue={handleFindLandComplete}
          onBack={goBack}
          onLogout={onLogout}
        />
      )}

      {currentStep === "boundary" && (
        <BoundaryCreationScreen
          projectName={projectData.name}
          onContinue={handleBoundaryComplete}
          onBack={goBack}
          onLogout={onLogout}
        />
      )}

      {currentStep === "soil" && (
        <SoilInsightsScreen
          projectName={projectData.name}
          acreage={projectData.acreage}
          onContinue={handleSoilComplete}
          onBack={goBack}
          onLogout={onLogout}
        />
      )}

      {currentStep === "goals" && (
        <FarmGoalsScreen
          projectName={projectData.name}
          initialGoals={projectData.goals}
          onContinue={handleGoalsComplete}
          onBack={goBack}
          onSkip={handleSkipGoals}
          onLogout={onLogout}
        />
      )}

      {currentStep === "complete" && (
        <SetupCompleteScreen
          projectName={projectData.name}
          location={projectData.location}
          acreage={projectData.acreage}
          goals={projectData.goals}
          onOpenEditor={handleOpenEditor}
          onLogout={onLogout}
        />
      )}
    </>
  );
}