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
} export function lookAheadObj<T extends { [key: string]: string }>(mainObj: T[], prop: [string, string], curPos: number): T[] {
    if(!(prop[0] in mainObj[0]) || typeof mainObj[0][prop[0]] !== 'string') throw Error("Property is invalid");
    const bucket: T[] = [];
    while(true) {
        const nextIx: number = curPos + bucket.length;
        const nextToken: T = mainObj[nextIx];
        if(!nextToken) break;

        if(prop[1] && prop[1] === nextToken[prop[0]]) break;
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
