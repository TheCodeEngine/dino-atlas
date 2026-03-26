import { useNavigate } from "react-router";
import { SleepyDinosScreen } from "@dino-atlas/ui";

export function SleepyDinosPage() {
  const navigate = useNavigate();

  return (
    <SleepyDinosScreen
      onBack={() => navigate("/")}
      onParentReset={() => navigate("/parent/reset")}
    />
  );
}
