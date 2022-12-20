import { novo } from "@deps";
import {
    assertArrayIncludes,
    assertObjectMatch,
    describe,
    expect,
    it,
} from "@testDeps";

import excludeFields from "@utils/excludeFields.ts";

import { ITodo } from "./todo.model.ts";
import {
    CreateUpdateOneTodo,
    ITodoRepository,
    TodoRepository,
} from "./todo.repository.ts";

const rawTodos: Array<CreateUpdateOneTodo> = [
    { description: "Todo 1's descriptions", isDone: false, title: "Todo 1" },
    { description: "Todo 2's descriptions", isDone: true, title: "Todo 2" },
];

const todos: Array<ITodo> = [];

const autoGeneratedFields = ["_id", "createdAt", "updatedAt"];

let repo: ITodoRepository;

const todoRepositoryTest = describe("Todo Repository Test", {
    async beforeAll() {
        await novo.connect("mongodb://localhost:27017/deno_server");
        repo = new TodoRepository();
    },

    afterAll() {
        novo.disconnect();
    },
});

it(todoRepositoryTest, "#1. Create", async (t) => {
    for await (const rawTodo of rawTodos) {
        await t.step(`Creating: ${rawTodo.title}`, async () => {
            const [todo, error] = await repo.create(rawTodo);
            if (error) throw error;

            const { _id, createdAt, updatedAt, ...rest } = todo!;

            if (!(new String(_id) instanceof String)) {
                throw new Error("Invalid _id");
            }

            if (!(createdAt instanceof Date)) {
                throw new Error("Invalid createdAt");
            }

            if (!(updatedAt instanceof Date)) {
                throw new Error("Invalid updatedAt");
            }

            expect(rest).toEqual(rawTodo);

            todos.push(todo!);
        });
    }
});

it(todoRepositoryTest, "#2. Find All", async (t) => {
    await t.step("Find All Without Options", async () => {
        const [todos, err] = await repo.findAll();
        if (err) throw err;

        assertArrayIncludes(
            excludeFields(todos, autoGeneratedFields),
            rawTodos,
        );
    });

    await t.step("Find All With Options", async () => {
        const [todos, err] = await repo.findAll({
            filter: { isDone: false },
            limit: 1,
        });

        if (err) throw err;

        assertArrayIncludes(excludeFields(todos, autoGeneratedFields), [
            rawTodos.find((x) => x.isDone === false),
        ]);
    });
});

it(todoRepositoryTest, "#3. Find One", async (t) => {
    for await (const td of todos) {
        await t.step(`Finding: ${td.title}`, async () => {
            const [todo, err] = await repo.findOne(td._id);
            if (err) throw err;

            assertObjectMatch(todo, td);
        });
    }
});

it(todoRepositoryTest, "#4. Delete One", async (t) => {
    for await (const td of todos) {
        await t.step(`Finding: ${td.title}`, async () => {
            const [todo, err] = await repo.findOne(td._id);
            expect(err).toBeNull();

            await repo.deleteOne(todo?._id!);

            const [todo2, err2] = await repo.findOne(td._id);

            expect(err2).toBeNull();
            expect(todo2).toBeUndefined();
        });
    }
});