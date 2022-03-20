//
//  arr.h
//  type
//
//  Created by Tal Shpigel on 2022-03-19.
//

#ifndef arr_h
#define arr_h

#include <vector>

#include "num.h"
#include "val.h"
#include "int.h"
#include "char.h"
#include "bool.h"
#include "sc.h"

using namespace std;

class Arr {
private:
    bool md;
    bool uniq;
public:
    union sortArr {
        Num n;
        Char c;
    };
    union sortFormat {
        Sc s;
        vector<sortArr> v;
    };
    Int index(Val element, Int times = 1);
    Int length();
    vector<Val> ins(Int position = this::length() - 1, vector<Val>);
    vector<Val> rem(vector<Val>);
    vector<Val> sort(sortFormat sf);
    vector<Val> rev();
    vector<Val> select(Int start, Int amount);
    Bool has(Val element);
    vector<Val> flat(Int amount = 0);
    vector<Val> fat(Int amount);
    vector<Num> sum();
    Int serie(Int last);
    vector<Val> shuf();
};


#endif /* arr_h */
