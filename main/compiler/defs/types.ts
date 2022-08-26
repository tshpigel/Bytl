import { Null } from "../tokens.ts";

/* 
    Numbers
*/

export interface Num {
    __type: 'Number' | 'Integer' | 'Decimal',
    readonly value: number | "Error" | string
} export interface Int extends Num {__type:'Integer'}
export interface Dec extends Num {__type:'Decimal'}
export const IntConstruct = (n: Num): Int => {
    const an: number = <number>n.value;
    return {
        __type: 'Integer',
        value: an % 1 == 0 ? an : "Error"
    }
}; export const DecConstruct = (n: Num): Dec => {
    const an: number = <number>n.value;
    return {
        __type: 'Decimal',
        value: an % 1 == 0 ? an.toFixed(1) : an
    }
}


/*

    Strings

*/

export interface Sc {
    __type: 'String' | 'Character',
    readonly value: string | 'Error'
} export interface Char extends Sc {__type:'Character'}
export const CharConstruct = (s: Sc): Char => {
    const asc: string = s.value;
    return {
        __type: 'Character',
        value: asc.length > 1 ? 'Error' : asc
    };
};


/*
    Booleans
*/

export interface Bool {
    __type: 'Boolean',
    readonly value: boolean
} 


/*
    Nil
*/

export interface Nil {
    __type: 'Nil',
    readonly value: null | undefined | never | 'Nil'
}


/*
    Procedures
*/

type proc = (...args: Val[]) => Val | void;
export interface Proc {
    __type: 'Procedure' | 'Function' | 'Algorithm',
    readonly __void?: boolean,
    readonly __return?: boolean,
    readonly value: proc | 'Error'
} export interface Fnc extends Proc {__type:'Function'}
export interface Alg extends Proc {__type:'Algorithm'}
export const FncConstruct = (p: Proc): Fnc => {
    const ap: proc = <proc>p.value;
    return {
        __type: 'Function',
        value: !p.__void || p.__return ? 'Error' : ap
    };
};
export const AlgConstruct = (p: Proc): Alg => {
    const ap: proc = <proc>p.value;
    return {
        __type: 'Algorithm',
        value: p.__void || !p.__return ? 'Error' : ap
    };
};


/*
    IO Stream
*/

export interface Io {
    __type: 'Input' | 'Output',
    readonly value: string | 'Error'
}


/*
    Resources
*/

export interface Res {
    __type: 'Resource' | 'File' | 'Localize'
}


/*
    RegExp
*/

export interface Rgx {
    __type: 'Regexp',
    value: RegExp
}


/*
    Arrays
*/

type VA = Val[];
type VT = Val['__type'];
type GenA = (VT[] | VT);
export interface Arr<T extends GenA | null> {
    __type: 'Array' | 'Vector' | 'Collection' | 'Sequence' | 'Or Parameters' | 'And Parameters' | 'JSON',
    sub: T | null,
    value: VA | 'Error'
} export interface Vect extends Arr<GenA> {__type: 'Vector'}
export interface Coll extends Arr<GenA> {__type: 'Collection'}
export interface Seq extends Arr<'Number' | 'Integer' | 'Decimal' | 'Character'> {__type: 'Sequence'}
export interface Orp extends Arr<null> {__type: 'Or Parameters'}
export interface Anp extends Arr<null> {__type: 'And Parameters'}
export interface JSON extends Arr<null> {__type: 'JSON'}
export const VectConstruct = (a: Arr<GenA | null>): Vect => {
    const aa: VA = <VA>a.value;
    const aam: string[] = aa.map(e => e.__type);
    const sub: GenA | null = a.sub as VT[] | null;
    return {
        __type: 'Vector',
        sub: sub,
        value: (sub === null && !aam.every(e => e === aam[0])) || !aam.every(e => sub?.includes(e as VT)) ? 'Error' : aa
    };
};
export const CollConstruct = (a: Arr<GenA | null>): Coll => {
    const aa: VA = <VA>a.value;
    const aam: string[] = aa.map(e => e.__type);
    const sub: GenA | null = a.sub as VT[] | null;
    return {
        __type: 'Collection',
        sub: sub,
        value: sub !== null && !aam.every(e => sub?.includes(e as VT)) ? 'Error' : aa
    };
};


/*
    Modifier
*/
export interface Mod {
    __type: 'Modifier',
    value: Fnc
}


/*
    Ambiguous
*/

export interface Ambg {
    __type: 'Ambiguous',
    value: Num | Int | Dec | Sc | Char | Bool | Nil | Proc | Fnc | Alg | Io | Res | Rgx
} export interface Val extends Omit<Ambg, "__type"> {
    __type: 'Value' | 'String' | 'Number' | 'Boolean' | 'Character' | 'Integer' | 'Decimal' 
}

/* 

    GLOBAL

*/

export interface Glob {
    Num: Num | { Int: Int, Dec: Dec }
    Sc: Sc | { Char: Char }
}