// src/components/Profile.tsx
import { useEffect, useState } from "react";
import { useApi } from "../lib/api";

export default function Profile() {
  const api = useApi();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api
      .get("/api/auth/me")
      .then((res) => setProfile(res.data))
      .catch((err) => console.error("Profile fetch error:", err));
  }, [api]);

  return (
    <div>
      <h2>My Profile</h2>
      <pre>{JSON.stringify(profile, null, 2)}</pre>
    </div>
  );
}
