import React from 'react'
import { useFormik } from "formik";
import * as yup from "yup";
import { Context } from '../context/Context';
import { useContext } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

function Signup() {
  // const navigate = useNavigate()
  const { setCurrentUser, onSignup } = useContext(Context)
  const navigate = useNavigate()
  
  const formSchema = yup.object().shape({
    username: yup
      .string()
      .required("Username is required")
      .matches(/^[a-zA-Z0-9_.]+$/, 'Username can only contain letters, numbers, underscores, and periods')
      .min(8, "Username must be at least 8 characters long")
      .max(15, "Username must be at most 30 characters long"),
    email: yup
      .string()
      .email('Email must be a valid email address')
      .required("Email is required")
      .matches(
        /^[\w-.]+@([\w-]+\.)+[\w-]{2,3}$/,
        'Email must be a valid email address with a valid domain'
      ),
    password: yup
      .string()
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: yup
    .string()
    .required('Confirm Password is required')
    .oneOf([yup.ref('password')], 'Passwords must match')
  })

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      fetch("/customers", {
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
          throw new Error ('Failed to create account');
        }
      })
      .then(newCustomer => {
        onSignup(newCustomer);
        setCurrentUser(newCustomer);
        loginAfterSignup(newCustomer, values.password);
      })
      .catch(error => {
        console.error('Error:', error)
      })
    }
  })

  function loginAfterSignup(customer, password) {
    fetch('/login', {
      method: "POST", 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: customer.username,
        password: password
      })
    })
    .then(res => {
      if (res.status === 201) {
        navigate('/');
        return res.json();
      } else {
        throw new Error ('Login Failed');
      }
    })
    .then(authenticatedUser => {
      setCurrentUser(authenticatedUser)
    })
  }
  
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
            Create An Account        
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
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
              </div>
              <p className="block text-sm font-medium text-red-600 mb-1">
                {formik.errors.email}
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
              <div className="flex items-center justify-between">
                <label htmlFor="confirmPassword" className="block text-sm/6 font-medium text-gray-900">
                  Confirm Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                  onChange={formik.handleChange}
                  value={formik.values.confirmPassword}
                />
              </div>
              <p className="block text-sm font-medium text-red-600 mb-1">
                {formik.errors.confirmPassword}
              </p>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Create Account
              </button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm text-gray-600">
            Already have an account? {''}
            <Link to="/login" className="text-blue-500 hover:text-blue-700">Log in</Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Signup