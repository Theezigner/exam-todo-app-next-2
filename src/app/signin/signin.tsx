"use client";

import { useState } from "react";
import SignInGithubButton from "../components/signin-github-button";
import GoogleButton from "react-google-button";
import { signIn } from "next-auth/react";


export default function SignIn() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Example: Send data to API route or server
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Account created successfully!");
        setFormData({ name: "", email: "", password: "" });
      } else {
        setMessage(data.error || "Something went wrong.");
      }
    } catch (err) {
      setMessage("Server error.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 border-1 border-gray-600  rounded-lg shadow-xl">
      <h1 className="text-2xl text-center font-bold mb-4">Sign Up</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* <input
          type="text"
          name="name"
          value={formData.name}
          required
          placeholder="Full Name"
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded border-1 border-gray-600"
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          required
          placeholder="Email Address"
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded border-1 border-gray-600"
        />

        <input
          type="password"
          name="password"
          value={formData.password}
          required
          minLength={6}
          placeholder="Password"
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded border-1 border-gray-600"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Create Account
        </button> */}
        <section className="flex flex-col items-center text-center text-gray-500">
          <GoogleButton onClick={() => signIn("google")} className="mx-auto mt-16" />
          <SignInGithubButton />
        </section>
      </form>

      {message && (
        <p className="mt-4 text-center text-sm text-red-500">{message}</p>
      )}
    </div>
  );
}