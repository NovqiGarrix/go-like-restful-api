import { novo, ObjectId } from "@deps";

export interface ITodo {
    _id: ObjectId;

    title: string;

    description: string;

    isDone: boolean;

    createdAt: Date;

    updatedAt: Date;
}

export interface ConvertedTodo {
    _id: string;
    createdAt: number;
    updatedAt: number;
    title: string;
    description: string;
    isDone: boolean;
}

export type ITodoModel = ReturnType<typeof createTodoModel>;

const createTodoModel = () => novo.model<ITodo>("todos");

export default createTodoModel;
