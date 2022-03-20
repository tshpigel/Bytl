//
//  glob.h
//  type
//
//  Created by Tal Shpigel on 2022-03-17.
//

#ifndef glob_h
#define glob_h

#include "val.h"
#include "bool.h"
#include "mod.h"
#include "sc.h"
#include "arr.h"

class Glob {
private:
    bool cannil;
    bool obj;
    bool immute;
    bool base;
    bool init;
    bool dync;
    bool stype;
    bool uom;
    bool instance;
public:
    void strict();
    void loose();
    void event(Val variable);
    void mute(const Val constant);
    Bool nilq(Val variable);
    void set(Mod modifier);
    Sc Dtype(Val variable);
}

#endif /* glob_h */
