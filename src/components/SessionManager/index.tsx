// src/components/SessionManager.tsx
import { useAutoLogout } from "../../hooks/userAutoLogout";

export function SessionManager() {
  useAutoLogout(); // 30 min por padrão
  return null; // não renderiza nada
}
