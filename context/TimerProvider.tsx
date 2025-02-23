import { Category, Timer } from "@/interfaces";
import { v4 as uuidv4 } from "uuid";
import React, {
  createContext,
  ReactNode,
  useContext,
  useReducer,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface AppState {
  timers: Timer[];
  categories: Category[];
  history: Timer[];
}

export type Action =
  | { type: "ADD_TIMER"; payload: { categoryName: string; timer: Timer } }
  | { type: "START_TIMER"; payload: { timerId: string } }
  | { type: "PAUSE_TIMER"; payload: { timerId: string; remainingTime: number } }
  | { type: "RESET_TIMER"; payload: { timerId: string } }
  | { type: "TIMER_COMPLETE"; payload: { timerId: string } }
  | { type: "LOAD_STATE"; payload: AppState }
  | { type: "START_ALL_TIMERS"; payload: { categoryName: string } }
  | { type: "PAUSE_ALL_TIMERS"; payload: { categoryName: string } }
  | { type: "RESET_ALL_TIMERS"; payload: { categoryName: string } };

export const initialState: AppState = {
  timers: [],
  categories: [],
  history: [],
};

const STORAGE_KEY = "app_state";

// Reducer function
export const timerReducer = (state: AppState, action: Action): AppState => {
  let newState;

  switch (action.type) {
    case "ADD_TIMER": {
      const { categoryName, timer } = action.payload;
      const categoryExists = state.categories.some(
        (cat) => cat.name === categoryName
      );

      newState = {
        ...state,
        timers: [...state.timers, timer],
        categories: categoryExists
          ? state.categories.map((cat) =>
              cat.name === categoryName
                ? { ...cat, timers: [...cat.timers, timer.id] }
                : cat
            )
          : [...state.categories, { name: categoryName, timers: [timer.id] }],
      };
      break;
    }

    case "START_TIMER": {
      const { timerId } = action.payload;
      newState = {
        ...state,
        timers: state.timers.map((timer) =>
          timer.id === timerId ? { ...timer, status: "running" } : timer
        ),
      };
      break;
    }

    case "PAUSE_TIMER": {
      const { timerId, remainingTime } = action.payload;
      newState = {
        ...state,
        timers: state.timers.map((timer) =>
          timer.id === timerId
            ? { ...timer, status: "paused", remainingTime }
            : timer
        ),
      };
      break;
    }

    case "RESET_TIMER": {
      const { timerId } = action.payload;
      newState = {
        ...state,
        timers: state.timers.map((timer) =>
          timer.id === timerId
            ? { ...timer, remainingTime: timer.duration, status: "paused" }
            : timer
        ),
      };
      break;
    }

    case "TIMER_COMPLETE": {
      const { timerId } = action.payload;
      const completedTimer = state.timers.find((timer) => timer.id === timerId);

      newState = {
        ...state,
        timers: state.timers.map((timer) =>
          timer.id === timerId
            ? { ...timer, remainingTime: timer.duration, status: "paused" }
            : timer
        ),
        history: completedTimer
          ? [...state.history, completedTimer]
          : state.history,
      };
      break;
    }

    case "LOAD_STATE": {
      return action.payload; // Load state from AsyncStorage
    }

    default:
      return state;
  }

  // Save the new state to AsyncStorage
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState)).catch((err) => {
    console.error("Failed to save state:", err);
  });

  return newState;
};

// Create context
interface StateContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const isValidStatus = (
  status: any
): status is "running" | "paused" | "completed" => {
  return ["running", "paused", "completed"].includes(status);
};

const StateContext = createContext<StateContextType | undefined>(undefined);

export const StateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(timerReducer, initialState);

  // Load state from AsyncStorage when the app starts
  // useEffect(() => {
  //   const loadState = async () => {
  //     try {
  //       const storedState = await AsyncStorage.getItem(STORAGE_KEY);
  //       if (storedState) {
  //         dispatch({ type: "LOAD_STATE", payload: JSON.parse(storedState) });
  //       }
  //     } catch (error) {
  //       console.error("Failed to load state:", error);
  //     }
  //   };

  //   loadState();
  // }, []);

  useEffect(() => {
    const loadState = async () => {
      try {
        const storedState = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedState) {
          const parsedState: AppState = JSON.parse(storedState);

          // 🔹 Ensure 'status' is correctly typed as "running" | "paused" | "completed"
          const fixedState: AppState = {
            ...parsedState,
            timers: parsedState.timers.map((timer) => ({
              ...timer,
              status: isValidStatus(timer.status) ? timer.status : "paused", // 🔥 Explicitly cast
            })),
          };

          dispatch({ type: "LOAD_STATE", payload: fixedState });
        }
      } catch (error) {
        console.error("Failed to load state:", error);
      }
    };

    loadState();
  }, []);

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {children}
    </StateContext.Provider>
  );
};

export const useAppState = (): StateContextType => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useAppState must be used within a StateProvider");
  }
  return context;
};
