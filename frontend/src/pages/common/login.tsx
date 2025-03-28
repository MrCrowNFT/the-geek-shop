import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import { LoginForm } from "@/components/auth/login-form";
import Navbar from "@/components/common/navbar";
import Layout from "@/components/common/layout";

const Login = () => {
  return (
    <>
      <Layout>
        <Header />
        <Navbar />
        <div className="flex w-full items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>
        <Footer />
      </Layout>
    </>
  );
};

export default Login;
