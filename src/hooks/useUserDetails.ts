// hooks/useUserDetails.ts
import { useEffect, useState } from "react";
import { userDetails } from "../action/userDetails"; // Adjust the import path

export const useUserDetails = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await userDetails();
        setUser(res);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError("Failed to fetch user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  return { user, loading, error };
};
