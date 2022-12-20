import { ConvertedTodo, ITodo } from "./todo.model.ts";

export default function convertTodo(
    todo: ITodo | Array<ITodo>,
): ConvertedTodo | Array<ConvertedTodo> {
    if (Array.isArray(todo)) {
        const todos = todo.map((todo) => convertTodo(todo)) as Array<
            ConvertedTodo
        >;
        return todos;
    }

    return {
        ...todo,
        _id: todo._id.toString(),
        createdAt: todo.createdAt.getTime(),
        updatedAt: todo.updatedAt.getTime(),
    };
}
