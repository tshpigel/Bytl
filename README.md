# Bytl
#### A S2S compiler for a statically typed non-OO AI development esoteric programming language made purely in TypeScript Deno
When I decided to start making the design for Bytl, I was thinking of a language where you type as little as possible to write equally as powerful programs as other common languages where you would have to type more. This obviously ended up in shorter and sometimes not as memorable keywords, but it did end up with a lot of shortcuts to do common things such as loops or even switch statements. Bytl also has different syntax from other languages in some cases, as not only are keywords different, but also expressions are made slightly differently. In addition, Bytl can have very complex typing and, types have the option to be become extremely specific. 

Unfortunately, because Bytl uses TypeScript Deno for both compilation and code generation (because I don't know any other language well enough), it is incredibly slow. Even simple programs such as declaring and printing a variable takes a noticeable amount of time. 
***
## Basic Tutorial
> All Bytl code is within either a `.bytl` or a `.bt` file
>
> More info can be found in the [official documentation](https://www.duckduckgo.com), source code in `docs`

### Basic Data Types
* String of Characters `sc`
* Number `num`
* Boolean `bool`
* Array `arr`
* Null/Nil `nil`
* Procedure `proc`
* Association `assoc`

```
num n = 5 __ Yes, single line comments are double underscores and there is no delimeter
```

Some data types have sub-types that branch off of their parent type with identical properties, besides a rule defining a discrepancy. `int`, for example, is a subtype of `num`, but has a rule defining the value must be divisible by 1.

### Kinetic Types (AKA k(ine)types)
Kinetic types are added properties to the data type of a variable that modify what the value of the variable can be (referenced using a period (`.`)).

```
num.cannil n = 5
```
By default, Bytl variables cannot be `nil` so there is a built-in ktype that changes the default specifically for `n` in this case so that if `n` was to be `nil` eventually, it wouldn't throw an exception
```
n = nil __ Variables are mutable by default
```
Kinetic types are also chainable, so if `n` not only needed to be able to be `nil`, but also be unsigned, then simply setting the type to `num.cannil.usn` works fine.

### Coalesced and Coalescing Types
To create an array in Bytl, simply 
```
arr a = [1 2 3] __ arrays don't require comma separation
``` 
will suffice. Although if `a` needs to contain at least one string, then it is possible to coalesce `arr` with `sc` for `a`. 
```
arr[sc] a = ["there is one string" 1 2 3]
```
A data type can either be coalescing, or not, though all data types are coalescable. Only data types that may require another type to be specified (procedure return type, array require type, etc.) are coalescing as they are the initiators of the coalescence.

```
arr.cannil[num.usn] a = nil __ The cannil ktype overrides the num coalesced type
```
As shown above, coalescing types can be combined with ktypes.

### Procedures
Procedures are simply variables that contain a list of actions. There are two subtypes of procedures, that being functions (`fnc`, and does not return a value), and algorithms (`alg`, and must return a value). Algorithms and procedures are both coalescing types (if you coalesce a procedure it automatically converts to an algorithm, and if you don't it automatically converts to a function) while functions are not, as they have no return type to coalesce with.

Procedure syntax is quite different to most programming languages
```
proc <sc argument> print = (
  >> argument
)
```
Here, the code is creating a variable `print` with a string argument, `argument`, and then prints `argument` using the print command `>>`. Calling a procedure does not require parentheses, and instead `>> "string"` compiles and runs successfully.

```
alg[int] five1 = (
  rn 5 __ 'rn' is the keyword to return a value
)
int five2 = 5

>> five1, five2 __ 5 and 5
```
> _Note that if code becomes too unreadable, surrounding expressions with regular parentheses `()` can help, and does nothing to the code except create precedence which usually isn't an issue_

Because procedures are just variables, they are accessed/called in the same way as shown in the example above

### Modifiers
Modifiers are similar to ktypes in the sense that they modify default code. Although ktypes fall short quite quickly as they can only modify the value of a declared variable. Modifiers can modify literally anything. 
```
sc string = "string"
>> string _ idxo "i" {{ NEGATIVE }}
```
So... there's some new syntax to uncover here. First of all, the underscore is an accessor for procedures of a variable and `idxo` is the name of the procedure which returns the index of the character `'i'` within the string, `string`. But there's a catch. The `{{ INVERSE }}` is a reference to a modifier with the name of `NEGATIVE` (and yes it does come after the line ender). This specific built-in modifier changes the `idxo` output from returning an index from left to right (`s` is at index 0 and `t` is at index 1), to returning the value from right to left (`g` is at index 0 and `n` is at index 1). Admittedly, this isn't the most useful piece of code to ever exist, although it has a lot of potential. 

### Associations
Associations are essentially a super hash map. A normal hashmap contains a unique key, and a value that is accessed through the key. Not only is this possible with associations, but they can have multiple keys and values.
```
assoc[@sc int] map = <
  "one" 1,
  "two" 2,
  "three" 3
>
```
The above is an example of a classic hashmap, which, to give an easier understanding (if you don't know javascript i'm sorry), is the equivalent javascript code 
```js
let map = {
  "one": 1,
  "two": 2,
  "three": 3
};
```
Now, you might be asking: why go through all the trouble to declare types for the hashmap, or why does it have to be so convoluted for such simple code. Well if you wanted multiple access points, you could do the following 
```
assoc[@int @sc arr[int]] superMap = <
  1 "one" [1],
  2 "two" [2 2],
  3 "three" [3 3 3]
>
``` 
Obviously the final element of each set in the association is unecessary and frankly useless, but this shows an _association_ between any of number of elements (greater than 1)
