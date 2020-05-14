import HandlebarsJS from 'https://dev.jspm.io/handlebars@4.7.6';
import { walk } from 'https://deno.land/std@0.51.0/fs/mod.ts';
import { globToRegExp, normalize, join } from 'https://deno.land/std@0.51.0/path/mod.ts';
const { readFile } = Deno;

interface HandlebarsConfig {
    baseDir: string;
    extname: string;
    layoutsDir: string;
    partialsDir: string;
    defaultLayout: string;
    helpers: any;
    compilerOptions: any;
}

const DEFAULT_HANDLEBARS_CONFIG: HandlebarsConfig = {
    baseDir: 'views',
    extname: '.hbs',
    layoutsDir: 'layouts/',
    partialsDir: 'partials/',
    defaultLayout: 'main',
    helpers: undefined,
    compilerOptions: undefined,
};

function getNormalizePath(path: string) {
    return normalize(path).replace(/\\/g, '/');
}

export class Handlebars {
    constructor(private config: HandlebarsConfig = DEFAULT_HANDLEBARS_CONFIG) {
        this.config = { ...DEFAULT_HANDLEBARS_CONFIG, ...config };
    }

    /**
     * Processes of rendering view
     *
     * @param view
     * @param context
     * @param layout
     */
    public async renderView(view: string, context?: Object, layout?: string): Promise<string> {
        if (!view) {
            console.warn('View is null');
            return '';
        }

        const config: HandlebarsConfig = this.config as HandlebarsConfig;

        const partialsPathes = await this.getTemplatesPath(join(config.baseDir, config.partialsDir));
        partialsPathes && (await this.registerPartials(partialsPathes));

        const path = join(config.baseDir, view + config.extname);
        const body: string = await this.render(path, context);

        layout = (layout as string) || config.defaultLayout;

        if (layout) {
            const layoutPath: string = join(config.baseDir, config.layoutsDir, layout + config.extname);

            return this.render(layoutPath, { ...context, body });
        }

        return body;
    }

    /**
     * Processes on render without partials and layouts
     */
    public async render(path: string, context?: Object): Promise<string> {
        // TODO: use cashe
        const source: string = new TextDecoder().decode(await readFile(path));
        const template = HandlebarsJS.compile(source, this.config!.compilerOptions);

        return template(context);
    }

    /**
     * Processes on register partials
     */
    private async registerPartials(pathes: string[]) {
        for (const path of pathes) {
            const templateName: string = path
                .replace(this.config.baseDir + '/' + this.config!.partialsDir, '')
                .replace(new RegExp(this.config!.extname + '$'), '');
            const source: string = new TextDecoder().decode(await readFile(path));

            HandlebarsJS.registerPartial(templateName, source);
        }
    }

    /**
     * Gets template pathes with glob match
     */
    private async getTemplatesPath(path: string): Promise<string[]> {
        const arr: string[] = [];

        for await (const w of walk(path, { match: [globToRegExp('**/*' + this.config!.extname)] })) {
            if (w.isFile) {
                arr.push(getNormalizePath(w.path));
            }
        }

        return arr;
    }
}
