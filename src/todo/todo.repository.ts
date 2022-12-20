// deno-lint-ignore-file no-explicit-any

import { MyError } from "@types";
import { CreateOne, ObjectId } from "@deps";

import createTodoModel, { ITodo, ITodoModel } from "./todo.model.ts";

type SortType = "asc" | "desc";

export interface FindAllParams {
    limit?: number;
    skip?: number;
    filter?: Partial<Record<keyof ITodo, any>>;
    sort?: Record<keyof ITodo, SortType>;
    projection?: Record<keyof ITodo, 0 | 1>;
}

export type CreateUpdateOneTodo = CreateOne<ITodo>;

export interface ITodoRepository {
    create(todo: CreateUpdateOneTodo): Promise<[ITodo | undefined, MyError]>;
    findAll(options?: FindAllParams): Promise<[Array<ITodo>, MyError]>;
    deleteOne(id: ObjectId): Promise<MyError>;
    findOne(id: ObjectId): Promise<[ITodo | undefined, MyError]>;
}

export class TodoRepository implements ITodoRepository {
    private static TodoModel: ITodoModel;

    constructor() {
        if (typeof TodoRepository.TodoModel === "undefined") {
            TodoRepository.TodoModel = createTodoModel();
        }
    }

    async create(todo: CreateUpdateOneTodo): Promise<[ITodo, MyError]> {
        return [await TodoRepository.TodoModel.create(todo), null];
    }

    async findAll(options?: FindAllParams): Promise<[Array<ITodo>, MyError]> {
        const { filter = {}, limit, skip, sort, projection } = options ?? {};

        const todos = await TodoRepository.TodoModel.find(filter, {
            limit,
            skip,
            sort,
            projection,
        });

        return [todos, null];
    }

    async deleteOne(id: ObjectId): Promise<MyError> {
        await TodoRepository.TodoModel.deleteOne({ _id: id });
        return null;
    }

    async findOne(id: ObjectId): Promise<[ITodo | undefined, MyError]> {
        const todo = await TodoRepository.TodoModel.findOne({ _id: id });
        return [todo, null];
    }
}
