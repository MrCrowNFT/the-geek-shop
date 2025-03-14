import Footer from "@/components/footer";
import Header from "@/components/header";
import { LoginForm } from "@/components/login-form";
import Navbar from "@/components/navbar";
import Layout from "@/components/layout";


const Login = () => {
  return (
    <>
    <Layout>
    <Header/>
    <Navbar/>
    <div className="flex w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
    <Footer/>
    </Layout>
    </>
  );
};

export default Login;
