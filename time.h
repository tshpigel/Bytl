//
//  time.h
//  type
//
//  Created by Tal Shpigel on 2022-03-17.
//

#ifndef time_h
#define time_h

#include <variant>

#include "int.h"
#include "fpn.h"
#include "dfpn.h"
#include "bool.h"
#include "sc.h"

class Time {
    this now();
    Int day(Bool year);
    Int year();
    Int month();
    Sc month();
    Int hour();
    std::variant<Fpn, Dfpn> second();
    std::variant<Fpn, Dfpn> millisecond();
};

#endif /* time_h */
