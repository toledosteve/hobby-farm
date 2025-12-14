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
  address: string;
  city: string;
  state: string;
  zipCode: string;
  acreage: number;
  goals: string[];
}

export function OnboardingFlow() {
  const navigate = useNavigate();
  const { handleCreateProject } = useProjectOperations();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("create");
  const [projectData, setProjectData] = useState<ProjectData>({
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    acreage: 0,
    goals: [],
  });

  const handleCreateProjectStep = (data: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    acreage: string;
    goals: string[];
  }) => {
    setProjectData({
      name: data.name,
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
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
      address: projectData.address,
      city: projectData.city,
      state: projectData.state,
      zipCode: projectData.zipCode,
      acres: projectData.acreage,
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
          city={projectData.city}
          state={projectData.state}
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
          city={projectData.city}
          state={projectData.state}
          acreage={projectData.acreage}
          goals={projectData.goals}
          onOpenEditor={handleFinalComplete}
        />
      )}
    </>
  );
}