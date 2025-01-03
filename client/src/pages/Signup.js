import React from 'react'
import { useFormik } from "formik";
import * as yup from "yup";
import { Context } from '../context/Context';
import { useContext } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg'

function Signup() {
  const navigate = useNavigate();
  const { setCurrentUser, onSignup, recalculateCurrentOrder, updatePastHistory } = useContext(Context);
  
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
  });

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
        loginAfterSignup(newCustomer, values.password);
      })
      .catch(error => {
        console.error('Error:', error)
      });
    }
  });

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
          return res.json();
        } else {
          throw new Error ('Login Failed');
        }
      })
      .then(authenticatedUser => {
        setCurrentUser(authenticatedUser);
        if (authenticatedUser) {
          recalculateCurrentOrder(authenticatedUser); // Works because recalculateCurrentOrder is getting its source from the server
          updatePastHistory(authenticatedUser);
          navigate('/');
        };   
      }
    );
  };
  
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
            Create An Account
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
                {formik.touched.username && formik.errors.username}
              </p>
            </div>

            <div>
              <label htmlFor="email" className="block text-lg font-medium">
                Email Address
              </label>
              <div className="mt-3">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-2 px-3 text-lg bg-gray-800 text-white shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
              </div>
              <p className="block text-lg text-red-500 mt-2">
                {formik.touched.email && formik.errors.email}
              </p>
            </div>

            <div>
              <label htmlFor="password" className="block text-lg font-medium">
                Password
              </label>
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
                {formik.touched.password && formik.errors.password}
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-lg font-medium">
                Confirm Password
              </label>
              <div className="mt-3">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="block w-full rounded-md border-0 py-2 px-3 text-lg bg-gray-800 text-white shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  onChange={formik.handleChange}
                  value={formik.values.confirmPassword}
                />
              </div>
              <p className="block text-lg text-red-500 mt-2">
                {formik.touched.confirmPassword && formik.errors.confirmPassword}
              </p>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-green-700 px-4 py-2 text-lg font-semibold text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-800"
              >
                Create Account
              </button>
            </div>
          </form>
          <div className="mt-6 text-center text-lg">
            Already have an account? {''}
            <Link to="/login" className="text-blue-400 hover:text-blue-500">Log In</Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Signup;