import React, { forwardRef } from 'react';

const CustomLogoutButton = forwardRef(function CustomLogoutButton(props, ref) {
    const { setCurrentUser, navigate } = props; // Accept necessary props
    console.log(navigate)

    const handleLogout = (e) => {
        console.log('handleLogout activated!')
        e.preventDefault();
        e.stopPropagation();
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

    return (
        <button
            ref={ref}
            onClick={handleLogout}
            {...props}
            className={`text-gray-300 hover:bg-gray-700 hover:text-white block w-full text-left rounded-md px-3 py-2 text-base font-medium ${props.className}`}
        >
            {props.children}
        </button>
    );
});

export default CustomLogoutButton;