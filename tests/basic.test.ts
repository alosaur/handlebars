import { Handlebars } from "../mod.ts";
import { assert } from "https://deno.land/std@v0.54.0/testing/asserts.ts";
const { test } = Deno;

test({
  name: "Basic render test",
  async fn() {
    const handle = new Handlebars();
    const text = await handle.renderView("index", { name: "Alosaur" });
    
    assert(text.includes("header!"));
    assert(text.includes("This is index page My name is Alosaur"));
    assert(text.includes("title!"));
    assert(text.includes("<span>footer!</span>"));
    assert(text.includes("<span>index page!</span>"));
  },
});

// TODO Add test with full contains
