"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import SignInGithubButton from "../components/signin-github-button";
import GoogleButton from "react-google-button";

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    setIsLoading(false);

    if (result?.error) {
      setMessage("Invalid email or password.");
    } else if (result?.ok) {
      router.push("/");
    }
  };

  const handleSocialSignIn = (provider: string) => {
    signIn(provider);
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 border-1 border-gray-600 rounded-lg shadow-xl">
      <h1 className="text-2xl text-center font-bold mb-4">Sign In</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
       

        
        <section className="flex flex-col items-center space-y-3">
          <GoogleButton
            onClick={() => handleSocialSignIn("google")}
            className="w-full"
            style={{ width: "100%" }}
          />
          <SignInGithubButton />
        </section>
      </form>

      {message && (
        <p className="mt-4 text-center text-sm text-red-500">{message}</p>
      )}
    </div>
  );
}
