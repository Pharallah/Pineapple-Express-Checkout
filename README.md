# Welcome to ParaDine Express

**ParaDine Express** is an intuitive platform tailor-made for **Parilya**, a Filipino restaurant and food truck business based in Cleveland, Ohio. 

Designed to streamline online order management for catering and take-out services, this application is built to deliver a seamless and enhanced customer experience. Whether you're a new visitor exploring the menu or a loyal customer placing your next order, **ParaDine Express** ensures a smooth and hassle-free journey every step of the way.

---

## Features

### User Authentication
- **Sign-Up**: Create an account to unlock all features of ParaDine Express. During sign-up, users are guided with detailed form validations for a secure and seamless registration process.
- **Login**: Secure authentication to access your personalized account and order history.
- **Session Management**: Stay logged in across sessions or log out anytime for enhanced security.

### User Account Management
- **Edit Profile**: Update your first name, last name, phone number, and email directly from your account panel.
- **Logout**: Log out securely with a single click.

### Order Placement
- **Dynamic Order Creation**: Place orders for either **Take-Out** or **Catering** services.
- **Custom Scheduling**: Choose your desired pickup date and time:
  - **Take-Out Orders**: Schedule at least 20 minutes in advance, up to the end of the day.
  - **Catering Orders**: Plan orders at least 24 hours in advance, up to 7 days ahead.
- **Flexible Item Management**: Add items to your cart dynamically, with instant quantity updates for existing items.

### Order History
- **Detailed Past Orders**: View all your previous orders with clear details about the order type, date, time, and total price.
- **Expand for Details**: Expand individual orders to see item-specific details, including quantity and total item cost.

### Dynamic Navigation
- **Responsive NavBar**:
  - Quick access to account management, order history, and cart.
  - Mobile-friendly navigation for smaller screens.

### Error Handling & Validation
- **Form Validation**: Ensures fields like email, phone number, and passwords adhere to expected formats and security standards.
- **Friendly Feedback**: Real-time feedback on errors ensures a smooth user experience.

---

## Technologies Used

### Frontend
- **React**: A dynamic JavaScript framework for building interactive user interfaces.
- **Formik & Yup**: For managing forms and implementing robust validations.
- **TailwindCSS**: A utility-first CSS framework for rapid UI development.
- **useContext**: For state and context management to share data across components seamlessly.

### Backend
- **Flask**: A lightweight Python web framework for managing server-side operations.
- **Flask-RESTful**: To build RESTful APIs for seamless client-server communication.
- **Flask-Login**: For user authentication and session management.
- **Flask-CORS**: To handle cross-origin requests efficiently.
- **Flask-Migrate**: For database migrations to manage schema updates smoothly.
- **Bcrypt**: For secure password hashing.

### Other Libraries & Tools
- **SQLAlchemy**: ORM for managing database interactions securely and efficiently.
- **React Router**: For seamless navigation and routing.
- **Heroicons**: For a clean and modern UI.

---

## Application Flow

1. **Sign-Up or Login**:
   - New users can sign up to create an account, while returning users log in to access their dashboard.

2. **Dashboard**:
   - Switch between "Take-Out" and "Catering" order types.
   - Add items to your cart and schedule your preferred pickup time and date.

3. **Order Management**:
   - Orders are dynamically tracked and updated.
   - Existing orders are displayed under "Order History" for future reference.

4. **Account Management**:
   - Edit account information anytime.
   - Log out securely when you're done.

---

## Future Features

We are continually working on improving **ParaDine Express**. Upcoming features include:

### Enhanced User Management
- **Conversion to User Model**: Transition the Customer model to a more versatile User model, introducing an **Admin user type**. Admin users will access a specialized dashboard for:
  - Menu Editing
  - Order Fulfillment
  - Customer and Sales Analytics
  - Advanced Management Tools

- **Last Login Tracking**: Add a `last_login` attribute for users, enabling analytics and the management of inactive accounts.

### Improved Customer Experience
- **Change Password**: Introduce a secure feature for users to update their account passwords.

- **Item Favoriting**: Enable users to favorite/like items for quick reordering and personalized recommendations.

- **Lifetime Order Metrics**: Track **lifetime order count** and **total lifetime order value** for each user, providing insights for analytics and loyalty programs.

---

Experience a seamless ordering process with **ParaDine Express**. Simplify your dining journey today! 🌟