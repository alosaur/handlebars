// import { Handlebars } from 'https://deno.land/x/handlebars/mod.ts';
import { Handlebars } from '../mod.ts';

const handle = new Handlebars();

const text = await handle.renderView('index', { name: 'Alosaur' });

console.log(text);
