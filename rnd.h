//
//  rnd.h
//  type
//
//  Created by Tal Shpigel on 2022-03-17.
//

#ifndef rnd_h
#define rnd_h

#include <variant>

#include "int.h"
#include "fpn.h"
#include "char.h"
#include "val.h"
#include "arr.h"
#include "time.h"
#include "sc.h"

class Rnd {
    Rnd::Rnd(Int max);
    std::variant<Int, Fpn> rand(Int min, Int max, Int precision = 0, Int times = 1);
    Char randChar(Int repetitions = 1);
    Sc randLetter(Sc string, Int length);
    Val randItem(Arr<Val> a);
    Time randTime(Time start, Time end);
    
};

#endif /* rnd_h */
