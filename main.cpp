//
//  main.cpp
//  type
//
//  Created by Tal Shpigel on 2022-03-11.
//

// #include <stdio.h>
#include <iostream>
#include <fstream>
#include <filesystem>
//#include <ifstream>

#include "types.h"
using namespace std;

int main(int argc, char ** argv) { // starting declaration
    cout << "test" << endl;
    if(argc > 1) { // if something inputted as a cma
        cout << "test number 2" << endl;
        for(int i = 1; i < argc; i++) { // loop through all the inputted files
            //fstream file;
            string str;
            string stra = str.assign(argv[i]); // convert char* to string
            bool withExt = filesystem::exists(stra + ".bytl");
            bool withoutExt = filesystem::exists(stra);
            
            cout << withExt << " and " << withoutExt << endl;
            for(const auto & f : filesystem::directory_iterator("/Users/talshpigel/Documents/Coding\ Language")){
                if(string(f.path()).find(stra + ".bytl") != string::npos) {
                    ifstream file;
                    file.open(f.path());
                    if(file) { // check when it's open
                        string tmp;
                        while(getline(file, tmp)) { // loop through file line by line
                            cout << tmp << "\n";
                        }
                        file.close(); // close file object
                    }
                    break;
                }
            }
            
            /*if(withExt || withoutExt) { // check if file exists
                // open file
                if(withoutExt)
                    {file.open(stra + ".txt", ios::out);}
                else
                    {file.open(stra, ios::out);}
                if(file.is_open()) { // check when it's open
                    string tmp;
                    while(getline(file, tmp)) { // loop through file line by line
                        cout << tmp;
                    }
                    file.close(); // close file object
                }
            } else { // if file doesn't exist then exit program
                return 1;
            }*/
        }
    } else { // if there is no cma the exit program
        return 1;
    }
}
