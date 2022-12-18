import { lexed, CODE, Lexer } from "./lexer.ts";
import type { Assign, Token, TokenNode, AST, TokenValueNode, TokenMultiValueNode, CustomRelative, relbase, Expression, LC } from "../misc/general/tokens.ts";
import { TokenType, Nested, MultiTypes, Null, Types, valToType, Primitives, FListFE, VListFE, OListFE } from "../misc/general/tokens.ts";
import { lookAheadStr, lookAheadReg, lookBehindReg } from "../misc/general/looks.ts";
import { exception, Exceptions } from "../misc/exceptions.ts";
import { NthD } from "../misc/general/tokens.ts";

function excParse(t: keyof typeof Exceptions, args: string[], l: number, c: number): void {
    exception(t, args, l, c, CODE, 'Pars');
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
    function createEXPR(cpos: number): Expression {
        const finalExpr: Token[] = [];
        const ctoken: Token = lexer[cpos];
        if(VListFE.includes(ctoken.type)) {
            let i = 0;
            while(FListFE.includes(lexer[++cpos].type)) 
            if(!(i & 1))
                finalExpr.push(lexer[cpos]);
        }
        return finalExpr as Expression;
    }

    let lexerPos = 0;
    const output: AST<TokenType>[] = [];
    let curToken: Token = lexer[lexerPos];

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
            const bucket: string[] = lookBehindReg(lmt, /^(?:(?!(Delimeter|LineBreak)).)+/, lexerPos - 2);

            const laBucket: string[] = lookAheadReg(lmt, /^(?:(?!(Delimiter|LineBreak)).)+/, lexerPos);

            const dtypeI: number = bucket.findIndex(e => e.endsWith("DataType"));
            const dtype: string = (dtypeI > -1 ? bucket[dtypeI] : null) ?? '';

            ao.mainType = {m:dtype.slice(0, -8),l:lexer[lexerPos-2+bucket.length].ln as number,c:lexer[lexerPos-2+bucket.length].col as number};
            const name = (lexer.slice(lexerPos - bucket.length - (ao.mainType.m ? 0 : 1), lexerPos).find(e => e.type === 'Literal') as { type:string, val:string, ln:number, col:number });
            ao.name = {n:name.val,l:name.ln,c:name.col};
            const val = lexer.slice(lexerPos++, laBucket.length + lexerPos).find(e => e.type === laBucket[0]);
            ao.val = <Token>val;

            if(dtype === 'CodeMacroDataType') {
                const cvals: Token[] = (val as TokenMultiValueNode<TokenType.Cmacro>).vals;
                lexer.forEach((e, i, a) => {
                    if(i > lexerPos) if(e.type === 'MacroVar' && e.val === name.val) 
                        a.splice(i - 1, 2, ...MacroComb(a[i - 1], cvals[0]).concat(cvals.slice(1)));
                });
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
                    push(b.val + ".value", b);
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
            output.push({
                [TokenType[`${e ? 'Else' : ''}If`]]: {
                    condition: bucket,
                    block: Parser((lexer[lar] as {type:'Block',vals:Token[]}).vals),
                    l: curToken.ln as number,
                    c: curToken.col as number
                }
            });
        } else if (curToken.type === 'ElseStatement') {
            output.push({
                [TokenType.Else]: { 
                    block: Parser((lexer[lexerPos] as { type: 'Block', vals: Token[] }).vals),
                    l: curToken.ln as number,
                    c: curToken.col as number
                }
            });
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
            if(first.type !== 'Literal') excParse("ExpectedToken", ['Literal', '::', first.type], first.ln as number, first.col as number);
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
        } else if (curToken.type === 'ExpungeVariableFromMemory') {  
            const lmt: string[] = lexer.map(e => e.type);
            const bucket: Token[] = lexer.slice(lexerPos, lexerPos + lookAheadReg(lmt, /^(?:(?!Delimiter|LineBreak).)+/, lexerPos).length);
            const args: ({ value: string } & LC)[] = [];
            for(const e of bucket) 
                if(e.type !== 'Literal') 
                    excParse("UnexpectedArgument", ['Variable', e.type], e.ln as number, e.col as number);
                else
                    args.push({ value: e.val, l: e.ln as number, c: e.col as number });
            output.push({ [TokenType.EPG]: { 
                args,
                l: curToken.ln as number,
                c: curToken.col as number
            } });
            lexerPos += bucket.length;
        } else if (curToken.type === 'ForLoop') {
            const forArgs: Token[] = lookAheadObj(lexer, ["type", "Block"], lexerPos);
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
            lexerPos += forArgs.length + 1;
        }
    }
    return output;
}

export const _AST: AST<TokenType>[] = Parser(lexed);
console.log('\n' + new Array(100).fill("-").join('') + '\n\n');
console.log("\nParser:");
console.dir(_AST, { depth: Infinity });
