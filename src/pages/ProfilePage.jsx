import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function ProfilePage() {
  const { email, token } = useAuth();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [todoStats, setTodoStats] = useState({});

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams({ limit: 100 });
        const response = await fetch(`/api/tasks?${params}`, {
          headers: { "X-CSRF-TOKEN": token },
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }
        const data = await response.json();
        const todos = data.tasks;

        // calculate todo stats
        const total = todos.length;
        const completed = todos.filter((todo) => todo.isCompleted).length;
        const active = total - completed;

        setTodoStats({ total, completed, active });
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (token) {
      fetchProfileData();
    }
  }, [token]);

  return (
    <div>
      <h2>Profile</h2>
      {error && <p>{error.message}</p>}
      {isLoading && <p>Loading profile...</p>}
      <p>Welcome {email}</p>
      {!isLoading && !error && (
        <>
          <p>Total todos: {todoStats.total}</p>
          <p>Completed todos: {todoStats.completed}</p>
          <p>Active todos: {todoStats.active}</p>
        </>
      )}
    </div>
  );
}

export default ProfilePage;
