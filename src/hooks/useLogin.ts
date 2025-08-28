import { loginWithGoogle } from "@/api/auth";
import { ROUTES } from "@/lib/routes";
import tokenManager from "@/lib/tokenManager";
import toast from "react-hot-toast";

export const handleGoogleSuccess = async (credentialResponse: any) => {
  try {
    const idToken = credentialResponse.credential;
    console.log({ idToken });

    const response = await loginWithGoogle(idToken);
    tokenManager.setAuthData(response.data);

    // Role-based navigation
    const user = response.data.user;
    if (user.role === "student") {
      window.location.href = ROUTES.CHAT;
    } else if (user.role === "admin") {
      window.location.href = ROUTES.ADMIN;
    }
  } catch (error: any) {
    toast.error(
      error.response?.data?.error || "Google login failed. Try again."
    );
  }
};

export const handleGoogleFailure = () => {
  toast.error("Google sign-in failed");
};
