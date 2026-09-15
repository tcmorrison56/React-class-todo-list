import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import styles from "./ProfilePage.module.css";

function ProfilePage() {
  const { email, token, isAuthenticated } = useAuth();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [todoStats, setTodoStats] = useState({});

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        setError("");

        const options = {
          method: "GET",
          headers: { "X-CSRF-TOKEN": token },
          credentials: "include",
        };
        const params = new URLSearchParams({ limit: 100 });
        const response = await fetch(`/api/tasks?${params}`, options);

        if (response.status === 401) {
          throw new Error("Unauthorized");
        }
        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }
        const data = await response.json();
        const todos = data.tasks;

        // calculate todo stats
        const total = todos.length;
        const completed = todos.filter((todo) => todo.isCompleted).length;
        const active = total - completed;
        const completePercent =
          total > 0 ? Math.round((completed / total) * 100) : null;

        setTodoStats({ total, completed, active, completePercent });
      } catch (error) {
        console.error("Profile fetch error:", error);
        setError("Unable to load your profile statistics. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    if (token) {
      fetchProfileData();
    }
  }, [token]);

  return (
    <div className={styles.page}>
      <div className={styles.accountCard}>
        <h2 className={styles.accountName}>Welcome, {email}</h2>
        <p className={styles.accountStatus}>
          Status: {isAuthenticated ? "Authenticated" : "Unauthorized"}
        </p>
      </div>

      {error && <p>{error}</p>}
      {isLoading && <p>Loading profile...</p>}

      {!isLoading && !error && (
        <div className={styles.statsSection}>
          <h3 className={styles.statsHeading}>Your Todos</h3>
          <div className={styles.statsGrid}>
            <div className={styles.statTile}>
              <span className={styles.statValue}>{todoStats.total}</span>
              <span className={styles.statLabel}>Total</span>
            </div>
            <div className={styles.statTile}>
              <span className={styles.statValue}>{todoStats.completed}</span>
              <span className={styles.statLabel}>Completed</span>
            </div>
            <div className={styles.statTile}>
              <span className={styles.statValue}>{todoStats.active}</span>
              <span className={styles.statLabel}>Active</span>
            </div>
            {todoStats.total > 0 && (
              <div className={styles.statTile}>
                <span className={styles.statValue}>
                  {todoStats.completePercent}%
                </span>
                <span className={styles.statLabel}>Complete</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
