import { lexed, CODE, Lexer } from "./lexer.ts";
import type { Assign, Token, AST, TokenValueNode, TokenMultiValueNode, CustomRelative, relbase, Expression, LC } from "../misc/general/tokens.ts";
import { TokenType, Complex, Nested, Primitives, FListFE, VListFE, OListFE } from "../misc/general/tokens.ts";
import { lookAheadStr, lookAheadReg, lookBehindReg } from "../misc/general/looks.ts";
import { exception, Exceptions } from "../misc/exceptions.ts";
import { NthD } from "../misc/general/tokens.ts";

function excParse(t: keyof typeof Exceptions, args: string[], l: number, c: number, rgx = /[^\W_]/): void {
    exception(t, args, l, c, CODE, 'Pars', rgx);
}

type vtype = { name: string, pType: string } | null;
const variables: NthD<vtype> = [];
let scope = 0;

function vcheck(vs: string, l: number, c: number, slice?: boolean): vtype | void {
    const vn: string = vs.slice(0, slice ? -6 : Infinity);
    const fv = avail();
    return fv.find(e => e?.name === vn) ?? excParse("InexistentVariable", [vn], l, c - 1);
}

function avail(): vtype[] {
    let c: vtype[] = variables as vtype[];
    for(let i = 0; i < scope; i++) {
        c = c.filter((e: vtype | vtype[]) => {
            const [ee, ea] = [e as vtype, e as vtype[]]
            return ee?.name || (ea[0] && typeof ea[0] === 'object' && !!ea[ea.length - 1]);
        }).flat(1);
    }

    return c;
}

function add(e: vtype | []): void {
    ((scope > 0 
        ? 
            ((variables as unknown[]).flat(scope - 1) as 
                typeof variables extends NthD<infer T> ? T[] : never
            ).filter(Array.isArray).at(-1) || variables
        : variables
    ) as NthD<vtype>).push(e);
}

function invalidate(): void {
    add(null);
    scope--;
}

function MacroComb(LHS: Token, RHS: Token): Token[] {
    type TOKA = [`${TokenType}`, `${TokenType}`, `${TokenType}`];
    const combinations: TOKA[] = [
        ['AssignmentOperator', 'AssignmentOperator', 'Equality'],
        ['Exclamation', 'AssignmentOperator', 'Inequality'],
        ['RightAngleBracket', 'RightAngleBracket', 'PrintOverride'],
        ['Modulo', 'Modulo', 'DivisibleBy'],
        ['Exclamation', 'AssignmentOperator', 'Inequality'],
        ['KineticTypeChain', 'KineticTypeChain', 'AnonymousProcedure'],
        ['Context', 'Context', 'FullContext'],
        ['RightAngleBracket', 'AssignmentOperator', 'GreaterThanOrEqualTo'],
        ['LeftAngleBracket', 'AssignmentOperator', 'LessThanOrEqualTo']
    ];
    const lt: string = LHS.type;
    const rt: string = RHS.type;
    const comb: TOKA | undefined = combinations.find(e => e[0] === lt && e[1] === rt);

    if(lt === 'Literal' && (rt === 'Literal' || rt === 'Number')) return Lexer(LHS.val + RHS.val);
    if(RHS.type === 'Comma') return [LHS];
    if(!comb) return [LHS, RHS];
    else return [{ type: comb[2], ln: LHS.ln as number, col: LHS.col as number }];
}

function RelRec(vals: Token[]): Omit<CustomRelative, "param"> {
    const relative: Omit<CustomRelative, "param"> = {
        name: '',
        consts: [],
        procs: [],
        subrels: []
    };
    const v0 = vals[0];
    if(v0.type === 'Literal') relative.name = v0.val;
    else excParse("ExpectedToken", ['Literal', ':', v0.type], v0.ln as number, v0.col as number);
    let relI = 1;
    while(relI < vals.length) {
        const ct: string = vals[relI++].type;
        const endacc = ct.endsWith("Access");
        if(endacc || ct === 'SubRelative') {
            if(endacc) {
                const accessor: string = splitByCase(ct)[0];
                const cur: { type: string, val: string } = vals[relI++] as { type: string, val: string };
                if(cur.type === 'Literal') {
                    const node: relbase<Omit<Assign, "val"> & null> = { name: '' };
                    node.name = cur.val;
                    const possibleVal: Token = vals[relI++];
                    const possibleType: string = (vals[relI] ?? {type:''}).type;
                    const typebool = possibleType.slice(-8) === 'DataType';
                    const primbool = Primitives.includes(possibleVal.type) || possibleVal.type === 'Block';
                    if(primbool) {
                        node.value = (possibleVal as TokenValueNode<TokenType>).val || Parser((possibleVal as TokenMultiValueNode<TokenType>).vals);
                        if(typebool) node.dtype = { mainType: { m: possibleType.slice(0, -8), l: vals[relI].ln as number, c: vals[relI].col as number } };
                    } if(possibleVal.type.slice(-8) === 'DataType') {
                        node.dtype = { mainType: { m: possibleVal.type.slice(0, -8), l: possibleVal.ln as number, c: possibleVal.col as number } };
                        if(Primitives.includes(possibleType) || possibleType === 'Block') 
                            node.value = (vals[relI] as TokenValueNode<TokenType>).val || Parser((vals[relI] as TokenMultiValueNode<TokenType>).vals);
                    }
                    relative[accessor[0] === 'V' ? 'consts' : 'procs']?.push(node);
                }
            } else {
                const within: Token[] = (vals[relI - 1] as TokenMultiValueNode<TokenType>).vals;
                relative.subrels?.push(RelRec(within));
            }
        }
    }

    return relative;
}


function splitByCase(inp: string): string[] {
    return inp.split(/(?=[A-Z])(?<=[a-z])/g);
}

function Parser(lexer: Token[]): AST<TokenType>[] {

    function createEXPR(cpos: number, tokens = lexer): Expression {
        const finalExpr: Token[] = [];
        let i = cpos;
        let VFE = true;
        while(tokens[i] && FListFE.includes(tokens[i].type.toLowerCase())) {
            if(tokens[i - 1]?.type === 'Array' && VFE) VFE = false;
            const thing = VFE ? VListFE : OListFE;
            if(thing.includes(tokens[i].type.toLowerCase())) {
                finalExpr.push(tokens[i]);
            }
            VFE = !VFE;
            i++;
        }
        return finalExpr as Expression;
    }

    let lexerPos = 0;
    const output: AST<TokenType>[] = [];
    let curToken: Token = lexer[lexerPos];

    function EKT(complex: Token[]): Complex[] {
        const cur: Complex[] = [];
        function last<T>(e: T[]): T { return e.at(-1)!; }
        let i = 0;
        while(i < complex.length) {
            const ct: string = complex[i].type;
            if(ct.slice(-8) === 'DataType') {
                const otype: string = (complex[i - 1] && complex[i - 1].type === 'AtSymbol' ? '@' : '') + 
                ct.slice(0, -8) + (complex[i + 1] && complex[i + 1].type === 'QuestionMark' ? '?' : '');
                cur.push({ type: otype, ktypes: [], etypes: [] });
            } else if (ct === 'KineticTypeChain') {
                last(cur).ktypes?.push({t:''});
                const ktypemods = new Set(lookAheadObj(<unknown>complex as { [key: string]: string }[], ['type', 'KineticTypeValue'], i).map(e => e.type));
                const typeToMod: { [ k: string ]: string } = {
                    'QuestionMark': '?',
                    'Backslash': '\\'
                };
                for(const [ k, v ] of Object.entries(typeToMod)) 
                    if(ktypemods.has(k)) 
                        last(last(cur).ktypes!)!.t += v;
                i += ktypemods.size - 1;
            } else if (ct === 'KineticTypeValue') {
                last(last(cur).ktypes!)!.t += (<{ type: string, val: string }>complex[i]).val;
                if(complex[i + 1] && complex[i + 1].type === 'Block') {
                    last(last(cur).ktypes!)!.p = complex[i + 1].vals;
                }
            } else if (ct === 'TypeArray') 
                last(cur).etypes?.push(...EKT((<{ type: string, vals: Token[] }>complex[i]).vals));
            else if (ct === 'CurlyBlock') {
                const vals: Token[] = (<unknown>complex[i] as TokenMultiValueNode<TokenType>).vals;
                if(vals[0].vals)
                    last(cur).vfilter = vals.map(e => ({ [TokenType.Expr]: createEXPR(0, e.vals)}));
                else
                    last(cur).vfilter = [{ [TokenType.Expr]: createEXPR(0, vals) }];
            }
            i++;
        }
        return cur;
    }

    while(lexerPos < lexer.length && curToken.type !== 'ProgramExitCode0') {
        curToken = lexer[lexerPos++];

        if(splitByCase(curToken.type).find(e => ['and', 'or', 'inequal', 'equal', 'than', 'between', 'angle']
            .find(f => new RegExp(`^${f}`, 'i').test(e))))
            {
                output.push({ [TokenType.Logic]: curToken.type, l: curToken.ln as number, c: curToken.col as number });
            }
            
        else if(curToken.type === 'AssignmentOperator') {
            const ao: Assign = <Assign>{};
            const lmt: string[] = lexer.map(e => e.type);
            const bucket: string[] = lookBehindReg(lmt, /^(?:(?!(Delimeter|LineBreak)).)+/, lexerPos - 3);
            const part: Token[] = lexer.slice(lexerPos - 2 - bucket.length, lexerPos - 2);
            const ultimate: Complex[] = EKT(part);
            const laBucket: string[] = lookAheadReg(lmt, /^(?:(?!(Delimiter|LineBreak)).)+/, lexerPos);
            const dtypeI: number = bucket.findIndex(e => e.endsWith("DataType"));
            const dtype: string = (dtypeI > -1 ? bucket[dtypeI] : null) ?? '';

            if(ultimate.length > 1) excParse("MultiTypedVariable", [], part[0].ln as number, part[0].col as number);
            ao.ctype = { m: ultimate[0], l: lexer[bucket.length].ln as number, c: lexer[bucket.length].col as number };

            const name: TokenValueNode<TokenType> = (lexer[lexerPos - 2] as TokenValueNode<TokenType.Literal>);
            ao.name = { n: name.val, l: name.ln as number, c: name.col as number };

            const val: Expression = createEXPR(0, lexer.slice(lexerPos++, laBucket.length + lexerPos));
            ao.val = val;

            if(dtype === 'CodeMacroDataType') {
                if(val.length > 1) excParse("MacroExpression", [], val[0].ln as number, val[0].col as number);
                const cvals: Token[] = (val[0] as TokenMultiValueNode<TokenType.Cmacro>).vals;
                lexer.forEach((e, i, a) => {
                    if(i > lexerPos) if(e.type === 'MacroVar' && e.val === name.val) 
                        a.splice(i - 1, 2, ...MacroComb(a[i - 1], cvals[0]).concat(cvals.slice(1)));
                });
            }

            if(part.length > 0) {
                add({ name: name.val, pType: ao.ctype.m.type });
            }
            else {
                const [n, l, c] = [name.val, name.ln as number, name.col as number];
                if(!vcheck(n, l, c)) excParse("RequiredType", [n], l, c);
            }
            lexerPos += laBucket.length;
            output.push({
                [TokenType.Assign]: { ...ao, l: curToken.ln as number, c: curToken.col as number }
            });
        } else if (curToken.type === 'PrintOverride') {
            const lmt: string[] = lexer.map(e => e.type);
            const bucket: Token[] = lexer.slice(lexerPos, lexerPos + lookAheadReg(lmt, /^(?:(?!Delimiter|LineBreak).)+/, lexerPos).length);
            const args: ({ value: string | Expression } & LC)[] = [];
            const push = (v: string, cur: Token) =>
                args.push({ value: v, l: cur.ln as number, c: cur.col as number }); 

            for(const b of bucket) 
                if(b.type === 'Literal') 
                    push(vcheck(b.val, b.ln as number, b.col as number)?.name as string, b);
                else if (b.type === 'String')
                    push(`"${b.val}"`, b);
                else if (b.type === 'Character')
                    push(`'${b.val}'`, b);
                else if (b.type === 'Number' || b.type === 'Boolean' || b.type === 'Special')
                    push(b.val, b);
            lexerPos += bucket.length;
            output.push({
                [TokenType.PrOvd]: { 
                    args: args,
                    l: curToken.ln as number,
                    c: curToken.col as number
                }
            });
        } else if (curToken.type === 'IfStatement' || curToken.type === 'ElseIfStatement') {
            const e = curToken.type.includes('Else');
            const lmt: string[] = lexer.map(e => e.type);
            const lar: number = lexerPos + lookAheadReg(lmt, /^(?:(?!Block).)+/, lexerPos).length;
            const bucket: AST<TokenType>[] = Parser(lexer.slice(lexerPos, lar));
            lexerPos += bucket.length;
            add([]);
            scope++;
            output.push({
                [TokenType[`${e ? 'Else' : ''}If`]]: {
                    condition: bucket,
                    block: Parser((lexer[lar] as {type:'Block',vals:Token[]}).vals),
                    l: curToken.ln as number,
                    c: curToken.col as number
                }
            });
            invalidate();
        } else if (curToken.type === 'ElseStatement') {
            add([]);
            scope++;
            output.push({
                [TokenType.Else]: { 
                    block: Parser((lexer[lexerPos] as { type: 'Block', vals: Token[] }).vals),
                    l: curToken.ln as number,
                    c: curToken.col as number
                }
            });
            invalidate();
        } else if (curToken.type === 'RelativeCreation') {
            const relative: CustomRelative = <CustomRelative>{
                name: '',
                param: undefined,
                consts: [],
                procs: [],
                subrels: []
            };
            const vals: Token[] = (curToken as TokenMultiValueNode<TokenType.RelCreate>).vals;
            const first: Token = vals[0];
            if(first.type !== 'Literal') excParse("ExpectedToken", ['Literal', '::', first.type], first.ln as number, first.col as number, /\:/);
            else {
                relative.name = first.val;
                let relI = 2;
                if(vals[1].type === 'LeftAngleBracket') {
                    const param = lookAheadObj(vals as { type: string, val: string }[], ['type', 'RightAngleBracket'], relI);
                    relative.param = {
                        rtype: param[0].type.slice(0, -8),
                        name: param[1].val
                    }
                    relI += param.length;
                }
                while(relI < vals.length) {
                    const ct: string = vals[relI++].type;
                    const endacc = ct.endsWith("Access");
                    if(endacc || ct === 'SubRelative') {
                        if(endacc) {
                            const accessor: string = splitByCase(ct)[0];
                            const cur: { type: string, val: string } = vals[relI++] as { type: string, val: string };
                            if(cur.type === 'Literal') {
                                const node: relbase<Omit<Assign, "val"> | never> = { name: '', args: [] };
                                node.name = cur.val;
                                const possibleArgs: Token[] = vals[relI].type === 'LeftAngleBracket' ? lookAheadObj(vals, ['type', 'RightAngleBracket'], relI + 1) : [];
                                const args: Token[][] = possibleArgs.reduce((acc, v) => {
                                    if(v.type !== 'Separation') {
                                        acc[acc.length - 1].push(v);
                                    } else acc.push([]);
                                    return acc;
                                }, [[]] as Token[][]);
                                if(args.flat().length > 0) {
                                    for(const arg of args) 
                                        node.args?.push({ mainType: { m: arg[0].type.slice(0, -8) }, name: { n: arg.at(-1)?.val.slice(-8) as string } });
                                }
                                const possibleVal: Token = vals[relI+++possibleArgs.length+(args.flat().length ? 2 : 0)];
                                const possibleType: string = vals[relI].type;
                                const typebool = possibleType.slice(-8) === 'DataType';
                                const primbool = Primitives.includes(possibleVal.type) || possibleVal.type === 'Block';
                                if(primbool) {
                                    node.value = (possibleVal as TokenValueNode<TokenType>).val || Parser((possibleVal as TokenMultiValueNode<TokenType>).vals);
                                    if(typebool) node.dtype = { mainType: { m: possibleType.slice(0, -8), l: vals[relI].ln as number, c: vals[relI].col as number } };
                                } if(possibleVal.type.slice(-8) === 'DataType') {
                                    node.dtype = { mainType: { m: possibleVal.type.slice(0, -8), l: possibleVal.ln as number, c: possibleVal.col as number } };
                                    if(Primitives.includes(possibleType) || possibleType === 'Block') 
                                        node.value = (vals[relI] as TokenValueNode<TokenType>).val || Parser((vals[relI] as TokenMultiValueNode<TokenType>).vals);
                                }
                                relative[accessor[0] === 'V' ? 'consts' : 'procs']?.push(node);
                            }
                        } else {
                            const within: Token[] = (vals[relI-1] as TokenMultiValueNode<TokenType>).vals;
                            relative.subrels?.push(RelRec(within));
                        }
                    }
                }

                relI++;
            }
            output.push({ [TokenType.CustRel]: { ...relative, l: curToken.ln as number, c: curToken.col as number }  });
        } else if (['Number', 'String', 'Character', 'Boolean', 'Literal']
            .includes(curToken.type) && 'val' in curToken) {
            if(lexer[lexerPos]?.type !== 'AssignmentOperator') {
                output.push({ [curToken.type]: curToken.val, l: curToken.ln as number, c: curToken.col as number });
            }
        } else if (curToken.type === 'ForLoop') {
            const forArgs: Token[] = lookAheadObj(lexer, ["type", "Block"], lexerPos);
            add([]);
            scope++;
            const action: AST<TokenType>[] = Parser(
                (lexer[lexerPos + forArgs.length] as TokenMultiValueNode<TokenType.Block>).vals
            );
            if(forArgs.length === 1) {
                const f0 = forArgs[0];
                if((f0.type === 'Number' && !(f0.val.includes(".") || f0.val.startsWith("-"))) || f0.type === 'Literal')
                output.push({ [TokenType.ForLoop]: {
                    iters: f0.val,
                    action,
                    l: curToken.ln as number,
                    c: curToken.col as number
                } });
                
                else excParse("InvalidForIteration", [], f0.ln as number, f0.col as number);
            } else if (forArgs.length === 2) {
                const [name, iters] = [forArgs[0], forArgs[1]].map(e => e as TokenValueNode<TokenType>);
                output.push({ [TokenType.ForLoop]: {
                    iters: iters.val,
                    name: name.val,
                    action,
                    l: curToken.ln as number,
                    c: curToken.col as number
                } });
            }
            invalidate();
            lexerPos += forArgs.length + 1;
        }
    }
    return output;
}

export const _AST: AST<TokenType>[] = Parser(lexed);
export default variables;
