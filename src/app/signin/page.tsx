"use server";

import { auth } from "@/auth";
import SignIn from "./signin";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const session = await auth();
  console.log("Session:", session);

  if (session?.user) {
    redirect("/");
    // return (
    //   <div className="text-center">
    //     <h1 className="text-2xl font-bold mb-4 ">
    //       Welcome back, {session.user.name}
    //     </h1>
    //     <button onClick={() => redirect("/")}>
    //       Go to Homepage
    //     </button>

    //   </div>
    // );
  }
  return <SignIn />;
}
