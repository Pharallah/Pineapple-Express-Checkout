import React from 'react'
import { useFormik } from "formik";
import * as yup from "yup";
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { Context } from '../context/Context';
import { useNavigate } from 'react-router-dom';

function Login() {
  const { setCurrentUser, recalculateCurrentOrder } = useContext(Context)
  const navigate = useNavigate()


  const formSchema = yup.object().shape({
    username: yup
      .string()
      .required("Username is required")
      .min(8, "Username must be at least 8 characters long")
      .max(15, "Username must be at most 30 characters long"),
    password: yup
      .string()
      .required('Password is required')
  })

  const formik = useFormik({
    initialValues: {
      username: "",
      password: ""
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          values,
          null,
          2
        ),
      })
      .then(res => {
        if (res.status === 201) {
          return res.json();
        } else {
          throw new Error ('Login Failed');
        }
      })
      .then(authenticatedUser => {
        setCurrentUser(authenticatedUser);
        recalculateCurrentOrder(authenticatedUser);
        navigate('/');
      })
    }
  })

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Login      
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div>
              <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="username"
                  required
                  autoComplete="username"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                  onChange={formik.handleChange}
                  value={formik.values.username}
                />
              </div>
              <p className="block text-sm font-medium text-red-600 mb-1">
                {formik.errors.username}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                />
              </div>
              <p className="block text-sm font-medium text-red-600 mb-1">
                {formik.errors.password}
              </p>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Log In
              </button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm text-gray-600">
            Don't have an account? {''}
            <Link to="/signup" className="text-blue-500 hover:text-blue-700">Sign Up</Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login