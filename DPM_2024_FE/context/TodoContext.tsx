import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_URL from "@/config/config";
import { useRouter } from "expo-router";

type Todo = {
  _id: string;
  title: string;
  description: string;
};

type TodoContextType = {
  todos: Todo[];
  fetchTodos: () => void;
  updateTodo: (updatedTodo: Todo) => void;
};

type TodoProviderProps = {
  children: ReactNode;
};

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const router = useRouter();

  const fetchTodos = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.replace("/auth/LoginScreen");
        return;
      }

      const response = await axios.get<{ data: Todo[] }>(`${API_URL}/todos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(response.data.data);
    } catch (error) {
      console.error("Failed to fetch todos", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        await AsyncStorage.removeItem("token");
        router.replace("/auth/LoginScreen");
      }
    }
  };

  const updateTodo = (updatedTodo: Todo) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo._id === updatedTodo._id ? updatedTodo : todo
      )
    );
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <TodoContext.Provider value={{ todos, fetchTodos, updateTodo }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodos must be used within a TodoProvider");
  }
  return context;
};
