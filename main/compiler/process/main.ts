import { _AST } from "./parser.ts";
import type { AST, Assign, Exit } from "../misc/tokens.ts";
import { TokenType } from "../misc/tokens.ts";

//console.log("\n\nAST CONVERSION:\n");
const XN: TextEncoder = new TextEncoder();
await Deno.writeFile("./output.ts", XN.encode("import * as TYPE from './defs/types.ts';\n"));

for(const N of _AST) {
    let asg = "";
    if(N?.Assignment) {
        const node: Assign = (N.Assignment as Assign);
        const m = node.mainType;
        if(m === 'Integer') {
            asg += `let ${node.name}: TYPE.Int = TYPE.IntConstruct({ __type: 'Number', value: ${node.val.val} });\n`;
        } else if (m === 'String') {
            asg += `let ${node.name}: TYPE.Sc = { __type: 'String', value: "${node.val.val}" };\n`
        } else if (m === 'Decimal') {
            asg += `let ${node.name}: TYPE.Dec = TYPE.DecConstruct({ __type: 'Number', value: ${node.val.val} });\n`;
        } else if (m === 'Character') {
            asg += `let ${node.name}: TYPE.Char = TYPE.CharConstruct({ __type: 'String', value: '${node.val.val}' });\n`;
        } else if (m === 'Boolean') {
            asg += `let ${node.name}: TYPE.Bool = { __type: 'Boolean', value: ${node.val.type} };\n`
        } else if (m === 'Nil') {
            asg += `let ${node.name}: TYPE.Nil = { __type: 'Nil', value: "${node.val.type}" };\n`
        }
    } else if (N?.Exit) {
        asg += "console.log(";
        const node: Exit = (N.Exit as Exit);
        const a: string[] = node.args;
        const l = node.args.length;
        for(let i = 0; i < l; i++) {
            asg += i + 1 === l ? `${a[i]});\n` : `${a[i]},`;
        }
    }
    await Deno.writeFile("./output.ts", XN.encode(asg), { append: true });
}
