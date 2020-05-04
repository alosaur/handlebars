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

// Then render page
await handle.renderView('index', { name: 'Alosaur' })

```
