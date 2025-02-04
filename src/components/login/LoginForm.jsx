import { useFormik } from "formik";
import * as Yup from "yup";

import LoadingButton from "../global-component/LoadingButton";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

const LoginForm = () => {
  const { userLogin, loading, error } = useAuthStore();
  const [passwordVisible, setPasswordVisible] = useState(false);
  let  navigate  = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      const { email, password } = values;
      const result = await userLogin({ email, password });

      if (result === 'Login successful') {
        toast.success(result); 
        navigate('/')
      } else {  
        toast.error(result);  // Display error message
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="email"
          className="block"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
          className="px-4 mt-1 block py-2 w-full shadow-sm sm:text-sm bg-violet-600 rounded-md"
        />
        {formik.touched.email && formik.errors.email ? (
          <div className="text-red-700 text-sm">{formik.errors.email}</div>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={passwordVisible ? "text" : "password"}
            name="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            className="px-4 mt-1 block py-2 w-full shadow-sm sm:text-sm bg-violet-600 rounded-md"
          />
          <button
            type="button"
            onClick={() => setPasswordVisible(!passwordVisible)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-200"
          >
            {passwordVisible ? (
              <FaEyeSlash className="h-5 w-5" aria-hidden="true" />
            ) : (
              <FaEye className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
        {formik.touched.password && formik.errors.password ? (
          <div className="text-red-700 text-sm">{formik.errors.password}</div>
        ) : null}
      </div>

      <LoadingButton
        type="submit"
        isLoading={loading}
        className="bg-slate-200 text-slate-700 hover:bg-slate-200 w-full py-3 rounded-md text-base font-medium"
      >
        Login
      </LoadingButton>

     
    </form>
  );
};

export default LoginForm;
