// deno-lint-ignore-file no-explicit-any

import { MyError } from "@types";
import TodoModel, { ITodo } from "./todo.model.ts";

type SortType = "asc" | "desc";

export interface FindAllParams {
    limit?: number;
    skip?: number;
    filter?: Partial<Record<keyof ITodo, any>>;
    sort?: Record<keyof ITodo, SortType>;
    projection?: Record<keyof ITodo, 0 | 1>;
}

export type CreateUpdateOneTodo = Parameters<typeof TodoModel.create>[0];

export interface ITodoRepository {
    create(todo: CreateUpdateOneTodo): Promise<[ITodo | undefined, MyError]>;
    findAll(options?: FindAllParams): Promise<[Array<ITodo>, MyError]>;
    deleteOne(id: string): Promise<MyError>;
    findOne(id: string): Promise<[ITodo | undefined, MyError]>;
}

export default class TodoRepository implements ITodoRepository {

    async create(todo: CreateUpdateOneTodo): Promise<[ITodo, MyError]> {
        return [await TodoModel.create(todo), null];
    }

    async findAll(options?: FindAllParams): Promise<[Array<ITodo>, MyError]> {
        const { filter = {}, limit, skip, sort, projection } = options ?? {};

        const todos = await (await TodoModel.find(filter, {
            limit,
            skip,
            sort,
            projection,
        })).toArray();

        return [todos, null];
    }

    async deleteOne(id: string): Promise<MyError> {
        await TodoModel.deleteOne({ _id: id });
        return null;
    }

    async findOne(id: string): Promise<[ITodo | undefined, MyError]> {
        const todo = await TodoModel.findOne({ _id: id });
        return [todo, null];
    }

}
