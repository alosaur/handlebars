import { Handlebars } from "../mod.ts";
import { assert } from "https://deno.land/std@v0.56.0/testing/asserts.ts";
const { test } = Deno;

test({
  name: "Basic render test",
  async fn() {
    const config = {
      baseDir: "views",
      extname: ".hbs",
      layoutsDir: "layouts/",
      partialsDir: "partials/",
      defaultLayout: "main",
      helpers: {
        echoHelper: (m: string) => {
          return m;
        },
      },
      compilerOptions: undefined,
    };
    const handle = new Handlebars(config);
    const text = await handle.renderView("index", { name: "Alosaur" });
    assert(text.includes("header!"));
    assert(text.includes("This is index page My name is Alosaur"));
    assert(text.includes("This is an example of a helper"));
    assert(text.includes("title!"));
    assert(text.includes("<span>footer!</span>"));
    assert(text.includes("<span>index page!</span>"));
  },
});

// TODO Add test with full contains
