import Footer from "@/components/footer";
import Header from "@/components/header";
import Navbar from "@/components/navbar";
import { SignupForm } from "@/components/signup-form";
import { Layout } from "lucide-react";

const Signup = () => {
  return (
    <>
      <Header />
      <Navbar />
      <div className="flex w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <SignupForm />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Signup;
