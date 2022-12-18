/*
    Main/Glob
*/

export interface Glob {
    $init?: (v: Val) => void,
    $cannil?: boolean,
    $dync?: boolean,
    $obj?: boolean,
    $immute?: boolean,
    $instance?: boolean
}

// Ghost Types
export interface Gtype extends Glob {
    readonly ref : true
}

/* 
    Relatives 
*/

export interface Rel extends Glob {
    readonly __type: 'Relative',
    readonly value: Record<string, unknown>
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

type proc = (...args: Val[]) => Val | void;
export interface Proc extends Glob {
    readonly __type: 'Procedure' | 'Function' | 'Algorithm',
    $lambda?: (v: Val) => Val,
    $lrhs?: boolean,
    $ovld?: boolean,
    $r2?: boolean,
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
    Resources
*/

export interface Res extends Glob {
    readonly __type: 'Resource' | 'File' | 'Localize' | 'Input'
} export interface File extends Res {
    readonly __type: 'File'
} export interface Localize extends Res {
    readonly __type: 'Localize'
} export interface Input extends Res {
    readonly __type: 'Input'
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

type VA = Val[];
type VT = Val['__type'];
type GenA = (VT[] | VT);
export interface Arr<T extends GenA | null> extends Glob {
    readonly __type: 'Array' | 'Vector' | 'Collection' | 'Sequence' | 'Or Parameters',
    $md?: (lim?: Int) => void,
    $arrspace?: boolean,
    $uniq?: boolean,
    sub: T | null,
    value: VA | VT[] | JSONT | 'Error'
} export interface Vect extends Arr<GenA> {__type: 'Vector'}
export interface Coll extends Arr<GenA> {__type: 'Collection'}
export interface Seq extends Arr<'Number' | 'Integer' | 'Decimal' | 'Character'> {__type: 'Sequence'}
export interface Orp extends Arr<null> {__type: 'Or Parameters'}
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
export const SeqConstruct = (a: Arr<'Number' | 'Integer' | 'Decimal' | 'Character'>): Seq => {
    const aa: VA = <VA>a.value;
    const aam: string[] = aa.map(e => e.__type);
    const sub: 'Number' | 'Integer' | 'Decimal' | 'Character' | null = a.sub;
    return {
        __type: 'Sequence',
        sub: sub,
        value: sub === null || aam[2] !== 'Integer' || aa.length !== 3 ? 'Error' : aa
    };
};
export const OrpConstruct = (a: Arr<null>): Orp => {
    const aa: VT[] | VA = <VT[]|VA>a.value;
    const aam: string[] = aa.map(e => typeof e == 'string' ? '' : e.__type);
    const af: string[] = aam.filter(e => e === '');
    return {
        __type: 'Or Parameters',
        sub: null,
        value: af.length > 0 || af.length < aam.length ? 'Error' : aa
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

type anyt = Num | Int | Dec | Sc | Char | Bool | Proc | Fnc | Alg | Res | Rgx | Mod;
type anys = Num["__type"] | Sc["__type"] | Bool["__type"] | Proc["__type"] | Res["__type"] | Rgx["__type"] | Mod["__type"];
type anyv = Num["value"] | Sc["value"] | Bool["value"] | Proc["value"] | Mod["value"]
export interface Ambg extends Glob {
    readonly __type: 'Ambiguous',
    value: anyv
} export interface Val extends Omit<Ambg, "__type"> {
    readonly __type: anys,
    value: anyv
}
