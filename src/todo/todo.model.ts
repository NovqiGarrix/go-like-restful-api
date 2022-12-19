import { novo } from "@deps";

export interface ITodo {
  _id: string;

  title: string;

  description: string;

  isDone: boolean;

  createdAt: Date;

  updatedAt: Date;
}

const TodoModel = novo.model<ITodo>("todos");
export default TodoModel;
