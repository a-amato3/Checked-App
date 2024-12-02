export interface Task {
    _id: string;
    title: string;
    description?: string;
    isDone: boolean;
    createdAt: Date;
    updatedAt: Date;
    notes: string[];
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
    notes?: string[];
}
