//
//  mod.h
//  type
//
//  Created by Tal Shpigel on 2022-03-17.
//

#ifndef mod_h
#define mod_h

#include <functional>

#include "fnc.h"
#include "sc.h"
#include "glob.h"

class Mod {

    Mod(Sc name, Glob target, Fnc.lambda func);
    ~Mod();
};

Mod::Mod(Sc name, Glob target, Fnc func) {
    
}

#endif /* mod_h */
