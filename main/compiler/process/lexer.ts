import type { Token, NthD } from "../misc/general/tokens.ts";
import { TOKENMAP, TokenType, ktypes, mods } from "../misc/general/tokens.ts";
import { lookAheadStr, lookAheadReg, lookBehindReg } from "../misc/general/looks.ts";
import { exception, Exceptions } from "../misc/exceptions.ts";

export const fname = `${Deno.args[0]}.bytl`;
export const CODE = new TextDecoder('utf-8').decode(await Deno.readFile(fname));
const lines: string[] = CODE.split(/\r|\n\r?/);

let inRelCrt = false;
let ln = 1;
let col = 1;
export function Lexer(code: string) : Token[] {
    function excLex(t: keyof typeof Exceptions, args: string[], l: number, c: number, rgx = /[^\W_]/): void {
        exception(t, args, l, c, code, 'Lex', rgx);
    }
    const macros: string[] = [];
    const output: Token[] = [];
    let curPos = 0;
    function cadd(val: number): void { curPos += val; col += val; }

    const valTokens: string[][] = [['String', `"`], ['Char', `'`]];
    const valsTokens: string[][] = [['Array', `[`]];
    const voidTokens: string[][] = [];
    const ignoreTokens: string[][] = [];

    function nested(opening: string, closing: string, addToCurPos: (value: number) => void, propName: 'Array' | 'Block' | 'EBlock' | 'CurlyBlock' | 'SubRel' | 'TypeArr'): void {
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

    function special(name: 'RegExp' | 'Cmacro') {
        cadd(2);
        const bucket: string[] = lookAheadReg(code, /(?<=\\)\}|[^}]/, curPos);
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
        if(lines[ln - 1] + lines[ln] === '') { ln += 2; continue; }

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
            const os0: string = (output[output.length - 1] ?? {type:''}).type;
            const type = os0 !== 'KineticTypeValue' && os0.slice(-8) !== 'DataType' ? 'Array' : 'TypeArr';
            cadd(1);
            nested('[', ']', cadd, type);
            continue;
        } else if (curToken === `(`) {
            cadd(1);
            if(output[output.length - 1] && output[output.length - 1].type === 'Backslash') {
                output.pop();
                nested('(', ')', cadd, 'EBlock');
            } else nested('(', ')', cadd, 'Block');
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
            if(code[curPos] !== `{`) nested('{', '}', cadd, 'CurlyBlock');
            else {
                const bucket1 = lookAheadReg(code, /[^\}]/, curPos);
                const bucket2 = lookAheadReg(code, /[^\}]/, curPos + bucket1.length + 1);
                const mod = bucket1.slice(1).join('').trim();
                if(!mods.includes(mod.toLowerCase())) excLex("InexistentMod", [mod], ln, col + 1);
                if(mod.toUpperCase() !== mod) excLex("InvalidModCase", [], ln, col + 1);
                if(code[curPos + bucket1.length + 1] === `}`) {
                    output.push({
                        type: TokenType.Mod,
                        val: mod,
                        ln, col
                    });
                    
                } else {
                    output.push({
                        type: TokenType.Mod,
                        vals: Lexer(bucket2.join('')),
                        ln, col
                    })
                }
                cadd(bucket1.length + bucket2.length + 2);
            }
            continue;
        } else if (curToken === 'r' && code[curPos + 1] === '{') {
            special('RegExp');
            continue;
        } else if (curToken === 'c' && code[curPos + 1] === '{') {
            if(output[output.length - 1] && output[output.length - 1].type === 'AssignmentOperator') {
                const secondLast: Token = output[output.length - 2];
                if(secondLast.type === 'Literal')
                    macros.push(secondLast.val)
            }
            special('Cmacro');
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
        } else if (curToken === '$' && code[curPos + 1] && /[a-zA-Z]/.test(code[curPos + 1])) {
            const refName: string = lookAheadReg(code, /[^\W]/, curPos + 1).join('');
            output.push({
                type: TokenType.Ref,
                val: refName,
                ln, col
            });
            cadd(refName.length + 2);
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

        const numRegex = /\d/;
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
                const toDot: string = lookBehindReg(code, /[^.]/, curPos - 1).join('');
                const dot: boolean = /^[?\\]+$|^$/g.test(toDot);
                if(dot && !ktypes.includes(bucket)) excLex("InexistentKtype", [bucket], ln, col - 1, /[^\s{\[\]]/);
                if(bucket.length > 0) output.push({
                    type: TokenType[dot ? "KtypeVal" : "Literal"],
                    val: bucket,
                    ln, col
                });
            }
            
            cadd(bucket.length);
            continue;
        } else if (numRegex.test(curToken)) {
            const bucket = lookAheadReg(code, numRegex, curPos, numRegexNext).join('');
            const [count, char] = output[output.length - 1] && output[output.length - 1].type === 'Hyphen' ? [1, '-'] : [0, ''];
            output.splice(output.length - count, count, {
                type: TokenType.Number,
                val: char + bucket,
                ln, col
            });

            cadd(bucket.length);
            continue;
        }
        
        if(match) continue;
        throw new Error(`Unknown input character: ${curToken.charCodeAt(0) + ` = '${curToken}'`} at "${code.slice(curPos - 10,curPos)}"`);
    }

    return output.filter(e => e.type !== 'Space');
}

export const lexed = Lexer(CODE.replace(/\r|^\n$/gm, ''));
