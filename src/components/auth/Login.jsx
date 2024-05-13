import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {profile} from "../redux/slices/userSlice.jsx";
import {useDispatch} from "react-redux";

let Login = () => {
    let navigator = useNavigate();
    let dispatch = useDispatch();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        remember: false // Added state for checkbox
    });
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState("");

    const validateForm = () => {
        let errors = {};
        let isValid = true;

        // Email validation
        if (!formData.email) {
            errors.email = "Email is required";
            isValid = false;
        }

        // Password validation
        if (!formData.password) {
            errors.password = "Password is required";
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form data
        if (!validateForm()) {
            return;
        }
        // Send form data to the server
        try {
            const response = await axios.post("auth/login", formData, {withCredentials: true});
            if (response.status === 200) {
                const profileData = await axios.get("users/" + response.data._id, {withCredentials: true});
                console.log("Profile:", profileData.data);
                // Dispatch the profile action
                dispatch(profile(profileData.data));
                navigator("/")
            }
        } catch (error) {
            console.error("Error:", error);
            setErrorMessage(error.response.data.message);
        }
    };

    return (
        <>
            <section className="bg-gray-50 dark:bg-gray-900  pt-20 ">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
                    <Link to={"/"}
                          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                        <img className="w-8 h-8 mr-2" src="public/soict.png" alt="logo"/> HUST
                    </Link>
                    <div
                        className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Sign in to your account
                            </h1>
                            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                                {/* Email field */}
                                <div>
                                    <label htmlFor="email"
                                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-left">Your email</label>
                                    <input
                                        type="email"
                                        name="email" // Corrected name attribute
                                        id="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="name@company.com"
                                        required=""
                                    />
                                    {errors.email && <span className="text-red-500">{errors.email}</span>}
                                </div>
                                {/* Password Field */}
                                <div>
                                    <label htmlFor="password"
                                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-left">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Your password"
                                        required=""
                                    />
                                    {errors.password && <span className="text-red-500">{errors.password}</span>}
                                </div>
                                {/* Remember me checkbox */}
                                <div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="remember"
                                            id="remember"
                                            checked={formData.remember}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                remember: e.target.checked
                                            })}
                                            className="text-primary-600 border-gray-300 rounded focus:ring-primary-600 dark:focus:ring-blue-500"
                                        />
                                        <label htmlFor="remember"
                                               className="ml-2 text-sm text-gray-900 dark:text-white">
                                            Remember me
                                        </label>
                                    </div>
                                </div>
                                <button type="submit"
                                        className="w-full text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign
                                    in
                                </button>
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    Don’t have an account yet?
                                    <Link to={"/signup"} className="text-blue-500 hover:underline dark:text-blue-400">Sign
                                        up</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Login;