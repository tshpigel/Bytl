export enum TokenType {
    ValDT = 'VariableDataType',
    Plus = 'Plus',
    Asterisk = 'Asterisk',
    ForwardSlash = 'ForwardSlash',
    Backslash = 'Backslash',
    AssignOper = 'AssignmentOperator',
    LooseEqu = 'LooseEquality',
    StrictEqu = 'StrictEquality',
    Literal = 'Literal',
    String = 'String',
    LineBrk = 'LineBreak',
    LineEnder = 'LineEnder',
    Exit = 'Exit',
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
    True = 'true',
    False = 'false',
    NilDT = 'NilDataType',
    ResDT = 'ResourceDataType',
    CommDT = 'CommentDataType',
    IODT = 'InputOutputStreamDataType',
    ProcDT = 'ProcedureDataType',
    AssocDT = 'AssociationDataType',
    RgxDT = 'RegexDataType',
    Input = 'Input',
    RelCreate = 'RelativeCreation',
    KtypeChain = 'KineticTypeChain',
    Context = 'Context',
    ProcAccess = 'ProcedureAccess',
    Lambda = 'Lambda',
    And = 'And',
    Or = 'Or',
    DeContext = 'DeContext',
    InContext = 'InContext',
    LeftAngleBracket = 'LeftAngleBracket',
    RightAngleBracket = 'RightAngleBracket',
    Separate = 'Separation',
    BaseKtypeRef = 'BaseKineticTypeReference',
    MultiArgs = 'MultipleArguments',
    AtSymbol = 'AtSymbol',
    QuestionMark = 'QuestionMark',
    OptParam = 'OptionalParameter',
    ValAcc = 'ValueAccess',
    ObjAcc = 'ObjectAccess',
    AnonmProc = 'AnonymusProcedure',
    CollDTCreate = 'CollectionDatatypeCreation',
    Hyphen = 'Hyphen',
    If = 'IfStatement',
    ElseIf = 'ElseIfStatement',
    Else = 'ElseStatement',
    Switch = 'SwitchStatement',
    Case = 'SwitchCase',
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
    Args = 'ProcedureArguments',
    IsNil = 'IsNil',
    Set = 'Set',
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
    Nil = 'Nil',
    Resource = 'Resource',
    Comment = 'Comment',
    RegExp = 'RegularExpression',
    IOStream = 'IOStream',
    Procedure = 'Procedure',
    Association = 'Association',
    Regex = 'Regex',
    Array = 'Array',
    Proc = 'Procedure',
    Block = 'Block',
    CurlyBlock = 'CurlyBlock',
    Mod = 'Modifier',
    MultiLineComment = 'MultiLineComment',
    Between = 'InBetween',
    Continue = 'Continue',
    SystemC = 'SystemConditionals',
    SubtypeVal = 'SubtypeValue',


    Assign = 'Assignment',
    Alg = 'Algorithm',
    Func = 'Function',
    Vect = 'Vector',
    Coll = 'Collection',
    JSON = 'JSON',
    Seq = 'Sequence',
    Orp = 'OrParameters',
    Int = 'Integer',
    Dec = 'Decimal'
}

export const ktypes: string[] = [
    'dync',
    'obj',
    'uom',
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

export const mods: string[][] = [

];



export const TOKENS: string[][] = [
    ['\n', 'LineBrk'],
    ['+', 'Plus'],
    ['*', 'Asterisk'],
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
    ['true', 'True'],
    ['false', 'False'],
    ['nil', 'NilDT'],
    ['res', 'ResDT'],
    ['io', 'IODT'],
    ['assoc', 'AssocDT'],
    ['rgx', 'RgxDT'],
    ['===', 'StrictEqu'],
    ['==', 'LooseEqu'],
    ['=', 'AssignOper'],
    ['`', 'LineEnder'],
    ['ex', 'Exit'],
    ['in', 'Input'],
    ['::', 'RelCreate'],
    [':', 'ObjAcc'],
    ['...', 'CollDTCreate'],
    ['..', 'AnonmProc'],
    ['.', 'KtypeChain'],
    [';', 'Context'],
    ['_', 'ProcAccess'],
    ['-->', 'Lambda'],
    ['->', 'InContext'],
    ['-', 'Hyphen'],
    ['&', 'And'],
    ['||', 'BaseKtypeRef'],
    ['|', 'Or'],
    ['>', 'RightAngleBracket'],
    ['<', 'LeftAngleBracket'],
    [',', 'Separate'],
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
    ['Nil', 'Nil'],
    ['bet', 'Between'],
    ['cont', 'Continue'],
    ['sysc', 'SystemC']
];

export type NthD<T> = (T | NthD<T>)[];

export interface TokenNode<T extends TokenType> {
    type: T 
} export interface TokenValueNode<T extends TokenType> extends TokenNode<T> {
    val: string
} export interface TokenMultiValueNode<T extends TokenType> extends TokenNode<T> {
    vals: NthD<unknown>
} 

export interface Nested {
    mainKtypes: string[],
    subAndKtypes: (string | string[] | Nested)[][]
}

export type AllTokens<T extends TokenType> = TokenNode<T> | TokenValueNode<T> | TokenMultiValueNode<T>;
export type ParseKey<T extends TokenType> = NthD<AllTokens<T>> | AllTokens<T>;
export type Assign = {
    name: string,
    mainType: string,
    sktypes?: Nested,
    val: ParseKey<TokenType>
}; export type Orp = {
    name?: string,
    vals: unknown[]
}; export type Association = {
    name: string
}; export type Exit = {
    args: string[]
};

export type AST<T extends TokenType> = {
    [k in T]: Assign | Orp | Exit
};

export function Null<T>(u: unknown): T {
    if(u === null || u === undefined) throw new Error('Variable is null');
    return u as T;
}

export type ParseType = Assign | Orp | Exit;
export const MultiTypes: string[] = [
    'Vector',
    'Array',
    'Collection',
    'Sequence',
    'Association',
    'JSON'
].map(e => e + 'DataType');

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
    'res',
    'io'
];

export type Token = 
    TokenNode<TokenType.AssignOper> | 
    TokenNode<TokenType.ValDT> |
    TokenNode<TokenType.Plus> | 
    TokenNode<TokenType.Asterisk> |
    TokenNode<TokenType.ForwardSlash> |
    TokenNode<TokenType.Backslash> |
    TokenNode<TokenType.LineBrk> |
    TokenNode<TokenType.Exit> |
    TokenNode<TokenType.LineEnder> |
    TokenNode<TokenType.AmbDT> |
    TokenNode<TokenType.ArrDT> |
    TokenNode<TokenType.StringDT> |
    TokenNode<TokenType.NumDT> |
    TokenNode<TokenType.CharDT> |
    TokenNode<TokenType.BoolDT> |
    TokenNode<TokenType.FncDT> |
    TokenNode<TokenType.AlgDT> |
    TokenNode<TokenType.True> |
    TokenNode<TokenType.False> |
    TokenNode<TokenType.NilDT> |
    TokenNode<TokenType.ResDT> |
    TokenNode<TokenType.IODT> |
    TokenNode<TokenType.ProcDT> |
    TokenNode<TokenType.AssocDT> |
    TokenNode<TokenType.RgxDT> |
    TokenNode<TokenType.Input> |
    TokenNode<TokenType.RelCreate> |
    TokenNode<TokenType.KtypeChain> |
    TokenNode<TokenType.Context> |
    TokenNode<TokenType.ProcAccess> |
    TokenNode<TokenType.Lambda> |
    TokenNode<TokenType.And> |
    TokenNode<TokenType.Or> |
    TokenNode<TokenType.LeftAngleBracket> |
    TokenNode<TokenType.RightAngleBracket> |
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
    TokenNode<TokenType.Separate> |
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
    TokenNode<TokenType.Nil> |
    TokenNode<TokenType.Between> |
    TokenNode<TokenType.Continue> |
    TokenNode<TokenType.SystemC> |
    TokenNode<TokenType.QuestionMark> |

    TokenMultiValueNode<TokenType.Array> |
    TokenMultiValueNode<TokenType.Block> |
    TokenMultiValueNode<TokenType.CurlyBlock> |
    TokenMultiValueNode<TokenType.Association> |

    TokenValueNode<TokenType.String> |
    TokenValueNode<TokenType.Number> |
    TokenValueNode<TokenType.Char> |
    TokenValueNode<TokenType.Bool> |
    TokenValueNode<TokenType.Nil> |
    TokenValueNode<TokenType.Resource> |
    TokenValueNode<TokenType.IOStream> |
    TokenValueNode<TokenType.Procedure> |
    TokenValueNode<TokenType.Regex> |
    TokenValueNode<TokenType.Mod> |
    TokenValueNode<TokenType.MultiLineComment> |
    TokenValueNode<TokenType.KtypeVal> |
    TokenValueNode<TokenType.SubtypeVal> |
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