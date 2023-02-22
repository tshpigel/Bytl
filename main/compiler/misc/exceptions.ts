import { lookAheadReg } from "./general/looks.ts";
import { fname } from "../process/lexer.ts";

export const ExcArgs = (exc: string, ...args: string[]) => { // replace all placeholders with arguments
    let final = exc; // final output
    let rc = 0; // replace count
    while(final.includes("¬")) {
        final = final.replace("¬", args[rc++]); // replace placeholder with proper argument and add to replace count
    }
    return final;
};

export enum Exceptions {
    UnknownLiteral = "Unknown literal '¬'",
    UnreachableIndex = "Unreachable '¬' in '¬' at index '¬'",
    NonArrayIndexing = "Invalid indexing with '¬' as its type is a '¬' instead of an array",
    SingleQuotedString = "Invalid character length within single quotes",
    DoubleQuotedCharacter = "Character variable with double quotes",
    CannotNil = "Literal '¬' cannot be Nil",
    PathInexistent = "Path ¬ does not exist",
    InexistentKtype = "Kinetype '¬' does not exist",
    InexistentMod = "Modifier '¬' does not exist",
    InvalidModCase = "Modifier must contain only uppercase",
    DuplicateVarName = "Variable name '¬' is already in use",
    InexistentVariable = "Variable '¬' does not exist",
    IncompatibleType = "'¬' type is not compatible with '¬' type",
    RequiredType = "Variable '¬' must be associated with a data type if not previously initialized",
    ExpectedToken = "¬ token expected after '¬' but got '¬'",
    UnexpectedArgument = "Expected argument of type '¬' but got '¬'",
    InaccessibleAssociation = "Association '¬' has 0 access points, at least 1 is required",
    InvalidRegExp = "Regular expression '¬' is invalid",
    ImmutableAlteration = "Immutable variable '¬' cannot be altered",
    IllegalCast = "Variable '¬' of type '¬' cannot be casted to type '¬'",
    InvalidForIteration = "For loop iteration value must be a positive integer, or a variable/expression valuing one",
    UnexpectedToken = "Unexpected token '¬' in '¬'",
    NonEncapsulatingType = "'¬' type is not an encapsulating type and therefore cannot hold encapsulated types",
    MacroExpression = "Code macros cannot be part of an expression",
    MultiTypedVariable = "A variable cannot have multiple types, consider using a union instead",
    Redeclaration = "Variable '¬' cannot be redeclared with neither a value nor a type"
}

export enum Suggestions {
    Redeclaration = "Consider using 'Coerce' or simply reassigning '¬'"
}

function strRep(char: string, count: number): string {
    return Array(count).fill(char).join('');
}

export function exception(excType: keyof typeof Exceptions, args: string[], l: number, c: number, file: string, step: 'Lex' | 'Pars' | 'Emitt' | 'Typ'): void {
    if(!Object.keys(Exceptions).includes(excType)) throw Error("Unidentifiable Error " + excType);
    console.log(`%c${excType + ` ${step}ing Exception`} %c[errno. ${Object.keys(Exceptions).findIndex(e => e === excType)}]: %c${ExcArgs((Exceptions as Record<string, string>)[excType], ...args)}`, "color:red;font-weight:bold;font-size:30px;", "color:darkblue;", "color:#ff7675;");
    console.log(`   %cat [ %c${import.meta.url.slice(0, import.meta.url.lastIndexOf("/") + 1) + `%c${fname}`}%c:%c${l}%c:%c${c} %c]`, "font-weight:bold;", "color:magenta;", "font-weight:bold;color:magenta;", "", "color:yellow;", "", "color:yellow;", "font-weight:bold;");
    const line: string = file.split('\n')[l - 1];
    const excepted: string = lookAheadReg(line, /[^\s]/, c).join(''); 
    const excLen: number = excepted.length;
    const [beforelen, afterlen] = [line.slice(0, c), line.slice(c + excLen)].map(e => e.length);
    console.log(`\n      ${line}`);
    console.log("      " + strRep(" ", beforelen) + `%c${strRep("^", excLen)}` + strRep(" ", afterlen), "color:red;outline:black;");
    Deno.exit(1);
}
