import { Status } from '@deps';
import { ServiceReturn } from "@types";

import { ITodo } from "./todo.model.ts";
import { CreateUpdateOneTodo, FindAllParams, ITodoRepository } from "./todo.repository.ts";

async function findAll(
    repo: ITodoRepository,
    options?: FindAllParams,
): Promise<ServiceReturn<ITodo[]>> {
    const [todos, error] = await repo.findAll(options);
    return [todos, error, Status.OK];
}

async function create(repo: ITodoRepository, todo: CreateUpdateOneTodo): Promise<ServiceReturn<ITodo | undefined>> {
    const [createdTodo, err] = await repo.create(todo);
    if (err) return [undefined, err, Status.BadRequest];

    return [createdTodo, err, Status.Created];
}

export default {
    findAll,
    create,
}
