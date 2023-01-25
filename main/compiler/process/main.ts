import { _AST } from "./parser.ts";
import type { Token, Assign, Print, AST, Type, IfStatement, ElseIfStatement, ElseStatement, CustomRelative, relbase, Expunge, Expression, LC, For } from "../misc/general/tokens.ts";
import { Null, TokenType, Types, valToType } from "../misc/general/tokens.ts";
import { exception, Exceptions } from "../misc/exceptions.ts";
import { CODE as file, fname } from "./lexer.ts";

try { await Deno.mkdir("out") } catch(e) {}

type vtype = { name: string, pType: string };
const variables: vtype[] = [];
const tempVariables: vtype[] = [];

type printArg = ({ value: string | Expression } & LC);

function excEmit(t: keyof typeof Exceptions, args: string[], l: number, c: number): void {
    exception(t, args, l, c, file, 'Emitt');
}

function vcheck(vs: string, l: number, c: number, slice?: boolean): vtype | void {
    const vn: string = vs.slice(0, slice ? -6 : Infinity);
    return variables.find(e => e.name === vn) || excEmit("InexistentVariable", [vn], l, c - 1);
} 

const XN: TextEncoder = new TextEncoder();
async function Gen(text: string, options?: Deno.WriteFileOptions): Promise<void> {
    await Deno.writeFile(`./out/${fname.slice(0, -5)}.ts`, XN.encode(text), options);
}

function literalCheck<T extends TokenType>(node: AST<T>): string | void {
    function literalError(): void { throw Error('Invalid literal'); }
    if(Object.keys(node).length === 1) {
        const ovn0 = Object.values(node)[0];
        if(typeof ovn0 === 'string') {
            if(['String', 'Number'].includes(ovn0)) return ovn0;
            else literalError();
        } else literalError();
    } else literalError();
} function literalConversion(literalValue: string): string {
    for(const r of Types.filter(e => e?.regex)) {
        if(r.regex?.test(literalValue)) {
            return r.rest.parentType;
        }
    } return '';
}

async function RelCreate(crel: CustomRelative | Exclude<Omit<CustomRelative, "param">, undefined>[]): Promise<string> {
    let output = "";
    if('param' in crel) output += `const ${crel.name}:TYPE.Rel={\nref:{\n\ttype:${JSON.stringify(crel.param)}\n}`;
	for(const e of Object.entries(crel).slice(2)) {
        const k: string = e[0];
        const v: Omit<CustomRelative, "name" | "param">[] = e[1] as Omit<CustomRelative, "name" | "param">[];
		if(k === 'consts') {
			for(const c of v as relbase<never>[]) 
				output += `,${c.name}:${c.dtype ? `{_v:'${c?.value}',_d:'${c.dtype.mainType.m}'}\n` : c?.value}`;
			
		} else if (k === 'procs') {
            for(const p of v as relbase<Omit<Assign, "val">>[]) {
                output += `,${p.name}:function(${p.args?.map(e => {
                    const name: string = e.name.n;
                    const _type: Type["rest"] = Types.find(el => el.trueType === e.mainType.m)?.rest as Type["rest"];
                    tempVariables.push({ name, pType: _type.parentType });
                    variables.push({ name, pType: _type.parentType });
                    return `${name}:TYPE.${_type.bytlType}`;
                }).join(',')}){`;
                output += `${await Emit(p.value as AST<TokenType>[], true)}}`;
                tempVariables.forEach(e => {
                    variables.splice(variables.indexOf(e), 1);
                });
            }
		} else {
			output += await RelCreate(v as Exclude<CustomRelative["subrels"], undefined>);
		}
	}
	
	return output;
}

function parseCondition(cond: AST<TokenType>[]): string {
    let final = '';
    for(const el of cond) {
        const key: string = Object.keys(el)[0];
        if(['Number', 'String', 'Character', 'Boolean', 'Literal'].includes(key)) {
            if(key === 'Literal') {
                final += el.Literal + ".value";
            } else final += el[key];
        } else if (key === 'LogicalOperator') {
            const logic: { [key: string]: string } = { 
                "GreaterThanOrEqualTo": ">=", "LessThanOrEqualTo": "<=", "RightAngleBracket": ">",
                "LeftAngleBracket": "<", "Equality": "==", "Inequality": "!=", "And": "&&",
                "Or": "||" };

            final += Object.values(logic)[Object.keys(logic).findIndex(e => e === el[key])];
        }
    }
    return final;
}

await Gen("import * as TYPE from '~/Bytl-main/main/compiler/defs/types.ts';\n");

const parentStyles: { parent: string, style: string }[] = [
    { parent: 'Number', style: 'color:#f6e58d;'},
    { parent: 'String', style: 'color:lightgreen;' },
    { parent: 'Boolean', style: 'color:red;font-weight:bold;' },
    { parent: 'Nil', style: 'color:black;' },
    { parent: 'Rel', style: 'color:black;' }
];
async function Emit(AbstractSyntaxTree: AST<TokenType>[], onlyReturn?: boolean): Promise<string> {
    let osg = "";
    let i = 0;
    for(const N of AbstractSyntaxTree) {
        let asg = "";
        if(N?.Assignment) {
            const node: Assign = (N.Assignment as Assign);
            const na = node.name;
            const vn = variables.map(e => e.name);
            const m: string = node.mainType.m as string;
            const assignType = Types.find(el => el.trueType === m);
            if(vn.includes(na.n) && !!m || !m && !vn.includes(na.n)) excEmit(!m ? "RequiredType" : "DuplicateVarName", [na.n], na.l, na.c);
            const n = Null<Type>(assignType) ?? {rest:{parentType:'',bytlType:''},trueType:''};
            const r = n.rest;
            const p = r.parentType;
            const nv: Token = node.val as Token;
            const v = "val" in nv ? nv.val : nv.type;
            const t = `TYPE.${r.bytlType}`;
            const e = n.trueType === p;
    
            variables.push({ name: na.n, pType: p });
            const [b1, b2, b3] = [!e ? t+"Construct(" : '', !e ? ")" : '', n.nrquo || !['Char', 'Sc'].includes(r.bytlType) ? v : (r.bytlType == 'Char' ? `'${v}'` : `"${v}"`)];

            asg += 
                !m ? `${na.n}.value=\`${b3}\`;\n` : `let ${na.n}:${t}=${b1}{__type:'${p}',value:\`${b3}\`}${b2};\n`;
    
        } else if (N?.PrintOverride) {
            asg += "console.log(";
            const node: Print = (N.PrintOverride as Print);
            const a: printArg[] = node.args;
            const l = node.args.length;
            const styles: string[] = [];
            for(let i = 0; i < l; i++) {
                const d: { value: string } & LC = a[i] as { value: string } & LC;
                const isVar: boolean = d.value.endsWith('.value');
                styles.push(Null<string>(parentStyles.find(p => p.parent === (isVar ? vcheck(d.value, d.l, d.c, true)?.pType : literalConversion(d.value)))?.style));
                const sl: string = styles[styles.length - 1];
                if(!isVar) d.value = `\`${d.value}\``;
                if(sl.includes("bold")) d.value += ".slice(0,1).toUpperCase()";
                asg += i + 1 === l ? `"%c"+${d.value}, ${styles.map(e => `"${e}"`).join(',')});\n` : `"%c"+${d.value}+" "+`;
            } 
        } else if (N?.IfStatement || N?.ElseIfStatement) {
            const node: IfStatement | ElseIfStatement = (N.IfStatement as IfStatement) || (N.ElseIfStatement as ElseIfStatement);
            asg += `${N.IfStatement ? "" : "else "}if(`;
            asg += parseCondition(node.condition);
            asg += "){\n";
            asg += await Emit(node.block, true);
            asg += "}";
        } else if (N?.ElseStatement) {
            asg += "else{\n";
            asg += await Emit((N.ElseStatement as ElseStatement).block, true);
            asg += "}";
        } else if (N?.CustomRelative) {
            asg += await RelCreate(N.CustomRelative as CustomRelative) + "};\n";
        } else if (N?.Expunge) {
            for(const E of (N.Expunge as Expunge).args) 
                variables.splice(variables.indexOf((vcheck(E.value, E.l, E.c) as vtype)), 1)
        } else if (N?.ForLoop) {
            asg += "for(";
            const loop: For = N.ForLoop as For;
            const index = loop.name ? loop.name : '_';
            if(loop.name) variables.push({ pType: 'Number', name: loop.name });
            const iters = loop.iters;
            const way: boolean = index > iters;
            asg += `let ${index} = TYPE.IntConstruct({__type:'Number',value:0}); `;
            asg += loop.condition ? parseCondition(loop.condition) : `${index}.value ${way ? '<' : '>'} ${iters}; `;
            asg += `${index}.value` + (way ? '++' : '--') + ')';
            asg += "{\n";
            asg += await Emit(loop.action, true);
            variables.splice(variables.findIndex(e => e.name === loop.name), 1);
            asg += "}";
        }
        osg += asg;
        i++;
        if(!onlyReturn) await Gen(asg, { append: true });
    }
    return osg;
}

await Emit(_AST);
