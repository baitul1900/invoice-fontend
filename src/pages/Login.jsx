import { Link } from "react-router-dom";
import LoginForm from "../components/login/LoginForm";
import loginImage from "/login-page-image.jpg";

const Login = () => {
    return (
        
            <section className="bg-gray-100 h-screen flex items-center ">
        <div className="container mx-auto px-48 py-10">
      <div className="min-w-full grid grid-cols-1 sm:grid-cols-2 bg-violet-500 rounded-lg">
        <div className="w-full p-10 my-5">
        <h3 className="text-4xl font-bold mb-1 text-white">Login</h3>
          <p className="text-sm mb-2">Don't have an account? <Link to={"/registration"} className="text-purple-200">Register</Link></p>
          <LoginForm/>
        </div>

        <div className="w-full flex ">
          <img
            src={loginImage}
            className="w-full object-cover rounded-r-lg"
            alt="Login Page Image"
          />
        </div>
      </div>
    </div>
    </section>
      
    );
};

export default Login;