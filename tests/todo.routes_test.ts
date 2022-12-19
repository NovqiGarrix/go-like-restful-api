import { assertArrayIncludes, assertEquals, superdeno } from "@testDeps";

import createServer from "@app";

Deno.test("GET /", async () => {
  const app = createServer();
  await superdeno(app.handle.bind(app))
    .get("/api/v1/todos")
    .expect(200)
    .expect((res) => {
      const { data, code } = res.body;

      assertEquals(code, 200);
      assertArrayIncludes(data, [
        {
          id: 1,
          title: "Todo 1",
          description: "Todo 1 description",
          isDone: false,
        },
      ]);
    });
});
