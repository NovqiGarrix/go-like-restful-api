import { ObjectId, Status } from "@deps";
import { ServiceReturn } from "@types";

import objectIdConvertion from "@utils/objectIdConvertion.ts";

import { ITodo } from "./todo.model.ts";
import {
    CreateUpdateOneTodo,
    FindAllParams,
    ITodoRepository,
} from "./todo.repository.ts";

async function findAll(
    repo: ITodoRepository,
    options?: FindAllParams,
): Promise<ServiceReturn<ITodo[]>> {
    const [todos, error] = await repo.findAll(options);
    return [todos, error, Status.OK];
}

async function findOne(
    repo: ITodoRepository,
    id: string | ObjectId,
): Promise<ServiceReturn<ITodo | undefined>> {
    const [todo, err] = await repo.findOne(objectIdConvertion.toObjectId(id));
    if (err) return [undefined, err, Status.BadRequest];

    return [todo!, err, Status.OK];
}

async function deleteOne(
    repo: ITodoRepository,
    id: string | ObjectId,
): Promise<ServiceReturn<string>> {
    const _id = objectIdConvertion.toObjectId(id);

    const err = await repo.deleteOne(_id);
    if (err) return [_id.toString(), err, Status.BadRequest];

    return [_id.toString(), err, Status.OK];
}

async function create(
    repo: ITodoRepository,
    todo: CreateUpdateOneTodo,
): Promise<ServiceReturn<ITodo | undefined>> {
    const [createdTodo, err] = await repo.create(todo);
    if (err) return [undefined, err, Status.BadRequest];

    return [createdTodo!, err, Status.Created];
}

export default {
    findAll,
    create,
    findOne,
    deleteOne,
};
