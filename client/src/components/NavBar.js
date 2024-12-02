import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ShoppingCartIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import logo from '../assets/logo.jpg'

function NavBar({ handleOpenCart, handleOpenAccount }) {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile menu state

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ');
    }

    const navigation = [
        { name: 'Home', href: '/dashboard' },
        // Conditionally include "Account"
        ...(location.pathname !== '/orders'
            ? [{ name: 'Account', onClick: handleOpenAccount }]
            : []),
        { name: 'Orders', href: '/orders' },
    ];

    return (
        <nav className="bg-black">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-32 items-center justify-between">
                    {/* Brand Logo */}
                    <div className="flex items-center">
                        <NavLink to="/dashboard">
                            <img
                                alt="Your Company"
                                src={logo}
                                className="h-28 w-auto cursor-pointer"
                            />
                        </NavLink>
                        <h1 className="text-4xl font-bold text-white ml-6 font-serif">
                            Pineapple Express Checkout
                        </h1>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden sm:block">
                        <div className="flex space-x-4">
                            {navigation.map((item) =>
                                item.onClick ? (
                                    <button
                                        key={item.name}
                                        onClick={item.onClick}
                                        className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                                    >
                                        {item.name}
                                    </button>
                                ) : (
                                    <NavLink
                                        key={item.name}
                                        to={item.href}
                                        className={({ isActive }) =>
                                            classNames(
                                                isActive
                                                    ? 'bg-gray-900 text-white'
                                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                'rounded-md px-3 py-2 text-sm font-medium'
                                            )
                                        }
                                    >
                                        {item.name}
                                    </NavLink>
                                )
                            )}

                            {/* Conditionally render the Cart button */}
                            {location.pathname === '/dashboard' && (
                                <button
                                    onClick={handleOpenCart}
                                    className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2"
                                >
                                    <ShoppingCartIcon className="h-6 w-6 text-gray-300 hover:text-white" />
                                    <span className="sr-only">Cart</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="sm:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? (
                                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="sm:hidden">
                    <div className="space-y-1 px-2 pb-3 pt-2">
                        {navigation.map((item) =>
                            item.onClick ? (
                                <button
                                    key={item.name}
                                    onClick={item.onClick}
                                    className="text-gray-300 hover:bg-gray-700 hover:text-white block w-full text-left rounded-md px-3 py-2 text-base font-medium"
                                >
                                    {item.name}
                                </button>
                            ) : (
                                <NavLink
                                    key={item.name}
                                    to={item.href}
                                    className={({ isActive }) =>
                                        classNames(
                                            isActive
                                                ? 'bg-gray-900 text-white'
                                                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                            'block rounded-md px-3 py-2 text-base font-medium'
                                        )
                                    }
                                >
                                    {item.name}
                                </NavLink>
                            )
                        )}

                        {/* Conditionally render the Cart button in mobile view */}
                        {location.pathname === '/dashboard' && (
                            <button
                                onClick={handleOpenCart}
                                className="text-gray-300 hover:bg-gray-700 hover:text-white block w-full text-left rounded-md px-3 py-2"
                            >
                                <ShoppingCartIcon className="h-6 w-6 text-gray-300 hover:text-white inline" />
                                <span className="sr-only">Cart</span>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

export default NavBar;