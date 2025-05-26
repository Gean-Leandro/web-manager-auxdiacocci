import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../../firebaseConfig";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { JSX } from "react";

type PrivateRouteProps = {
  children: JSX.Element;
  requireAdmin?: boolean; // se true, exige nível admin
};

export function PrivateRoute({ children, requireAdmin = false }: PrivateRouteProps) {
  const [user, loading] = useAuthState(auth);
  const [authorized, setAuthorized] = useState<boolean | null>(null); // null = carregando

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setAuthorized(false);
        return;
      }

      if (!requireAdmin) {
        setAuthorized(true);
        return;
      }

      const docRef = doc(db, "accounts", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setAuthorized(data.level === "admin");
      } else {
        setAuthorized(false);
      }
    };

    if (!loading) {
      checkAdmin();
    }
  }, [user, loading, requireAdmin]);

  if (loading || authorized === null) return <p>Carregando...</p>;

  return user && authorized ? children : <Navigate to="*" replace />;
}