import { useState } from "react";
import { CreateProjectScreen } from "./CreateProjectScreen";
import { FindLandScreen } from "./FindLandScreen";
import { BoundaryCreationScreen } from "./BoundaryCreationScreen";
import { SoilInsightsScreen } from "./SoilInsightsScreen";
import { FarmGoalsScreen } from "./FarmGoalsScreen";
import { SetupCompleteScreen } from "./SetupCompleteScreen";
import { useNavigate } from "react-router-dom";
import { useProjectOperations } from "@/hooks/useProjectOperations";
import { ROUTES } from "@/routes/routes";

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

export function OnboardingFlow() {
  const navigate = useNavigate();
  const { handleCreateProject } = useProjectOperations();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("create");
  const [projectData, setProjectData] = useState<ProjectData>({
    name: "",
    location: "",
    acreage: 0,
    goals: [],
  });

  const handleCreateProjectStep = (data: {
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

  const handleFinalComplete = async () => {
    // Create the project using the accumulated data
    await handleCreateProject({
      name: projectData.name,
      location: projectData.location,
      acreage: projectData.acreage.toString(),
      goals: projectData.goals,
    });
    // Navigation happens in useProjectOperations hook
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

  const handleCancel = () => {
    navigate(ROUTES.PROJECTS);
  };

  return (
    <>
      {currentStep === "create" && (
        <CreateProjectScreen
          onContinue={handleCreateProjectStep}
          onCancel={handleCancel}
        />
      )}

      {currentStep === "find-land" && (
        <FindLandScreen
          projectName={projectData.name}
          location={projectData.location}
          onContinue={handleFindLandComplete}
          onBack={goBack}
        />
      )}

      {currentStep === "boundary" && (
        <BoundaryCreationScreen
          projectName={projectData.name}
          onContinue={handleBoundaryComplete}
          onBack={goBack}
        />
      )}

      {currentStep === "soil" && (
        <SoilInsightsScreen
          projectName={projectData.name}
          acreage={projectData.acreage}
          onContinue={handleSoilComplete}
          onBack={goBack}
        />
      )}

      {currentStep === "goals" && (
        <FarmGoalsScreen
          projectName={projectData.name}
          initialGoals={projectData.goals}
          onContinue={handleGoalsComplete}
          onBack={goBack}
          onSkip={handleSkipGoals}
        />
      )}

      {currentStep === "complete" && (
        <SetupCompleteScreen
          projectName={projectData.name}
          location={projectData.location}
          acreage={projectData.acreage}
          goals={projectData.goals}
          onOpenEditor={handleFinalComplete}
        />
      )}
    </>
  );
}