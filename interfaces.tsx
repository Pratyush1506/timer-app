export interface Timer {
  id: string;
  name: string;
  duration: number;
  remainingTime: number;
  category: string;
  status:string | "running" | "paused" | "completed";
  hasHalfwayAlert: boolean
}

export interface Category {
  name: string;
  timers: string[];
}
