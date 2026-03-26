import { useNavigate } from "react-router";
import { LoginScreen } from "@dino-atlas/ui";
import { useAuthStore } from "@/stores/auth-store";
import { post } from "@/lib/api";

export function LoginPage() {
  const navigate = useNavigate();
  const fetchMe = useAuthStore((s) => s.fetchMe);

  const handleLogin = async (email: string, password: string) => {
    await post("/auth/login", { email, password });
    await fetchMe();
    navigate("/players");
  };

  const handleRegister = async (data: {
    email: string;
    password: string;
    familyName: string;
    kids: { name: string; birthYear: string; avatar: string }[];
  }) => {
    await post("/auth/register", {
      email: data.email,
      password: data.password,
      family_name: data.familyName,
      players: data.kids.map((k) => ({
        name: k.name,
        emoji: k.avatar,
        birth_year: parseInt(k.birthYear) || 2020,
      })),
    });
    await fetchMe();
    navigate("/players");
  };

  return (
    <LoginScreen
      onLogin={handleLogin}
      onRegister={handleRegister}
    />
  );
}
