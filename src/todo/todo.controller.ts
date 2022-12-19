import { Status } from "@deps";
import { OakContext } from "@types";

import todoService from "./todo.service.ts";
import TodoRepository from "./todo.repository.ts";

export const getTodos = async (ctx: OakContext<"/">) => {
  const { response } = ctx;

  const repo = new TodoRepository();
  const todos = await todoService.findAll(repo);

  response.status = Status.OK;
  response.body = {
    code: 200,
    data: todos,
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
