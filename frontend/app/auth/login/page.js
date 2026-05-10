// Starter file
import LoginForm from "@/components/auth/LoginForm";
import Protected from "../../../components/auth/Protected";

export default function LoginPage() {
  return (
    <Protected access="login">
      <main
        className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gray-100
      "
      >
        <LoginForm />
      </main>
    </Protected>
  );
}
