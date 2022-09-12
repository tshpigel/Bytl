import lexed from "./lexer.ts";
import type { Assign, Token, AST, TokenValueNode } from "../misc/general/tokens.ts";
import { TokenType, Nested, MultiTypes } from "../misc/general/tokens.ts";
import { lookAheadStr, lookAheadReg, lookBehindReg } from "../misc/general/looks.ts";
import { NthD } from "../misc/general/tokens.ts";

function Parser(lexer: Token[]): AST<TokenType>[] {
    let lexerPos: number = 0;
    const output: AST<TokenType>[] = [];
    let curToken: Token = lexer[lexerPos];

    function SktypesAssign(part: Token[]): Nested {
        const sktypes: Nested = {
            mainKtypes: [] as string[],
            subAndKtypes: []
        };
        let curArr: [string, string[]] = ["", []];
        let curType: string = "";
        let multi: boolean = false;
        let sub: boolean = false;
        let idx: number = -1;
        for(const p of part) {
            idx++;
            if(p.type.slice(-8) === 'DataType') curArr[0] = p.type.slice(0, -8);
            if(MultiTypes.includes(p.type) && !(!!sktypes.mainKtypes[0] || !!sktypes.subAndKtypes[0])) {
                multi = true;
                continue;
            } else if (!MultiTypes.includes(p.type) && p.type.slice(-8) === 'DataType') 
                idx === part.length - 1 
                ?sktypes.subAndKtypes.push([p.type, []]) 
                :multi = false;
            else if (MultiTypes.includes(p.type) && (!!sktypes.mainKtypes[0] || !!sktypes.subAndKtypes[0])) {
                const rec: Nested = SktypesAssign(part.slice(idx, part.length));
                console.log(rec);
                sktypes.subAndKtypes.push([p.type.slice(0, -8), rec]);
            }
            if(p.type === 'Hyphen') sub = true;
            if(p.type === 'Separation') {
                sktypes.subAndKtypes.push(curArr);
                curArr = ["", []];
            }
            if(p.type === 'KineticTypeValue') {
                if(multi) {
                    sktypes.mainKtypes.push(p.val);
                } else {
                    if(!curArr[0]) curArr[0] = curType.slice(0, -8);
                    curArr[1].push(p.val);
                    if(sub) sktypes.subAndKtypes.push(curArr);
                }
            } 
        }

        return sktypes;
    }

    while(lexerPos < lexer.length || curToken.type === 'ProgramExitCode0') {
        curToken = lexer[lexerPos++];
        if(curToken.type === 'AssignmentOperator') {
            const ao: Assign = <Assign>{};
            //const sktypes: Nested = <Nested>{};
            const lmt: string[] = lexer.map(e => e.type);
            const bucket: string[] = lookBehindReg(lmt, /^(?:(?!(LineEnder|LineBreak)).)+/, lexerPos - 2);
            let i = -1;
            const part: Token[] = [];
            while(bucket[++i] !== 'Literal') {
                part.push(lexer[lexerPos + i - bucket.length - 1]);
            }
            //const s: Nested = SktypesAssign(part);
            //console.log(s);
            const laBucket: string[] = lookAheadReg(lmt, /^(?:(?!(LineEnder|LineBreak)).)+/, lexerPos);

            ao.mainType = bucket.find(e => e.endsWith("DataType"))!.slice(0, -8);
            ao.name = lexer.slice(lexerPos - bucket.length, lexerPos).find(e => e.type === 'Literal')?.val;
            ao.val = lexer.slice(lexerPos++, laBucket.length + lexerPos).find(e => e.type === laBucket[0]);

            // ao.mainKtypes = lexer.slice(lexerPos - bucket.length, lexerPos).filter(e => e.type === 'KineticTypeValue').map(e => e.val);
            output.push({
                [TokenType.Assign]: ao
            });
        } else if(curToken.type === 'Exit') {
            const lmt: string[] = lexer.map(e => e.type);
            const bucket: Token[] = lexer.slice(lexerPos, lexerPos + lookAheadReg(lmt, /^(?:(?!LineEnder).)+/, lexerPos).length);
            const args: string[] = [];
            for(const b of bucket) {
                if(b.type === 'Literal') {
                    args.push(b.val + ".value");
                }
            }
            output.push({
                [TokenType.Exit]: { 
                    args: args
                }
            });
        }
    }
    return output;
}

//console.log("Lexer:\n");
//console.dir(lexed, { depth: Infinity });
//console.log(new Array(100).fill("-").join('') + '\n\n');
//console.log("Parser:\n");

export const _AST: AST<TokenType>[] = Parser(lexed);
//console.dir(_AST, { depth: Infinity });
