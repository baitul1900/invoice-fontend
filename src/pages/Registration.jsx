import Form from "../components/registration/Form";
import loginImage from "/public/login-page-image.jpg";

const Registration = () => {
  return (
    <section className="bg-gray-100 h-screen flex items-center ">
        <div className="container mx-auto px-48 py-10">
      <div className="min-w-full grid grid-cols-1 sm:grid-cols-2 bg-violet-500 rounded-lg">
        <div className="w-full p-10">
        <h3 className="text-4xl font-bold mb-6 text-white">Contact us</h3>
          <Form />
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

export default Registration;
