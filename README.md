## Handlebars template render for Deno

![test](https://github.com/alosaur/handlebars/workflows/test/badge.svg)

Official handlebars docs: [Guide](https://handlebarsjs.com/guide)

### How to use renderer

```ts
import { Handlebars } from 'https://deno.land/x/handlebars/mod.ts'

// First, create instance of Handlebars

const handle = new Handlebars();

// or with custom config
const handle = new Handlebars({
    ...
});

// by default uses this config:
const DEFAULT_HANDLEBARS_CONFIG: HandlebarsConfig = {
    baseDir: 'views',
    extname: '.hbs',
    layoutsDir: 'layouts/',
    partialsDir: 'partials/',
    defaultLayout: 'main',
    helpers: undefined,
    compilerOptions: undefined,
};

// Then render page to string
const result: string = await handle.renderView('index', { name: 'Alosaur' })

```

You must use the flag --unstable in Deno v1 `deno run --unstable'.
because Deno.std is not stable. [deno/issues/5175](https://github.com/denoland/deno/issues/5175)
