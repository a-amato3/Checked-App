import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import illustration from "../images/logo.png";

import { ReactComponent as CrossEye } from "../images/cross-eye.svg";
const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);

      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4 py-8">
      <div className="flex justify-between items-center w-full max-w-screen-xl">
        <div className="bg-white p-8 rounded-lg shadow-lg w-[495px] h-[595px] flex flex-col">
          <div className="text-start">
            <h2 className="text-3xl mb-4">Welcome !</h2>
            <p className="text-3xl font-bold mb-2">Sign in to</p>
            <p className="text-lg mb-12">get things done ✨</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Enter your email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4 relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Enter your password
              </label>
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                placeholder="Enter password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <CrossEye className="w-6 h-6 mt-4 text-gray-500" />
              </button>
            </div>

            <div className="flex justify-between items-center mb-4">
              <label className="text-sm">
                <input type="checkbox" className="mr-2" />
                Remember me
              </label>
              <a className="text-[#00C495] font-bold">Forgot Password ?</a>
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full bg-[#00C495] text-white py-2 rounded-md font-bold"
            >
              Login
            </button>
          </form>
          <div className="mt-4 text-center">
            <span className="text-sm text-">Don't have an Account ?</span>
            <span>
              {" "}
              <Link
                to="/register"
                className="text-[#00C495] hover:text-teal-600 font-bold"
              >
                Register
              </Link>
            </span>
          </div>
        </div>

        <div className="hidden md:flex justify-center items-center w-[368px] h-[368px] mx-8">
          <img
            src={illustration}
            alt="Illustration"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
