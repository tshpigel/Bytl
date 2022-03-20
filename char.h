//
//  char.h
//  type
//
//  Created by Tal Shpigel on 2022-03-17.
//

#ifndef char_h
#define char_h

#include "bool.h"
#include "arr.h"
#include "int.h"
#include "sc.h"

class Char {
    char ASCII();
    Bool digit();
    Arr<char> add(Int times = 1);
    Sc tcase();
    char setcase(char caseType);
    char switchcase();
    Sc charsetType();
    Arr<char> dupe(Bool asArray);
};

#endif /* char_h */
