/*
    Main/Glob
*/

export interface Glob {
    $init?: (v: Val) => void,
    $cannil?: boolean,
    $dync?: boolean,
    $obj?: boolean,
    $immute?: boolean,
    $instance?: boolean,
    filter?: (...e: anyt[]) => boolean
}

// Ghost Types
export interface Gtype extends Glob {
    readonly ref: true
} export interface Rtype extends Gtype{}

// Data Types
export type Dtype = anyt & Gtype;

// Special Types
export type Stype = st & Gtype;

// Primitive Types
export type Ptype = pt & Gtype;

// Encapsulating Types
export type Etype = et & Gtype;

/*
    The Special Type
*/
export interface Special extends Glob {
    readonly __type: 'Regular Expression' | 'Bitwise' | 'Command Execution' | 'Math' | 'Path' | 'Code Macro'
    readonly value: string
}

/* 
    Relatives 
*/

export interface Rel extends Gtype {
    readonly __type: 'Relative',
    readonly value: Record<string, anyt>
}

/* 
    Numbers
*/

export interface Num extends Glob {
    readonly __type: 'Number' | 'Integer' | 'Decimal',
    $base?: (n: Num) => void,
    $uom?: boolean,
    $usn?: boolean,
    $sn?: boolean,
    readonly TSTYPE?: number,
    value: number | void | string
} export interface Int extends Num {__type:'Integer'}
export interface Dec extends Num {__type:'Decimal'}
export const IntConstruct = (n: Num): Int => {
    const an: number = <number>n.value;
    return {
        __type: 'Integer',
        value: an % 1 === 0 && (<string>n.value)[0] !== "0" ? an : 'Error'
    }
}; export const DecConstruct = (n: Num): Dec => {
    const an: number = <number>n.value;
    return {
        __type: 'Decimal',
        value: an % 1 === 0 ? an.toFixed(1) : an
    }
}


/*

    Strings

*/

export interface Sc extends Glob {
    readonly __type: 'String' | 'Character',
    $base?: (n: Sc) => void,
    $raw?: boolean,
    readonly TSTYPE?: string,
    readonly value: string | 'Error'
} export interface Char extends Omit<Sc, "$base"> {__type:'Character'}
export const CharConstruct = (s: Sc): Char => {
    const asc: string = s.value;
    return {
        __type: 'Character',
        value: asc.length > 3 ? 'Error' : asc
    };
};


/*
    Booleans
*/

export interface Bool extends Glob {
    readonly __type: 'Boolean',
    readonly value: 'true' | 'false',
    readonly TSTYPE?: boolean
} 


/*
    Procedures
*/

export type proc = (...args: Val[]) => Val | void;
export interface Proc<A extends Dtype | null> extends Glob {
    readonly __type: 'Procedure' | 'Function' | 'Algorithm',
    $lambda?: (v: Val) => Val,
    $lrhs?: boolean,
    $ovld?: boolean,
    $r2?: boolean,
    readonly __void?: boolean,
    readonly __return?: boolean,
    readonly __rettype?: A
    readonly value: proc | 'Error'
} export interface Fnc extends Proc<null> {__type:'Function'}
export interface Alg<T extends Dtype> extends Proc<T> {__type:'Algorithm'}
export const FncConstruct = (p: Proc<null>): Fnc => {
    const ap: proc = <proc>p.value;
    return {
        __type: 'Function',
        value: !p.__void || p.__return ? 'Error' : ap
    };
};
export const AlgConstruct = <T extends Dtype>(p: Proc<T>): Alg<T> => {
    const ap: proc = <proc>p.value;
    return {
        __type: 'Algorithm',
        value: p.__void || !p.__return ? 'Error' : ap
    };
};


/*
    Resources
*/

export interface Res extends Glob {
    readonly __type: 'Resource' | 'File' | 'Localize' | 'Inp'
} export interface File extends Res {
    readonly __type: 'File'
} export interface Localize extends Res {
    readonly __type: 'Localize'
} export interface Inp extends Res {
    readonly __type: 'Inp'
}


/*
    RegExp [ special ]
*/

import { RgxLex, RgxAST, Emit } from "../regex/regex.ts";

export class Rgx {
    private readonly __type: 'Regex' = 'Regex';
    public regex: string;
    constructor(public regxp: string) {
        this.regex = regxp;
    }

    check(str: string): boolean {
        return Emit(RgxAST(RgxLex(this.regex)), str);
    }
}


/* 
    Expression
*/
export interface Expr extends Glob {
    readonly __type: 'Expression',
    readonly value: (anyv)[]
}

/*
    Arrays
*/

export type VA = Val[];
type VT = Val['__type'];
export type GenA = (VT[] | VT | 'Dtype');
type JSONT = {[k: string]: unknown}[];
export interface Arr<T extends GenA | null> extends Glob {
    readonly __type: 'Array' | 'Vector' | 'Collection' | 'Sequence' | 'Union' | 'JSON' | 'Dtype',
    $md?: (lim?: Int) => void,
    $arrspace?: boolean,
    $uniq?: boolean,
    sub: T | null,
    value: VA | VT[] | JSONT | 'Error'
} export interface Vect<T extends GenA> extends Arr<T> {__type: 'Vector'}
export interface Coll<T extends GenA> extends Arr<T> {__type: 'Collection'}
export interface Seq<T extends 'Number' | 'Integer' | 'Decimal' | 'Character'> extends Arr<T> {__type: 'Sequence'}
export interface Uni<T extends VT[] | 'Dtype'> extends Arr<T> {__type: 'Union'}    
export interface JSON extends Arr<null> {__type: 'JSON'}
export const VectConstruct = <T extends GenA>(a: Arr<T>): Vect<T> => {
    const aa: VA = <VA>a.value;
    const aam: string[] = <unknown>aa.map(e => e.__type) as string[];
    const sub: T | null = a.sub;
    return {
        __type: 'Vector',
        sub: sub,
        value: (sub === null && !aam.every(e => e === aam[0])) || !aam.every(e => sub?.includes(<unknown>e as VT)) ? 'Error' : aa
    };
};
export const CollConstruct = <T extends GenA>(a: Arr<T>): Coll<T> => {
    const aa: VA = <VA>a.value;
    const aam: string[] = <unknown>aa.map(e => e.__type) as string[];
    const sub: T | null = a.sub;
    return {
        __type: 'Collection',
        sub: sub,
        value: sub !== null && !aam.every(e => sub?.includes(<unknown>e as VT)) ? 'Error' : aa
    };
};
export const SeqConstruct = <T extends 'Number' | 'Integer' | 'Decimal' | 'Character'>(a: Arr<T>): Seq<T> => {
    const aa: VA = <VA>a.value;
    const aam: string[] = <unknown>aa.map(e => e.__type) as string[];
    const sub: T | null = a.sub;
    return {
        __type: 'Sequence',
        sub: sub,
        value: sub === null || aam[2] !== 'Integer' || aa.length !== 3 ? 'Error' : aa
    };
};
export const UniConstruct = <T extends VT[]>(a: Arr<T>): Uni<T> => { // needs changing
    const aa: VT[] | VA = <VT[]|VA>a.value;
    const aam: string[] = aa.map(e => typeof e == 'string' ? '' : e.__type) as string[];
    const af: string[] = aam.filter(e => e === '');
    return {
        __type: 'Union',
        sub: null,
        value: af.length > 0 || af.length < aam.length ? 'Error' : aa
    }
};
export const JSONConstruct = (a: Arr<null>): JSON => { // needs changing
    return {
        __type: 'JSON',
        sub: null,
        value: <JSONT>a.value
    }
};

/*
    Modifier
*/
export interface Mod extends Glob {
    readonly __type: 'Modifier',
    value: Fnc
}


/*
    Any
*/
export type pt = Num | Int | Dec | Sc | Char | Bool | Proc<Dtype | null> | Fnc | Alg<Dtype> | Arr<GenA | null> | Coll<GenA> | Vect<GenA> | 
    Uni<VT[]> | Seq<'Number' | 'Integer' | 'Decimal' | 'Character'>;
export type st = Res | File | Inp | Localize;
export type et = Arr<GenA | null> | Coll<GenA> | Vect<GenA> | Uni<VT[]> | Seq<'Number' | 'Integer' | 'Decimal' | 'Character'>;
export type anyt = pt | st;
export type anys = Num["__type"] | Sc["__type"] | Bool["__type"] | Proc<Dtype | null>["__type"] | Res["__type"] | Rgx["__type"] | Mod["__type"] | 'Array';
type anyv = Num["value"] | Sc["value"] | Bool["value"] | Proc<Dtype | null>["value"] | Mod["value"]
export interface Ambg extends Glob {
    readonly __type: 'Ambiguous',
    value: anyv
} export interface Val extends Omit<Ambg, "__type"> {
    readonly __type: anys,
    value: anyv
}
