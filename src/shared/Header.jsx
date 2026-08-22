export default function Header({ email }) {
  return (
    <>
      <h1>Todo List</h1>
      {email && <p>Welcome {email}</p>}
    </>
  );
}
