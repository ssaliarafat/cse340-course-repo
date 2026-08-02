import bcrypt from 'bcrypt';
import {
    createUser,
    authenticateUser,
    getAllUsers
} from "../models/users.js";


const showUserRegistrationForm = (req, res) => {
    res.render('register', {
        title: 'Register'
    });
};

const showLoginForm = (req, res) => {
    res.render("login", {
        title: "Login"
    });
};

const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Generate a salt and hash the password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Save the new user
        await createUser(name, email, passwordHash);

        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/');
    } catch (error) {
        console.error('Error registering user:', error);

        req.flash(
            'error',
            'An error occurred during registration. Please try again.'
        );

        res.redirect('/register');
    }
};

const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);

        if (user) {
            // Save the authenticated user in the session
            req.session.user = user;

            req.flash("success", "Login successful!");

            if (res.locals.NODE_ENV === "development") {
                console.log("User logged in:", user);
            }

            res.redirect("/dashboard");
        } else {
            req.flash("error", "Invalid email or password.");
            res.redirect("/login");
        }

    } catch (error) {
        console.error("Error during login:", error);

        req.flash(
            "error",
            "An error occurred during login. Please try again."
        );

        res.redirect("/login");
    }
};

const processLogout = async (req, res) => {

    if (req.session.user) {
        delete req.session.user;
    }

    req.flash("success", "Logout successful!");

    res.redirect("/login");
};

const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }

    next();
};

const showDashboard = (req, res) => {

    const name = req.session.user.name;
    const email = req.session.user.email;
    const role = req.session.user.role_name;

    res.render("dashboard", {
        title: "Dashboard",
        name,
        email,
        role
    });
};

const showUsers = async (req, res) => {

    try {

        const users = await getAllUsers();

        res.render("users", {
            title: "Users",
            users
        });

    } catch (error) {

        console.error("Error loading users:", error);

        req.flash(
            "error",
            "Unable to load users."
        );

        res.redirect("/dashboard");
    }
};


const requireRole = (role) => {
    return (req, res, next) => {

        // User is not logged in
        if (!req.session || !req.session.user) {
            req.flash("error", "You must be logged in to access this page.");
            return res.redirect("/login");
        }

        // User doesn't have the required role
        if (req.session.user.role_name !== role) {
            req.flash("error", "You do not have permission to access this page.");
            return res.redirect("/dashboard");
        }

        // User has permission
        next();
    };
};


export {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    showDashboard,
    requireRole,
    showUsers
};