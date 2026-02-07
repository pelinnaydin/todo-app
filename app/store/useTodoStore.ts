import { create } from 'zustand';

type Todo = {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
};

type TodoStore = {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  
  // Actions
  setTodos: (todos: Todo[]) => void;
  addTodo: (todo: Todo) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
};

export const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  loading: false,
  error: null,

  setTodos: (todos) => set({ todos }),
  
  addTodo: (todo) => set((state) => ({ 
    todos: [todo, ...state.todos] 
  })),
  
  updateTodo: (id, updates) => set((state) => ({
    todos: state.todos.map((todo) =>
      todo.id === id ? { ...todo, ...updates } : todo
    ),
  })),
  
  deleteTodo: (id) => set((state) => ({
    todos: state.todos.filter((todo) => todo.id !== id),
  })),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
}));
