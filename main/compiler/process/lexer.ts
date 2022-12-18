import type { Token, NthD } from "../misc/general/tokens.ts";
import { TOKENMAP, TokenType, ktypes, mods } from "../misc/general/tokens.ts";
import { lookAheadStr, lookAheadReg, lookBehindReg } from "../misc/general/looks.ts";
import { exception, Exceptions } from "../misc/exceptions.ts";

export const fname = `${Deno.args[0]}.bytl`;

let inRelCrt = false;
let ln = 1;
let col = 1;
export function Lexer(code: string) : Token[] {
    function excLex(t: keyof typeof Exceptions, args: string[], l: number, c: number): void {
        exception(t, args, l, c, code, 'Lex');
    }
    const macros: string[] = [];
    const output: Token[] = [];
    let curPos = 0;
    function cadd(val: number): void { curPos += val; col += val; }

    const valTokens: string[][] = [['String', `"`], ['Char', `'`]];
    const valsTokens: string[][] = [['Array', `[`]];
    const voidTokens: string[][] = [];
    const ignoreTokens: string[][] = [];

    function nested(opening: string, closing: string, addToCurPos: (value: number) => void, propName: 'Array' | 'Block' | 'EBlock' | 'CurlyBlock' | 'SubRel' | 'SupPrec' | 'InfPrec'): void {
        const bucket = lookAheadReg(code, new RegExp(`[^\\${closing}]`), curPos);
        const bi: number = bucket.indexOf(opening);
        if(bi > -1 && opening !== "") {
            let nestCount = 1;
            const nestIndex: number[] = [];
            while(nestCount > 0 && curPos < code.length) {
                if(code[curPos] === opening) {
                    nestCount++;
                    nestIndex.push(curPos);
                } else if (code[curPos] === closing) {
                    nestIndex.push(curPos);
                    nestCount--;
                }
                addToCurPos(1);
            }
            const cni: number[] = [nestIndex[0], nestIndex.slice(-1)[0]];
            //console.log(code.slice(cni[0] - lookBehindReg(code, new RegExp(`[^\\${opening}]`), cni[0]).length, cni[1]), nestIndex);
            output.push({
                type: TokenType[propName],
                vals: Lexer(code.slice(cni[0] - lookBehindReg(code, new RegExp(`[^\\${opening}]`), cni[0] - 1).length, cni[1])),
                ln, col
            });
        } else {
            output.push({
                type: TokenType[propName],
                vals: Lexer(bucket.join('')),
                ln, col
            });
            addToCurPos(bucket.length + 1);
        }
    }

    function context(name: 'RegExp' | 'Cmacro') {
        cadd(2);
        const bucket: string[] = lookAheadReg(code, /(?<=\\);|[^;]/, curPos);
        if(name === 'RegExp')
            output.push({
                type: TokenType.RegExp,
                val: bucket.join('').trim(),
                ln, col
            });
        else if (name === 'Cmacro') 
            output.push({
                type: TokenType.Cmacro,
                vals: Lexer(bucket.join('').trim()),
                ln, col
            })
        cadd(bucket.length + 1);
    }

    while(curPos < code.length) {
        const EOF = !code[curPos];
        const curToken = code[curPos];
        if(curToken === ' ' && curToken + code.slice(curPos, curPos + 2) !== '   ') {
            cadd(1);
            continue;
        } 
        
        else if (curToken === `"`) {
            cadd(1);
            const bucket = lookAheadReg(code, /[^"]/, curPos);
            output.push({
                type: TokenType.String,
                val: bucket.join(''),
                ln, col
            });

            cadd(bucket.length + 1);
            continue;
        } else if (curToken === `'`) {
            cadd(1);
            const bucket = lookAheadReg(code, /[^']/, curPos);
            output.push({
                type: TokenType.Char,
                val: bucket.join(''),
                ln, col
            });
            cadd(bucket.length + 1);
            continue;
        } else if ([curToken, code[curPos + 1]].every(e => e === `_`)) {
            cadd(2); 
            const bucket = lookAheadReg(code, /[^\n]/, curPos);
            cadd(bucket.length + 1);
            ln++; col = 1;
            continue;
        } else if (curToken === `[`) {
            const os0: string = (output.slice(-1)[0] ?? {type:''}).type;
            if(os0 !== 'KineticTypeValue' && os0.slice(-8) !== 'DataType') {
                cadd(1);
                nested('[', ']', cadd, 'Array');
                continue;
            }
        } else if (curToken === `(`) {
            cadd(1);
            const bucket: string = lookAheadReg(code, /[^}]/, curPos).join('');
            if(bucket.includes(')')) {
                if(output[output.length - 1].type === 'Backslash') {
                    output.pop();
                    nested('(', ')', cadd, 'EBlock');
                }
                else nested('(', ')', cadd, 'Block');
            }
            else nested('(', '}', cadd, "SupPrec");/*{
                output.push({
                    type: TokenType.SupPrec,
                    vals: Lexer(bucket),
                    ln, col: col - 1 || 1
                });
                cadd(bucket.length + 1);
            }*/
            continue;
        } else if (curToken === `!` && code[curPos + 1] === `@`) {
            cadd(2);
            let matched = false;
            while(curPos < code.length && !matched) {
                cadd(1);
                if(code[curPos] === '\n') { ln++; col = 1;}
                else if(code[curPos] === `@` && code[curPos + 1] === `!`) {
                    matched = true;
                    cadd(2);
                }
            }
            continue;
        } else if (curToken === `{`) {
            cadd(1);
            if(code[curPos] !== `{`) {
                const bucket: string = lookAheadReg(code, /[^)]/, curPos).join('');
                if(bucket.includes('}')) nested('{', '}', () => curPos, 'CurlyBlock');
                else output.push({
                    type: TokenType.InfPrec,
                    vals: Lexer(bucket),
                    ln, col: col - 1 || 1
                });
                cadd(bucket.length + 1);
            } else {
                const bucket = lookAheadReg(code, /[^\}]/, curPos);
                const mod = bucket.slice(1).join('').trim();
                if(!mods.includes(mod.toLowerCase())) excLex("InexistentMod", [mod], ln, col + 1);
                if(mod.toUpperCase() !== mod) excLex("InvalidModCase", [], ln, col + 1);
                if(code[curPos + bucket.length + 1] === `}`) {
                    output.push({
                        type: TokenType.Mod,
                        val: mod,
                        ln, col
                    });
                    cadd(bucket.length + 2);
                }
            }
            continue;
        } else if (curToken === ';' && code[curPos + 1] === 'r') {
            context('RegExp');
            continue;
        } else if (curToken === ';' && code[curPos + 1] === 'c') {
            if(output[output.length - 1].type === 'AssignmentOperator') {
                const secondLast: Token = output[output.length - 2];
                if(secondLast.type === 'Literal')
                    macros.push(secondLast.val)
            }
            context('Cmacro');
            continue;
        } else if (curToken === ':' && inRelCrt) {
            cadd(1);
            nested(":", ";", cadd, 'SubRel');
            continue;
        } else if (curToken === ':' && code[curPos + 1] === ':') {
            cadd(2);
            const bucket: string[] = [];
            inRelCrt = true;
            while(code.slice(curPos, curPos + 2) !== "::" && !EOF) {
                bucket.push(code[curPos]);
                cadd(1);
            }
            output.push({
                type: TokenType.RelCreate,
                vals: Lexer(bucket.join('')),
                ln, col
            });
            cadd(2);
            inRelCrt = false;
            continue;
        } 

        let match = false;

        for(const { key, val } of TOKENMAP) {
            if(!lookAheadStr(code, key, curPos)) continue;
            if(/[a-zA-Z]/.test(key) && lookAheadReg(code, /[a-zA-Z]/, curPos).join('') !== key) continue;
            
            output.push({
                ...val as Token,
                ln, col
            });
            cadd(key.length);
            if(key === '\n') { ln++; col = 1; }
            match = true;
        }

        const litRegex = /[a-zA-Z]/;
        const litRegexNext = /[a-zA-Z0-9]/;

        const numRegex = /\d|-/;
        const numRegexNext = /\d|\./;
        if(litRegex.test(curToken)) {
            const bucket = lookAheadReg(code, litRegex, curPos, litRegexNext).join('');
            if(['true', 'false'].includes(bucket)) {
                output.push({
                    type: TokenType.Bool,
                    val: bucket,
                    ln, col
                });
            } else if (macros.includes(bucket)) {
                output.push({
                    type: TokenType.MacVar,
                    val: bucket,
                    ln, col
                });
            } else if (bucket === 'nil') {
                output.push({
                    type: TokenType.Special,
                    val: bucket,
                    ln, col
                })
            } else {
                const c1 = code[curPos - 1];
                const c2 = code[curPos - 2];
                const dot: boolean = c2 + c1 === `.\\` || c1 === `.`;
                if(dot && !ktypes.includes(bucket)) excLex("InexistentKtype", [bucket], ln, col - 1);
                if(bucket.length > 0) output.push({
                    type: TokenType[dot ? "KtypeVal" : "Literal"],
                    val: bucket,
                    ln, col
                });
            }
            
            cadd(bucket.length);
            continue;
        } else if (numRegex.test(curToken)) {
            const bucket = lookAheadReg(code, numRegex, curPos, numRegexNext);
            if(output[output.length - 1].type === 'Hyphen') output.splice(output.length - 1, 1, {
                type: TokenType.Number,
                val: "-" + bucket.join(''),
                ln, col
            }); else output.push({
                type: TokenType.Number,
                val: bucket.join(''),
                ln, col
            });

            cadd(bucket.length);
            continue;
        }
        
        if(match) continue;
        throw new Error(`Unknown input character: ${curToken.charCodeAt(0) + ` = '${curToken}'`} at "${code.slice(0,curPos)}"`);
    }

    return output.filter(e => e.type !== 'Space');
}

export const CODE = new TextDecoder('utf-8').decode(await Deno.readFile('test.bytl')).replace(/\r|^\n$/gm, '');
export const lexed = Lexer(CODE);

console.log("Lexer:");
console.dir(lexed, { depth: Infinity });
