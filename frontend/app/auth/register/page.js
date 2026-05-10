// Starter file
import RegisterForm from "@/components/auth/RegisterForm";
import Protected from "../../../components/auth/Protected";

export default function RegisterPage() {
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
        <RegisterForm />
      </main>
    </Protected>
  );
}
