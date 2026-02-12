import { RegisterForm } from "@/components/modules/auth/register-form";

export default function Register() {
    return (
          <div className=" h-[80vh] flex w-full items-center justify-center p-6 md:p-10">
              {/* <LoginForm /> */}
               <div className="w-full max-w-sm">
                < RegisterForm/>
              </div>
            </div>
    );
}