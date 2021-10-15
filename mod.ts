import HandlebarsJS from "https://dev.jspm.io/handlebars@4.7.6";
import { walk } from "https://deno.land/std@0.110.0/fs/mod.ts";
import {
  globToRegExp,
  join,
  normalize,
} from "https://deno.land/std@0.110.0/path/mod.ts";
const { readFile } = Deno;

export { HandlebarsJS };

export interface HandlebarsConfig {
  baseDir: string;
  extname: string;
  layoutsDir: string;
  partialsDir: string;
  cachePartials?: boolean;
  defaultLayout: string;
  // deno-lint-ignore no-explicit-any
  helpers: any;
  // deno-lint-ignore no-explicit-any
  compilerOptions: any;
}

const DEFAULT_HANDLEBARS_CONFIG: HandlebarsConfig = {
  baseDir: "views",
  extname: ".hbs",
  layoutsDir: "layouts/",
  partialsDir: "partials/",
  cachePartials: true,
  defaultLayout: "main",
  helpers: undefined,
  compilerOptions: undefined,
};

function getNormalizePath(path: string) {
  return normalize(path).replace(/\\/g, "/");
}

export class Handlebars {
  #havePartialsBeenRegistered = false;

  constructor(private config: HandlebarsConfig = DEFAULT_HANDLEBARS_CONFIG) {
    this.config = { ...DEFAULT_HANDLEBARS_CONFIG, ...config };

    if (this.config.helpers) {
      const helperKeys = Object.keys(this.config.helpers);

      for (let i = 0; i < helperKeys.length; i++) {
        const helperKey = helperKeys[i];
        // deno-lint-ignore no-explicit-any
        (HandlebarsJS as any).registerHelper(
          helperKey,
          this.config.helpers[helperKey],
        );
      }
    }
  }

  /**
     * Processes of rendering view
     *
     * @param view
     * @param context
     * @param layout
     */
  public async renderView(
    view: string,
    context?: Record<string, unknown>,
    layout?: string,
  ): Promise<string> {
    if (!view) {
      console.warn("View is null");
      return "";
    }

    const config: HandlebarsConfig = this.config as HandlebarsConfig;

    if (!config.cachePartials || !this.#havePartialsBeenRegistered) {
      await this.registerPartials();
    }

    const path = join(config.baseDir, view + config.extname);
    const body: string = await this.render(path, context);

    layout = (layout as string) || config.defaultLayout;

    if (layout) {
      const layoutPath: string = join(
        config.baseDir,
        config.layoutsDir,
        layout + config.extname,
      );

      return this.render(layoutPath, { ...context, body });
    }

    return body;
  }

  /**
     * Processes on render without partials and layouts
     */
  public async render(
    path: string,
    context?: Record<string, unknown>,
  ): Promise<string> {
    // TODO: use cashe
    const source: string = new TextDecoder().decode(await readFile(path));
    // deno-lint-ignore no-explicit-any
    const template = (HandlebarsJS as any).compile(
      source,
      this.config!.compilerOptions,
    );

    return template(context);
  }

  /**
     * Processes on register partials
     */
  private async registerPartials() {
    const paths = await this.getTemplatesPath(
      join(this.config.baseDir, this.config.partialsDir),
    );
    if (paths) {
      for (const path of paths) {
        const templateName: string = path
          .replace(
            getNormalizePath(this.config.baseDir) + "/" +
              this.config!.partialsDir,
            "",
          )
          .replace(new RegExp(this.config!.extname + "$"), "");
        const source: string = new TextDecoder().decode(await readFile(path));

        // deno-lint-ignore no-explicit-any
        (HandlebarsJS as any).registerPartial(templateName, source);
      }
    }

    this.#havePartialsBeenRegistered = true;
  }

  /**
     * Gets template pathes with glob match
     */
  private async getTemplatesPath(path: string): Promise<string[]> {
    const arr: string[] = [];

    for await (
      const w of walk(
        path,
        { match: [globToRegExp("**/*" + this.config!.extname)] },
      )
    ) {
      if (w.isFile) {
        arr.push(getNormalizePath(w.path));
      }
    }

    return arr;
  }
}
