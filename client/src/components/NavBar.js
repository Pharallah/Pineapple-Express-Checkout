import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Context } from '../context/Context';

function NavBar() {
    const { currentUser, setCurrentUser } = useContext(Context);
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile menu state

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ');
    }

    const handleLogout = (e) => {
        e.preventDefault();
        console.log("Logout Initiated");

        fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => {
                if (res.ok) {
                    console.log(`Logout Response: ${res.status}`);
                    setCurrentUser(false); // Clear user context
                    navigate('/login');   // Redirect to login page
                } else {
                    return res.json().then((err) => {
                        console.error('Logout Failed:', err.message || 'Unknown error');
                    });
                }
            })
            .catch((error) => {
                console.error('Error during logout:', error);
            });
    };

    const navigation = [
        { name: 'Home', href: '/dashboard' },
        { name: 'Orders', href: '/orders' },
        { name: 'Cart', href: '/cart' },
        {
            name: `Logout`,
            onClick: handleLogout,
        },
    ];

    return (
        <nav className="bg-black">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-32 items-center justify-between">
                    {/* Brand Logo */}
                    <div className="flex items-center">
                        <img
                            alt="Your Company"
                            src=""
                            className="h-10 w-auto"
                        />
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
                    </div>
                </div>
            )}
        </nav>
    );
}

export default NavBar;