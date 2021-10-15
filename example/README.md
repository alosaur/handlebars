## Simple example with default options

```ts
import { Handlebars } from 'https://deno.land/x/handlebars/mod.ts';

const handle = new Handlebars();

const text = await handle.renderView('index', { name: 'Alosaur' });

console.log(text);

```

Just run this script

`deno run --allow-read mod.ts`


Returns:

```ts
header!
This is index page My name is Alosaur
<span>index page!</span>
This is
title!

----
<span>footer!</span>

```
