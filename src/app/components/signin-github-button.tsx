import { login } from "@/lib/actions/auth";

export default function SignInGithubButton() {
  return (
    <button
      type="button"
      onClick={() => login()}
      className="w-full py-2 rounded  transition"
    >
      Sign in with GitHub
    </button>
  );
}
