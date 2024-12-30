import "@/lib/axios-config";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TodoProvider } from "@/context/TodoContext";
import RootLayoutNav from "./_layout";

export default function App() {
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log("Checking auth token:", token ? "exists" : "none");

      if (!token) {
        console.log("No token found, redirecting to login");
        router.replace("/auth/LoginScreen");
      } else {
        console.log("Token found, staying on current screen");
        // Set default authorization header
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      router.replace("/auth/LoginScreen");
    }
  };

  return (
    <TodoProvider>
      <RootLayoutNav />
    </TodoProvider>
  );
}
