import { Token } from "./tokens.ts"

export function lookAheadReg(code: string | string[], match: RegExp, curPos: number, matchNext?: RegExp): string[] {
    const bucket: string[] = [];
    while(true) {
        const nextIx: number = curPos + bucket.length;
        const nextToken: string = code[nextIx];
        if(!nextToken) break;

        let m: string | RegExp = match;
        if(matchNext && bucket.length) m = matchNext;
        if(m && !m.test(nextToken)) break;
        bucket.push(nextToken);
    }

    return bucket;
} export function lookAheadStr(code: string, s: string, curPos: number): boolean {
    return code.slice(curPos, curPos + s.length) === s;
} export function lookBehindReg(lexerOrCode: string | string[], match: RegExp, curPos: number, matchNext?: RegExp): string[] {
    const bucket: string[] = [];
    while(true) {
        const prevIx: number = curPos - bucket.length;
        const prevToken: string = lexerOrCode[prevIx];
        if(!prevToken) break;

        let m: string | RegExp = match;
        if(matchNext && bucket.length) m = matchNext;
        if(m && !m.test(prevToken)) break;
        bucket.push(prevToken);
    }

    return bucket.reverse();
}