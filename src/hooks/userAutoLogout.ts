
import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";

export function useAutoLogout(timeoutMs = 30 * 60 * 1000) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      signOut(auth);
    }, timeoutMs);

    return () => clearTimeout(timeout);
  }, [timeoutMs]);
}
