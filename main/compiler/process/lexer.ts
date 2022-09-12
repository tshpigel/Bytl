import type { Token, NthD } from "../misc/general/tokens.ts";
import { TOKENMAP, TokenType } from "../misc/general/tokens.ts";
import { lookAheadStr, lookAheadReg } from "../misc/general/looks.ts" 

export function Lexer(code: string) : Token[] {
    const output: Token[] = [];
    let curPos: number = 0;

    const valTokens: string[][] = [['String', `"`], ['Char', `'`]];
    const valsTokens: string[][] = [['Array', `[`]];
    const voidTokens: string[][] = [];
    const ignoreTokens: string[][] = [];

    while(curPos < code.length) {
        const curToken = code[curPos];
        if(curToken === ' ') {
            curPos++;
            continue;
        } 
        
        else if (curToken === `"`) {
            curPos++;
            const bucket = lookAheadReg(code, /[^"]/, curPos);
            output.push({
                type: TokenType.String,
                val: bucket.join('')
            });

            curPos += bucket.length + 1;
            continue;
        } else if (curToken === `'`) {
            curPos++;
            const bucket = lookAheadReg(code, /[^']/, curPos);
            output.push({
                type: TokenType.Char,
                val: bucket.join('')
            });
            curPos += bucket.length + 1;
            continue;
        } else if ([curToken, code[curPos + 1]].every(e => e === `_`)) {
            curPos += 2; 
            const bucket = lookAheadReg(code, /[^\n]/, curPos);
            curPos += bucket.length + 1;
            continue;
        } else if (curToken === `[`) {
            curPos++;
            const bucket = lookAheadReg(code, /[^\]]/, curPos);
            const bi: number = bucket.indexOf(`[`);
            if(bi > -1) {
                let nestCount = 1;
                const nestIndex: number[] = [];
                while(nestCount > 0 && curPos < code.length) {
                    if(code[curPos] === `[`) {
                        nestCount++;
                        nestIndex.push(curPos);
                    } else if (code[curPos] === `]`) {
                        nestIndex.push(curPos);
                        nestCount--;
                    } 
                    curPos++;
                }
                const cni: number[] = [nestIndex[0], nestIndex.slice(-1)[0]];
                output.push({
                    type: TokenType.Array,
                    vals: Lexer(code.slice(cni[0], cni[1]))
                })
                continue;
            } else {
                output.push({
                    type: TokenType.Array,
                    vals: Lexer(bucket.join(''))
                });
                curPos += bucket.length + 1;
                continue;
            }
        } else if (curToken === `(`) {
            curPos++;
            const bucket = lookAheadReg(code, /[^\)]/, curPos);
            const bi: number = bucket.indexOf(`(`);
            if(bi > -1) {
                let nestCount = 1;
                const nestIndex: number[] = [];
                while(nestCount > 0 && curPos < code.length) {
                    if(code[curPos] === `(`) {
                        nestCount++;
                        nestIndex.push(curPos);
                    } else if (code[curPos] === `)`) {
                        nestIndex.push(curPos);
                        nestCount--;
                    } 
                    curPos++;
                }
                const cni: number[] = [nestIndex[0], nestIndex.slice(-1)[0]];
                output.push({
                    type: TokenType.Block,
                    vals: Lexer(code.slice(cni[0], cni[1]))
                })
                continue;
            } else {
                output.push({
                    type: TokenType.Block,
                    vals: Lexer(bucket.join(''))
                });
                curPos += bucket.length + 1;
                continue;
            }
        } else if (curToken === `/`) {
            curPos++;
            const bucket = lookAheadReg(code, /[^\\]/, curPos);
            curPos += bucket.length + 1;
            continue;
        } else if (curToken === `{`) {
            curPos++;
            const bucket = lookAheadReg(code, /[^\}]/, curPos);
            if(code[curPos] !== `{`) {
                const bi: number = bucket.indexOf(`{`);
                if(bi > -1) {
                    let nestCount = 1;
                    const nestIndex: number[] = [];
                    while(nestCount > 0 && curPos < code.length) {
                        if(code[curPos] === `{`) {
                            nestCount++;
                            nestIndex.push(curPos);
                        } else if (code[curPos] === `}`) {
                            nestIndex.push(curPos);
                            nestCount--;
                        } 
                        curPos++;
                    }
                    const cni: number[] = [nestIndex[0], nestIndex.slice(-1)[0]];
                    output.push({
                        type: TokenType.CurlyBlock,
                        vals: Lexer(code.slice(cni[0], cni[1]))
                    })
                    continue;
                } else {
                    output.push({
                        type: TokenType.CurlyBlock,
                        vals: Lexer(bucket.join(''))
                    });
                    curPos += bucket.length + 1;
                    continue;
                }
            } else {
                if(code[curPos + bucket.length + 1] === `}`) {
                    output.push({
                        type: TokenType.Mod,
                        val: bucket.slice(1).join('').trim()
                    });
                    curPos += bucket.length + 2;
                }
            }
            continue;
        }

        let match: boolean = false;
        for(const { key, val } of TOKENMAP) {
            if(!lookAheadStr(code, key, curPos)) continue;
            if(/[a-zA-Z]/.test(key) && lookAheadReg(code, /[a-zA-Z]/, curPos).join('') !== key) continue;

            output.push(val as Token);
            curPos += key.length;
            match = true;
        }

        const litRegex = /[a-zA-Z]/;
        const litRegexNext = /[a-zA-Z0-9]/;

        const numRegex = /\d/;
        const numRegexNext = /\d|\./;
        if(litRegex.test(curToken)) {
            const bucket = lookAheadReg(code, litRegex, curPos, litRegexNext);
            const c1 = code[curPos - 1];
            output.push({
                type: TokenType[c1 === `.` ? "KtypeVal" : "Literal"],
                val: bucket.join('')
            });

            curPos += bucket.length;
            continue;
        } else if (numRegex.test(curToken)) {
            const bucket = lookAheadReg(code, numRegex, curPos, numRegexNext);
            output.push({
                type: TokenType.Number,
                val: bucket.join('')
            });

            curPos += bucket.length;
            continue;
        }

        if(match) continue;
        throw new Error(`Unknown input character: ${curToken.charCodeAt(0) + ` = ${curToken}`}`);
    }

    const newO = output.filter(e => (e.type === 'Literal' && e.val.length > 0) || e.type != 'Literal');
    return newO;
}

const CODE = new TextDecoder('utf-8').decode(await Deno.readFile(`${Deno.args[0]}.bytl`)).replace(/\r/g, '')
const lexed = Lexer(CODE);

export default lexed;
