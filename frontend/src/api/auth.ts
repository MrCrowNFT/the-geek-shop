import axios from "axios";

//signup call

interface SignupParams {
  username: string;
  password: string;
  email: string;
}

export const signupRequest = async ({
  username,
  password,
  email,
}: SignupParams) => {
  try {
    const res = await axios.post(
      "http://localhost:5500/auth/signup",
      { username, password, email },
      { headers: { "Content-Type": "application/json" } }
    );
    return res.data; // Return only the data
  } catch (err) {
    console.error("Signup error:", err);
    throw err; // Re-throw to be handled by the caller
  }
};

//login call

//refresh token call


//logout call
