import "./App.css";
import { useState } from "react";
import TodosPage from "./features/Todos/TodosPage";
import Header from "./shared/Header";
import Logon from "./features/Logon";

function App() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  return (
    <div>
      <Header email={email} />
      {token ? (
        <TodosPage token={token} />
      ) : (
        <Logon onSetEmail={setEmail} onSetToken={setToken} />
      )}
    </div>
  );
}

export default App;
