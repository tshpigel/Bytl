# Bytl <img src="https://github.com/tshpigel/Bytl/blob/main/bytl.png" alt="Bytl Icon" title="Bytl Icon" align="right" width="100px" height="100px">
#### (Very much a WIP and most likely not fully up-to-date)

#### A S2S compiler for a statically typed non-OO AI development esoteric programming language made purely in TypeScript Deno
Bytl is meant to be an esoteric language with shortened keywords and more bare syntax. This comes at the cost of memorability (keywords are shorter, but less memorable) but the language is only meant for casual/non-professional use. Bytl also has different syntax from other languages in some cases, as not only are keywords different, but also expressions are made slightly differently. In addition, Bytl can have very complex typing giving types the option to become extremely specific. 

Unfortunately, because Bytl uses TypeScript Deno for both compilation and code generation (because I don't know any other language well enough), its compilation and runtime is slower than other common languages. Even simple programs such as declaring and printing a variable may take a noticeable amount of time. I'm also not very good at programming so there are probably a lot of bugs and the code is currently unoptimized. 

Essentially, all the time saved by writing the code in Bytl will be made up for during runtime.

## Setup (no script currently works)
#### First download the repository then unzip the folder
Make sure the `Bytl-main` folder is in `Downloads` on either system
### For Unix Systems (Terminal)
```bash
curl -fsSL https://raw.githubusercontent.com/tshpigel/Bytl/main/iscripts/unix.sh | sh
```
### For Windows Systems (PowerShell)
```ps1
iex (iwr https://raw.githubusercontent.com/tshpigel/Bytl/main/iscripts/windows.ps1)
```

## Current Known Bugs
* Column number shoots up at the end of a nested statement (line number decreases by 1 as well)
* `.bt` extension is unrecognizable

## Major features yet to be implemented for beta version
* Procedures
* Associations
* Relative Creation
* Special Types
* Loops
* Switch Statements
* Neural Network Type
* Context
* Fully Complex Types
