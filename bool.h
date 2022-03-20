//
//  bool.h
//  type
//
//  Created by Tal Shpigel on 2022-03-17.
//

#ifndef bool_h
#define bool_h

#include "val.h"

class Bool {
    bool compare(bool b, Val v) {
        if(b === !!v) {
            return true;
        } else return false;
    }
};

#endif /* bool_h */
