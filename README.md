# Bytl <img src="https://github.com/tshpigel/Bytl/blob/main/bytl.png" alt="Bytl Icon" title="Bytl Icon" align="right" width="100px" height="100px">
#### (Very much a WIP and most likely not fully up-to-date)

#### A S2S compiler for a statically typed non-OO AI development esoteric programming language made purely in TypeScript Deno
When I decided to start making the design for Bytl, I was thinking of a language where you type as little as possible to write equally as powerful programs as other common languages where you would have to type more. This obviously ended up in shorter and sometimes not as memorable keywords, but it did end up with a lot of shortcuts to do common things such as loops or even switch statements. Bytl also has different syntax from other languages in some cases, as not only are keywords different, but also expressions are made slightly differently. In addition, Bytl can have very complex typing and, types have the option to be become extremely specific. 

Unfortunately, because Bytl uses TypeScript Deno for both compilation and code generation (because I don't know any other language well enough), it is incredibly slow. Even simple programs such as declaring and printing a variable takes a noticeable amount of time. I'm also not very good at programming so there are probably a lot of bugs and the code is very unoptimized.

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
* Consecutive macros unidentified if assigned in an inverse order
* `.bt` extension is unrecognizable
