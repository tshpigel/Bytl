# Bytl
#### A S2S compiler for a statically typed non-OO AI development programming language made purely in TypeScript Deno
When I decided to start making the design for Bytl, I was thinking of a language where you type as little as possible to write equally as powerful programs as other common languages where you would have to type more. This obviously ended up in shorter and sometimes not as memorable keywords, but it did end up with a lot of shortcuts to do common things such as loops or even switch statements. Bytl also has different syntax from other languages in some cases, as not only are keywords different, but also expressions are made slightly differently. In addition, Bytl can have very complex typing and, types have the option to be become extremely specific. 

Unfortunately, because Bytl uses TypeScript Deno for both compilation and code generation (because I don't know any other language well enough), it is incredibly slow. Even simple programs such as declaring and printing a variable takes a noticeable amount of time. 
***
## Basic Tutorial
> More info can be found in the <a href="https://www.duckduckgo.com" target="_blank">official documentation</a>, source code in `docs`

### Basic Data Types
* String of Characters `sc`
* Number `num`
* Boolean `bool`
* Array `arr`
* Null/Nil `nil`
* Procedure `proc`

```
num n = 5` __ Yes, single line comments are used through double underscores, and the line separator/ender is a backtick
```

Some data types have sub-types that branch off of their parent type with identical properties, besides a rule defining a discrepancy. `int`, for example, is a subtype of `num`, but has a rule defining the value must be divisible by 1.

### Kinetic Types (AKA kinetypes or ktypes)
Kinetic types are added properties to the data type of a variable that modify what the value of the variable can be (referenced using a period (`.`)).

```
num.cannil n = 5`
```
By default, Bytl variables cannot be `nil` so there is a built-in ktype that changes the default specifically for `n` in this case so that if `n` was to be `nil` eventually, it wouldn't throw an exception
```
n = nil` __ Variables are mutable by default
```
Kinetic types are also chainable, so if `n` not only needed to be able to be `nil`, but also be unsigned, then simply setting the type to `num.cannil.usn` works fine.
### Coalesced and Coalescing Types
To create an array in Bytl, simply 
```
arr a = [1, 2, 3]`
``` 
will suffice. Although if `a` needs to contain at least one string, then it is possible to coalesce `arr` with `sc` for `a`. 
```
arr-sc a = ["there is one string", 1, 2, 3]`
```
A data type can either be coalescing, or not, though all data types are coalescable. Only data types that may require another type to be specified (procedure return type, array require type, etc.) are coalescing as they are the initiators of the coalescence.

```
arr.cannil-num.usn a = nil` __ The cannil ktype overrides the num coalesced type
```
As shown above, coalescing types can be combined with ktypes.
