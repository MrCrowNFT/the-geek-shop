import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import Navbar from "@/components/common/navbar";
import { SignupForm } from "@/components/auth/signup-form";

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
