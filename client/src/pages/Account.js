import React from 'react';
import NavBar from '../components/NavBar';
import * as yup from 'yup';
import { useNavigate } from 'react-router';
import { useFormik } from 'formik';
import { useContext } from 'react';
import { Context } from '../context/Context';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

function Account({ openAccount, setOpenAccount}) {
    const navigate = useNavigate()
    const { currentUser, setCurrentUser, setCurrentOrder, customers, setCustomers, updateCurrentUser } = useContext(Context);

    const handleLogout = (e) => {
        e.preventDefault();
        fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => {
                if (res.ok) {
                    return res.json()
                } else {
                    throw new Error("Logout Failed")
                }
            })
            .then(() => {
                navigate('/login');   // Redirect to login page
                setCurrentUser(false); // Clear user context
                setCurrentOrder([]) // Clear order context
            })
            .catch((error) => {
                console.error('Error during logout:', error);
            });
    };

    
    const createdDate = new Date(currentUser.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

    const phoneRegExp = /^(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}$/;
    const accountSchema = yup.object().shape({
        firstName: yup
        .string()
        .min(1, "Name must be at least 1 character long")
        .max(20, "Maximum characters exceeded"),
        lastName: yup
        .string()
        .min(1, "Name must be at least 1 character long")
        .max(20, "Maximum characters exceeded"),
        phoneNumber: yup
        .string()
        .matches(phoneRegExp, 'Phone number is not valid'),
        email: yup
        .string()
        .email("Invalid email format"),
    })

    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            phoneNumber: "",
            email: ""
        },
        validationSchema: accountSchema,
        onSubmit: (values, { resetForm }) => {
            if (currentUser) {
                // Remove empty fields from submission to server
                const filteredValues = Object.fromEntries(
                    Object.entries(values).filter(([_, v]) => v.trim() !== "")
                );

                fetch(`/customers/${currentUser.id}`, {
                    method: "PATCH",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(filteredValues)
                })
                    .then(res => res.json())
                    .then(updatedUser => {
                        console.log("UPDATED USER", updatedUser)
                        const updatedCustomers = customers.map((customer) => {
                            if (customer.id === updatedUser.id){
                                return updatedUser;
                            } else {
                                return customer;
                            }
                        });
                        setCustomers(updatedCustomers);
                        updateCurrentUser();
                        resetForm();
                    })
            }
            
        }
    })

  return (
    <Dialog open={openAccount} onClose={setOpenAccount} className="relative z-10">
    <DialogBackdrop
      transition
      className="fixed inset-0 bg-gray-500/75 transition-opacity duration-700 ease-in-out data-[closed]:opacity-0"
    />

    <div className="fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
          <DialogPanel
            transition
            className="pointer-events-auto w-screen max-w-md transform transition duration-700 ease-in-out data-[closed]:-translate-x-full"
          >
            <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
              <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                <div className="flex items-start justify-between">
                  <DialogTitle className="text-lg font-medium text-gray-900">Edit Account</DialogTitle>
                  <div className="ml-3 flex h-7 items-center">
                    <button
                      type="button"
                      onClick={() => setOpenAccount(false)}
                      className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Close panel</span>
                      <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                <div className="mt-6">
                  <form onSubmit={formik.handleSubmit} className="space-y-6">
                    {/* First Name */}
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        First Name
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder={currentUser.first_name || ''}
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                      {formik.errors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{formik.errors.firstName}</p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder={currentUser.last_name || ''}
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                      {formik.errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{formik.errors.lastName}</p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="text"
                        placeholder={currentUser.phone_number || ''}
                        value={formik.values.phoneNumber}
                        onChange={formik.handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                      {formik.errors.phoneNumber && (
                        <p className="mt-1 text-sm text-red-600">{formik.errors.phoneNumber}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder={currentUser.email || ''}
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                      {formik.errors.email && (
                        <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
                      )}
                    </div>

                    <div className="mt-6 flex items-center justify-end">
                      <button
                        type="button"
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onClick={() => setOpenAccount(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Logout Button */}
              <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Logout
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </div>
  </Dialog>
    
    
  )
}

export default Account