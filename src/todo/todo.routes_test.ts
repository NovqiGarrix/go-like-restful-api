import { novo } from "@deps";
import {
    assertArrayIncludes,
    assertEquals,
    describe,
    it,
    superdeno,
} from "@testDeps";

import createServer from "@app";

import convertTodo from "./convertTodo.ts";
import todoService from "./todo.service.ts";
import { ConvertedTodo } from "./todo.model.ts";
import { CreateUpdateOneTodo, TodoRepository } from "./todo.repository.ts";

const todoRoutesTest = describe("Todo Routes Test", {
    async beforeAll() {
        await novo.connect("mongodb://localhost:27017/deno_server");
    },

    afterAll() {
        novo.disconnect();
    },
});

it(todoRoutesTest, "GET /", async (t) => {
    await novo.connect("mongodb://localhost:27017/deno_server");
    const app = createServer();

    let todos: Array<ConvertedTodo> = [];

    const repo = new TodoRepository();

    await t.step("Create Temp Todos", async () => {
        const rawTodos: Array<CreateUpdateOneTodo> = [
            {
                description: "Todo 1's descriptions",
                isDone: false,
                title: "Todo 1",
            },
            {
                description: "Todo 2's descriptions",
                isDone: true,
                title: "Todo 2",
            },
        ];

        const promisesOfTodos = rawTodos.map(async (rawTodo) => {
            const [todo, error] = await todoService.create(repo, rawTodo);
            if (error) return undefined;

            return convertTodo(todo!);
        });

        todos = (await Promise.all(promisesOfTodos)).filter((todo) =>
            !!todo
        ) as unknown as Array<ConvertedTodo>;
    });

    await t.step("Fetch the Todos", async () => {
        await superdeno(app.handle.bind(app))
            .get("/api/v1/todos")
            .expect(200)
            .expect((res) => {
                const { data, code } = res.body;

                assertEquals(code, 200);
                assertArrayIncludes(
                    data,
                    todos,
                );
            });
    });

    await t.step("Remove All Todos", async () => {
        for (const todo of todos) {
            await todoService.deleteOne(repo, todo._id);
        }
    });
});
