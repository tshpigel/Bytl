export enum TokenType {
    ValDT = 'ValueDataType',
    Plus = 'Plus',
    Asterisk = 'Asterisk',
    ForwardSlash = 'ForwardSlash',
    Backslash = 'Backslash',
    AssignOper = 'AssignmentOperator',
    RightSquareBracket = 'RightSquareBracket',
    LeftSquareBracket = 'LeftSquareBracket',
    LooseEqu = 'LooseEquality',
    StrictEqu = 'StrictEquality',
    Literal = 'Literal',
    String = 'String',
    LineBrk = 'LineBreak',
    LineEnder = 'LineEnder',
    PrOvd = 'PrintOverride',
    AmbDT = 'AmbiguousDataType',
    ArrDT = 'ArrayDataType',
    VectDT = 'VectorDataType',
    CollDT = 'CollectionDataType',
    JSONDT = 'JSONDataType',
    SeqDT = 'SequenceDataType',
    StringDT = 'StringDataType',
    NumDT = 'NumberDataType',
    IntDT = 'IntegerDataType',
    DecDT = 'DecimalDataType',
    CharDT = 'CharacterDataType',
    FncDT = 'FunctionDataType',
    AlgDT = 'AlgorithmDataType',
    BoolDT = 'BooleanDataType',
    ResDT = 'ResourceDataType',
    CmacDT = 'CodeMacroDataType',
    CommDT = 'CommentDataType',
    IODT = 'InputOutputStreamDataType',
    ProcDT = 'ProcedureDataType',
    AssocDT = 'AssociationDataType',
    RgxDT = 'RegexDataType',
    Input = 'Input',
    KtypeChain = 'KineticTypeChain',
    Context = 'Context',
    FullContext = 'FullContext',
    ProcAccess = 'ProcedureAccess',
    Lambda = 'Lambda',
    And = 'And',
    Or = 'Or',
    Exclamation = 'Exclamation',
    DeContext = 'DeContext',
    InContext = 'InContext',
    Special = 'Special',
    LeftAngleBracket = 'LeftAngleBracket',
    RightAngleBracket = 'RightAngleBracket',
    Comma = 'Comma',
    BaseKtypeRef = 'BaseKineticTypeReference',
    MultiArgs = 'MultipleArguments',
    AtSymbol = 'AtSymbol',
    QuestionMark = 'QuestionMark',
    OptParam = 'OptionalParameter',
    ValAcc = 'ValueAccess',
    ObjAcc = 'ObjectAccess',
    AnonmProc = 'AnonymousProcedure',
    CollDTCreate = 'CollectionDatatypeCreation',
    Hyphen = 'Hyphen',
    If = 'IfStatement',
    ElseIf = 'ElseIfStatement',
    Else = 'ElseStatement',
    Switch = 'SwitchStatement',
    Case = 'SwitchCase',
    GTE = 'GreaterThanOrEqualTo',
    LTE = 'LessThanOrEqualTo',
    GTCase = 'GreaterThanSwitchCase',
    GTECase = 'GreaterThanOrEqualToSwitchCase',
    LTCase = 'LessThanSwitchCase',
    LTECase = 'LessThanOrEqualToSwitchCase',
    DVSCase = 'DivisibleBySwitchCase',
    PROCase = 'ReturnsTrueinProcedureSwitchCase',
    Glob = 'Global',
    Event = 'Event',
    Mute = 'SetMutable',
    Return = 'ProceduralReturn',
    Dtype = 'DatatypeReturn',
    Ktype = 'KineticTypeReturn',
    KtypeVal = 'KineticTypeValue',
    MacVar = 'MacroVar',
    Args = 'ProcedureArguments',
    IsNil = 'IsNil',
    Set = 'Set',
    Tab = 'Tab',
    Enable = 'FileEnable',
    Send = 'FileSend',
    Infer = 'Infer',
    Strict = 'Strict',
    That = 'That',
    Apply = 'ApplyModifier',
    Alias = 'ApplyAlias',
    Expunge = 'ExpungeVariableFromMemory',
    ScCast = 'StringCasting',
    ArrCast = 'ArrayCasting',
    CharCast = 'CharacterCasting',
    IntCast = 'IntegerCasting',
    BoolCast = 'BooleanCasting',
    Code0 = 'ProgramExitCode0',
    Number = 'Number',
    Char = 'Character',
    Bool = 'Boolean',
    // Nil = 'Nil',
    Resource = 'Resource',
    Comment = 'Comment',
    RegExp = 'RegularExpression',
    IOStream = 'IOStream',
    Procedure = 'Procedure',
    Association = 'Association',
    Array = 'Array',
    Proc = 'Procedure',
    Block = 'Block',
    EBlock = 'EscapedBlock',
    CurlyBlock = 'CurlyBlock',
    Mod = 'Modifier',
    MultiLineComment = 'MultiLineComment',
    Between = 'InBetween',
    Continue = 'Continue',
    SystemC = 'SystemConditionals',
    SubtypeVal = 'SubtypeValue',
    Modu = 'Modulo',
    Cmacro = 'CodeMacro',
    DvsBy = 'DivisibleBy',
    SupPrec = 'SuperiorPrecedence',
    InfPrec = 'InferiorPrecedence',
    Equ = 'Equality',
    Ineq = 'Inequality',
    RelCreate = 'RelativeCreation',
    SubRel = 'SubRelative',
    Space = 'Space',
    Cycle = 'ArrayCycle',
    For = 'ForLoop',
    While = 'WhileLoop',
    Delimiter = 'Delimiter',


    Assign = 'Assignment',
    CustRel = 'CustomRelative',
    Logic = 'LogicalOperator',
    ForLoop = 'ForLoop',
    EPG = 'Expunge',
    Lone = 'Lone',
    Alg = 'Algorithm',
    Func = 'Function',
    Vect = 'Vector',
    Coll = 'Collection',
    JSON = 'JSON',
    Seq = 'Sequence',
    Orp = 'OrParameters',
    Int = 'Integer',
    Dec = 'Decimal',

    TypeArr = 'TypeArray',

    LOLOLOLOLOLOLOLOLOLOLOLOLOLOL = 'lolugottheerrorkey'
}

export const ktypes: string[] = [
    'dync',
    'obj',
    'uom',
    'ovld',
    'md',
    'init',
    'cannil',
    'fspace',
    'argspace',
    'arrspace',
    'instance',
    'uniq',
    'immute',
    'ktype',
    'base',
    'usn',
    'sn',
    'raw',
    'lambda',
    'lrhs',
    'r2'
];

export const mods: string[] = [
    'precisionset',
    'instanceswap',
    'targets',
    'applytodefault',
    'stacktrace',
    'mul',
    'each',
    'negative',
    'noaccessdupe',
    'excludeaccs',
    'uovd',
    'once',
    'ktypedisabledefault',
    'all',
    'inverse',
    'formatinverse',
    'simulation'
];

export const TOKENS: string[][] = [
    ['¬', 'LOLOLOLOLOLOLOLOLOLOLOLOLOLOL'],
    [' ', 'Space'],
    ['\n', 'LineBrk'],
    ['\\\\', 'Delimiter'],
    ['[', 'LeftSquareBracket'],
    [']', 'RightSquareBracket'],
    ['+', 'Plus'],
    ['*', 'Asterisk'],
    [',', 'Comma'],
    ['/', 'ForwardSlash'],
    ['\\', 'Backslash'],
    ['val', 'ValDT'],
    ['ambg', 'AmbDT'],
    ['sc', 'StringDT'],
    ['num', 'NumDT'],
    ['int', 'IntDT'],
    ['dec', 'DecDT'],
    ['char', 'CharDT'],
    ['bool', 'BoolDT'],
    ['cmacro', 'CmacDT'],
    ['res', 'ResDT'],
    ['io', 'IODT'],
    ['assoc', 'AssocDT'],
    ['rgx', 'RgxDT'],
    ['!=', 'Ineq'],
    ['==', 'Equ'],
    ['=', 'AssignOper'],
    ['!', 'Exclamation'],
    ['%%', 'DvsBy'],
    ['%', 'Modu'],
    ['>>', 'PrOvd'],
    ['in', 'Input'],
    [':', 'ObjAcc'],
    ['...', 'CollDTCreate'],
    ['..', 'AnonmProc'],
    ['.', 'KtypeChain'],
    [';;', 'FullContext'],
    [';', 'Context'],
    ['_', 'ProcAccess'],
    ['-->', 'Lambda'],
    ['-', 'Hyphen'],
    ['&', 'And'],
    ['||', 'BaseKtypeRef'],
    ['|', 'Or'],
    ['>=', 'GTE'],
    ['<=', 'LTE'],
    ['>', 'RightAngleBracket'],
    ['<', 'LeftAngleBracket'],
    ['vect', 'VectDT'],
    ['arr', 'ArrDT'],
    ['coll', 'CollDT'],
    ['json', 'JSONDT'],
    ['fnc', 'FncDT'],
    ['alg', 'AlgDT'],
    ['proc', 'ProcDT'],
    ['~', 'MultiArgs'],
    ['@', 'AtSymbol'],
    ['?', 'QuestionMark'],
    ['^', 'OptParam'],
    ['#', 'ValAcc'],
    ['if', 'If'],
    ['cycle', 'Cycle'],
    ['for', 'For'],
    ['while', 'While'],
    ['eif', 'ElseIf'],
    ['else', 'Else'],
    ['switch', 'Switch'],
    ['case', 'Case'],
    ['gte', 'GTECase'],
    ['gt', 'GTCase'],
    ['lte', 'LTECase'],
    ['lt', 'LTCase'],
    ['dvs', 'DVSCase'],
    ['pro', 'PROCase'],
    ['glob', 'Glob'],
    ['Event', 'Event'],
    ['Mute', 'Mute'],
    ['rn', 'Return'],
    ['Dtype', 'Dtype'],
    ['Ktype', 'Ktype'],
    ['Args', 'Args'],
    ['Nilq', 'IsNil'],
    ['Set', 'Set'],
    ['Enable', 'Enable'],
    ['Send', 'Send'],
    ['Infer', 'Infer'],
    ['Strict', 'Strict'],
    ['That', 'That'],
    ['Apply', 'Apply'],
    ['Alias', 'Alias'],
    ['Expunge', 'Expunge'], 
    ['SC', 'ScCast'],
    ['ARR', 'ArrCast'],
    ['CHAR', 'CharCast'],
    ['INT', 'IntCast'],
    ['BOOL', 'BoolCast'],
    ['C0', 'Code0'],
    // ['nil', 'Nil'],
    ['bet', 'Between'],
    ['cont', 'Continue'],
    ['sysc', 'SystemC']
];

export type NthD<T> = (T | NthD<T>)[];

export interface TokenNode<T extends TokenType> {
    type: T,
    ln?: number,
    col?: number 
} export interface TokenValueNode<T extends TokenType> extends TokenNode<T> {
    val: string
} export interface TokenMultiValueNode<T extends TokenType> extends TokenNode<T> {
    vals: Token[]
} 

export function valToType(ptype: string, val: string): string {
    switch(ptype) {
        case "Number": return val.includes(".") ? 'Decimal' : 'Integer';
        case "String":
        case "Boolean":
        case "Character":
        default: return val;
    }
}

export type Type = { trueType: string, nrquo?: boolean, rest: { bytlType: string, parentType: string }, regex?: RegExp };
export const Types: Type[] = [
    { trueType: 'Integer', nrquo: true, rest: { bytlType: 'Int', parentType: 'Number' } },
    { trueType: 'Number', rest: { bytlType: 'Num', parentType: 'Number' }, regex: /^\d+\.\d+$|^\d+$/ },
    { trueType: 'Character', rest: { bytlType: 'Char', parentType: 'String' }, regex: /^'.'$/ },
    { trueType: 'Boolean', nrquo: true, rest: { bytlType: 'Bool', parentType: 'Boolean' }, regex: /^true$|^false$/ },
    { trueType: 'String', rest: { bytlType: 'Sc', parentType: 'String' }, regex: /^".*"$/ },
    { trueType: 'Decimal', rest: { bytlType: 'Dec', parentType: 'Number' } },
    { trueType: 'Procedure', rest: { bytlType: 'Proc', parentType: 'Procedure' } },
    { trueType: 'Array', rest: { bytlType: 'Arr', parentType: 'Array' } },
    { trueType: 'Vector', rest: { bytlType: 'Vect', parentType: 'Array' } },
    { trueType: 'Nil', nrquo: true, rest: { bytlType: 'Nil', parentType: 'Nil' }, regex: /^nil$/ },
    { trueType: 'CodeMacro', nrquo: true, rest: { bytlType: 'CodeMacro', parentType: 'CodeMacro' }, regex: /^cmacro$/ }
];

export interface Nested {
    type: string,
    ktypes: string[],
    sub?: Nested
}

export type AllTokens<T extends TokenType> = TokenNode<T> | TokenValueNode<T> | TokenMultiValueNode<T>;
export type ParseKey<T extends TokenType> = NthD<AllTokens<T>> | AllTokens<T>;
export type LC = { l: number, c: number };

export type Assign = {
    name: { n: string } & LC,
    mainType: { m: string | null } & LC,
    cktypes?: Nested,
    val: Token | NthD<Token>
}; export type Orp = {
    name?: string,
    vals: unknown[]
}; export type Association = {
    name: string
}; export type Print = {
    args: ({ value: string | Expression } & LC)[]
}; export type IfStatement = {
    condition: AST<TokenType>[]
    block: AST<TokenType>[]
}; export type ElseIfStatement = IfStatement;
export type ElseStatement = {
    block: AST<TokenType>[]
}; export type LogicalOperator = {
    type: string
}; export type relbase<T extends Omit<Assign, "val"> | never> = {
    name: string,
    value?: string | AST<TokenType>[],
    dtype?: Pick<Assign, "mainType" | "cktypes">,
    args?: T[]
}; export type CustomRelative = {
    name: string,
    param?: {
        rtype: string,
        name: string
    }
    consts?: relbase<never>[],
    procs?: relbase<Omit<Assign, "val">>[],
    subrels?: Omit<CustomRelative, "param">[]
}; export type Ternary = {
    lhs: Expression,
    if: Expression,
    else: Expression
}; export type Expunge = {
    args: ({ value: string } & LC)[]
}; export type Lone = { value: string };
export type For = {
    iters: string,
    action: AST<TokenType>[],
    name?: string,
    condition?: AST<TokenType>[],
    change?: number
};

type OperFE = TokenNode<TokenType.Plus> | TokenNode<TokenType.Hyphen> | TokenNode<TokenType.Asterisk> | 
TokenNode<TokenType.ForwardSlash> | TokenNode<TokenType.And> | TokenNode<TokenType.Or> | TokenNode<TokenType.Modu> |
TokenNode<TokenType.LeftAngleBracket> | TokenNode<TokenType.RightAngleBracket> | TokenNode<TokenType.ObjAcc> | 
TokenNode<TokenType.ProcAccess> | TokenNode<TokenType.ValAcc> | TokenNode<TokenType.LooseEqu> | TokenNode<TokenType.Equ> | 
TokenNode<TokenType.Ineq> | TokenNode<TokenType.Comma> | TokenNode<TokenType.KtypeChain> | TokenNode<TokenType.Context>;
type ValueFE = TokenMultiValueNode<TokenType> | TokenValueNode<TokenType> | TokenNode<TokenType.Literal>;

export type Expression = (ValueFE | OperFE)[];
export const VListFE: string[] = ['array', 'block', 'association', 'number', 'string', 'boolean', 'nil', 'regularexpression',
'character', 'resource', 'procedure', 'literal', 'block', 'curlyblock', 'superiorprecedece', 'inferiorprecedence', 'kinetictypechain',
'modifier'];
export const OListFE: string[] = ['plus', 'hyphen', 'asterisk', 'forwardslash', 'and', 'or', 'modulo', 'leftanglebracket',
'rightanglebracket', 'objectaccess', 'procedureaccess', 'valueaccess', 'looseequality', 'looseinequality', 'strictequality',
'strictinequality', 'separation', 'kinetictypevalue', 'context', 'exclamation'];
export const FListFE: string[] = VListFE.concat(OListFE);

export type AST<T extends TokenType> = {
    [k in T as string]?: 
        (   Assign | Orp | Print | IfStatement | LogicalOperator | ElseStatement | CustomRelative | 
            Expression | Expunge | Lone | For   )
        & LC
};

export function Null<T>(u: unknown): T {
    if(u === null || u === undefined) throw new Error('Variable is null');
    else return u as T;
}

export type ParseType = Assign | Orp | Print;
export const MultiTypes: string[] = [
    'Vector',
    'Array',
    'Collection',
    'Sequence',
    'Association',
    'JSON'
].map(e => e + 'DataType');
export const Primitives: string[] = [
    'Number',
    'Boolean',
    'String',
    'Character',
    'RegularExpression',
    'Association',
    'Procedure',
    'Function',
    'Algorithm'
];

export const DataTypes: string[] = [
    'sc',
    'int',
    'dec',
    'val',
    'ambg',
    'json',
    'char',
    'seq',
    'vect',
    'arr',
    'coll',
    'num',
    'fnc',
    'alg',
    'proc',
    'comm',
    'assoc',
    'rgx',
    'mod',
    'nil',
    'bool',
    'res'
];

export type Token = 
    TokenNode<TokenType.AssignOper> | 
    TokenNode<TokenType.ValDT> |
    TokenNode<TokenType.Delimiter> |
    TokenNode<TokenType.Plus> | 
    TokenNode<TokenType.Asterisk> |
    TokenNode<TokenType.ForwardSlash> |
    TokenNode<TokenType.Backslash> |
    TokenNode<TokenType.LineBrk> |
    TokenNode<TokenType.PrOvd> |
    TokenNode<TokenType.LineEnder> |
    TokenNode<TokenType.AmbDT> |
    TokenNode<TokenType.ArrDT> |
    TokenNode<TokenType.StringDT> |
    TokenNode<TokenType.Tab> |
    TokenNode<TokenType.NumDT> |
    TokenNode<TokenType.CharDT> |
    TokenNode<TokenType.BoolDT> |
    TokenNode<TokenType.FncDT> |
    TokenNode<TokenType.AlgDT> |
    TokenNode<TokenType.ResDT> |
    TokenNode<TokenType.IODT> |
    TokenNode<TokenType.ProcDT> |
    TokenNode<TokenType.AssocDT> |
    TokenNode<TokenType.RgxDT> |
    TokenNode<TokenType.Input> |
    TokenNode<TokenType.KtypeChain> |
    TokenNode<TokenType.Context> |
    TokenNode<TokenType.FullContext> |
    TokenNode<TokenType.ProcAccess> |
    TokenNode<TokenType.Lambda> |
    TokenNode<TokenType.And> |
    TokenNode<TokenType.Or> |
    TokenNode<TokenType.Exclamation> |
    TokenNode<TokenType.LeftAngleBracket> |
    TokenNode<TokenType.RightAngleBracket> |
    TokenNode<TokenType.LeftSquareBracket> |
    TokenNode<TokenType.RightSquareBracket> |
    TokenNode<TokenType.BaseKtypeRef> |
    TokenNode<TokenType.MultiArgs> |
    TokenNode<TokenType.AtSymbol> |
    TokenNode<TokenType.OptParam> |
    TokenNode<TokenType.ValAcc> |
    TokenNode<TokenType.ObjAcc> |
    TokenNode<TokenType.AnonmProc> |
    TokenNode<TokenType.CollDTCreate> |
    TokenNode<TokenType.Hyphen> |
    TokenNode<TokenType.If> |
    TokenNode<TokenType.ElseIf> |
    TokenNode<TokenType.Else> |
    TokenNode<TokenType.Switch> |
    TokenNode<TokenType.Case> |
    TokenNode<TokenType.GTCase> |
    TokenNode<TokenType.GTECase> |
    TokenNode<TokenType.LTCase> |
    TokenNode<TokenType.LTECase> |
    TokenNode<TokenType.DVSCase> |
    TokenNode<TokenType.PROCase> |
    TokenNode<TokenType.Glob> |
    TokenNode<TokenType.Event> |
    TokenNode<TokenType.Mute> |
    TokenNode<TokenType.Return> |
    TokenNode<TokenType.Dtype> |
    TokenNode<TokenType.Ktype> |
    TokenNode<TokenType.Args> |
    TokenNode<TokenType.IsNil> |
    TokenNode<TokenType.Set> |
    TokenNode<TokenType.Enable> |
    TokenNode<TokenType.Send> |
    TokenNode<TokenType.Infer> |
    TokenNode<TokenType.Strict> |
    TokenNode<TokenType.Comma> |
    TokenNode<TokenType.That> |
    TokenNode<TokenType.Apply> |
    TokenNode<TokenType.Alias> |
    TokenNode<TokenType.Expunge> |
    TokenNode<TokenType.ScCast> |
    TokenNode<TokenType.ArrCast> |
    TokenNode<TokenType.CharCast> |
    TokenNode<TokenType.IntCast> |
    TokenNode<TokenType.BoolCast> |
    TokenNode<TokenType.Code0> |
    // TokenNode<TokenType.Nil> |
    TokenNode<TokenType.Between> |
    TokenNode<TokenType.Continue> |
    TokenNode<TokenType.SystemC> |
    TokenNode<TokenType.QuestionMark> |
    TokenNode<TokenType.Ineq> |
    TokenNode<TokenType.Equ> |
    TokenNode<TokenType.Space> |

    TokenMultiValueNode<TokenType.Array> |
    TokenMultiValueNode<TokenType.Block> |
    TokenMultiValueNode<TokenType.EBlock> |
    TokenMultiValueNode<TokenType.CurlyBlock> |
    TokenMultiValueNode<TokenType.Association> |
    TokenMultiValueNode<TokenType.TypeArr> |
    TokenMultiValueNode<TokenType.InfPrec> |
    TokenMultiValueNode<TokenType.SupPrec> |
    TokenMultiValueNode<TokenType.RelCreate> |
    TokenMultiValueNode<TokenType.SubRel> |
    TokenMultiValueNode<TokenType.Cmacro> | 

    TokenValueNode<TokenType.String> |
    TokenValueNode<TokenType.RegExp> |
    TokenValueNode<TokenType.Number> |
    TokenValueNode<TokenType.Char> |
    TokenValueNode<TokenType.Special> |
    TokenValueNode<TokenType.Bool> |
    TokenValueNode<TokenType.Resource> |
    TokenValueNode<TokenType.IOStream> |
    TokenValueNode<TokenType.Procedure> |
    TokenValueNode<TokenType.Mod> |
    TokenValueNode<TokenType.MultiLineComment> |
    TokenValueNode<TokenType.KtypeVal> |
    TokenValueNode<TokenType.SubtypeVal> |
    TokenValueNode<TokenType.MacVar> |
    TokenValueNode<TokenType.Literal>;
    
    
export type PToken = 
    ParseKey<TokenType.Association> |
    ParseKey<TokenType.Assign> |
    ParseKey<TokenType.Vect> |
    ParseKey<TokenType.Coll> |
    ParseKey<TokenType.Orp> |
    ParseKey<TokenType.JSON> |
    ParseKey<TokenType.Seq> |
    ParseKey<TokenType.Int> |
    ParseKey<TokenType.Dec> |
    ParseKey<TokenType.Alg> |
    ParseKey<TokenType.Func>

export const TOKENMAP: Array<{ key: string, val: TokenNode<TokenType> }> = TOKENS.map((e, i) => (
    { key: e[0], val: { type: TokenType[TOKENS[i][1] as keyof typeof TokenType] } }
));
