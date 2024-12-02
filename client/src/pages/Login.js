import React from 'react'
import { useFormik } from "formik";
import * as yup from "yup";
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { Context } from '../context/Context';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.jpg'

function Login() {
  const { setCurrentUser, recalculateCurrentOrder, updatePastHistory } = useContext(Context)
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
        if (authenticatedUser) {
          recalculateCurrentOrder(authenticatedUser);
          updatePastHistory(authenticatedUser);
          navigate('/');
        };
      })
    }
  })

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-black text-white">
        <div className="lg:mx-auto sm:w-full sm:max-w-md">
          <img
            alt="Your Company"
            src={logo}
            className="mx-auto h-60 w-auto"
          />
          <h2 className="text-center text-3xl font-bold tracking-tight">
            Login      
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <form onSubmit={formik.handleSubmit} className="space-y-8">
            <div>
              <label htmlFor="username" className="block text-lg font-medium">
                Username
              </label>
              <div className="mt-3">
                <input
                  id="username"
                  name="username"
                  type="username"
                  required
                  autoComplete="username"
                  className="block w-full rounded-md border-0 py-2 px-3 text-lg bg-gray-800 text-white shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  onChange={formik.handleChange}
                  value={formik.values.username}
                />
              </div>
              <p className="block text-lg text-red-500 mt-2">
                {formik.errors.username}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-lg font-medium">
                  Password
                </label>
              </div>
              <div className="mt-3">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 py-2 px-3 text-lg bg-gray-800 text-white shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                />
              </div>
              <p className="block text-lg text-red-500 mt-2">
                {formik.errors.password}
              </p>
            </div>

            <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-green-700 px-4 py-2 text-lg font-semibold text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-800"
            >
              Log In
            </button>
            </div>
          </form>
          <div className="mt-6 text-center text-lg">
            Don't have an account? {''}
            <Link to="/signup" className="text-blue-400 hover:text-blue-500">Sign Up</Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login