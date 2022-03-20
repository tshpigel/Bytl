//
//  sc.h
//  type
//
//  Created by Tal Shpigel on 2022-03-17.
//

#ifndef sc_h
#define sc_h

#include <string>

#include "rgx.h"
#include "bool.h"
#include "int.h"
#include "char.h"
#include "arr.h"

using namespace std;

class Sc {
private:
    bool raw;
public:
    union rsc {
        Rgx r;
        string s;
        Char c;
    }; union rs {
        Rgx r;
        string s;
    }; union sc {
        string s;
        Char c;
    };
    string sel(unsigned Int start, unsigned Int end);
    Bool inc(rsc checker);
    string lcase();
    string ucase();
    Int len();
    string repl(rs checker, string replacer);
    string trim(Bool start = false, Bool end = false);
    Arr<char> ascii();
    Int idxo(rsc checker, Int amount = 1);
    Arr<string> split(sc splitter);
    string rep(unsigned Int amount);
    Arr<string> join(string joiner);
};

#endif /* sc_h */
