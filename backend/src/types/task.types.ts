export interface ITask {
  _id?: string;
  title: string;
  description?: string;
  isDone: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  isDone?: boolean;
  notes?: string[];
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  isDone?: boolean;
}