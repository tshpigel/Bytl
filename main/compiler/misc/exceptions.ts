export const ExcArgs = (exc: string, ...args: string[]) => { // replace all placeholders with arguments
  let final = exc; // final output
  let rc = 0; // replace count
  while(final.includes("¬")) {
    final = final.replace("¬", args[rc++]); // replace placeholder with proper argument and add to replace count
  }
  return final;
};

enum Exceptions {
  UnknownLiteral = 'Unknown literal ¬',
  UnreachableIndex = 'Unreachable ¬ in ¬ at index ¬',
  NonArrayIndexing = 'Invalid indexing with ¬ as its type is a ¬ instead of an array',
  SingleQuotedString = 'Invalid character length within single quotes',
  DoubleQuotedCharacter = 'Character variable with double quotes',
  CannotNil = 'Literal ¬ cannot be Nil',
  PathInexistent = 'Path ¬ does not exist'
}
