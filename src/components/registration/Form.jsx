/* eslint-disable react/jsx-no-undef */
import { useFormik } from "formik";
import * as Yup from "yup";

import LoadingButton from "../global-component/LoadingButton";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuthStore } from "../../stores/authStore";

const Form = () => {
  const { userRegistration, loading, error } = useAuthStore();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      phone: Yup.string().required("Phone is required"),
      password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters long")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[0-9]/, "Password must contain at least one number")
        .matches(
          /[@$!%*?&#]/,
          "Password must contain at least one special character"
        ),
      confirmPassword: Yup.string()
        .required("Confirm password is required")
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
    }),
    onSubmit: async (values, { resetForm }) => {
      const { name, email, phone, password, confirmPassword } = values;

      try {
        const result = await userRegistration({
          name,
          email,
          phone,
          password,
          confirmPassword,
        });

        if (result) {
          toast.success(result); // Display success message
          resetForm();
          // Reset the form on successful registration
        }
      } catch (error) {
        toast.error("Registration failed. Please try again."); // Display error message
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block">
          Name
        </label>
        <input
          id="name"
          type="text"
          name="name"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
          placeholder="Enter your name..."
          className="px-4 mt-1 block py-2 w-full shadow-sm sm:text-sm bg-violet-600 rounded-md"
        />
        {formik.touched.name && formik.errors.name ? (
          <div className="text-red-900 text-sm">{formik.errors.name}</div>
        ) : null}
      </div>

      <div>
        <label htmlFor="email" className="block">
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
          placeholder="Enter your email..."
          className="px-4 mt-1 block py-2 w-full shadow-sm sm:text-sm bg-violet-600 rounded-md"
        />
        {formik.touched.email && formik.errors.email ? (
          <div className="text-red-900 text-sm">{formik.errors.email}</div>
        ) : null}
      </div>

      <div>
        <label htmlFor="phone" className="block">
          Phone
        </label>
        <input
          id="phone"
          type="text"
          name="phone"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.phone}
          placeholder="Enter your phone..."
          className="px-4 mt-1 block py-2 w-full shadow-sm sm:text-sm bg-violet-600 rounded-md"
        />
        {formik.touched.phone && formik.errors.phone ? (
          <div className="text-red-900 text-sm">{formik.errors.phone}</div>
        ) : null}
      </div>

      <div>
        <label htmlFor="password" className="block">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type="password"
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
          <div className="text-red-900 text-sm">{formik.errors.password}</div>
        ) : null}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block">
          Confirm Password
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
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

        {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
          <div className="text-red-900 text-sm">
            {formik.errors.confirmPassword}
          </div>
        ) : null}
      </div>

      <LoadingButton
        type="submit"
        loading={loading}
        className="bg-slate-200 text-slate-700 hover:bg-slate-200 w-full py-2"
      >
        Submit
      </LoadingButton>

      {error && (
        <div className="text-red-900 text-sm font-semibold mt-2">{error}</div>
      )}
    </form>
  );
};

export default Form;
