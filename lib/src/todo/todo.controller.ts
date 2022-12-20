import { Status } from "@deps";
import { OakContext } from "@types";

import todoService from "./todo.service.ts";
import { TodoRepository } from "./todo.repository.ts";
import convertTodo from "./convertTodo.ts";

export const getTodos = async (ctx: OakContext<"/">) => {
    const { response } = ctx;

    const repo = new TodoRepository();
    const [todos, err, statusCode] = await todoService.findAll(repo);

    if (err) {
        response.status = statusCode;
        response.body = {
            code: statusCode,
            data: [],
        };
        return;
    }

    response.status = Status.OK;
    response.body = {
        code: statusCode,
        data: convertTodo(todos),
    };
};

export const createTodo = async (ctx: OakContext<"/">) => {
    const { request, response } = ctx;

    const repo = new TodoRepository();
    const todo = await todoService.create(repo, await request.body().value);

    response.status = Status.OK;
    response.body = {
        code: Status.Created,
        data: todo,
    };
};
