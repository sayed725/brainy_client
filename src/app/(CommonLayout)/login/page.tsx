// import LoginForm from "@/components/modules/auth/LoginForm";

import { LoginForm } from "@/components/modules/auth/login-form";

export default function Login() {
    return (
        <div className="h-[80vh]  flex w-full items-center justify-center p-6 md:p-10">
      {/* <LoginForm /> */}
       <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
    );
}