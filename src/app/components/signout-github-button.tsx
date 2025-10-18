import { logout } from "@/lib/actions/auth";

export default function SignOutGithubButton() {
  return (
    <button
      type="button"
      onClick={() => logout()}
      className="w-full py-2 rounded bg-red-600 transition text-white"
    >
      Sign out
    </button>
  );
}