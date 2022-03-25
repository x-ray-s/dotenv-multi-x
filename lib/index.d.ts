/// <reference types="node" />
interface ENV {
    [propName: string]: string;
}
declare function parse(src: Buffer): ENV;
declare function getConfig(mode?: string): ENV;
declare function init(options?: string[], demandOption?: boolean): ENV;
declare const dotenv: {
    init: typeof init;
    parse: typeof parse;
    getConfig: typeof getConfig;
};
export default dotenv;
export { getConfig, parse, init };
