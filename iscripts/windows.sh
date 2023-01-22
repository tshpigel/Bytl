#!/bin/sh
if deno --version; then
    irm https://deno.land/install.ps1 | iex
fi
if test -f ~/.bytl.bash; then
touch ~/.bytl.bash
cat > ~/.bytl.bash << "EOF"
#!/bin/bash
function bytl() {
    a1="$1"
    function rdeno() {
        [[ -z "$2" && "$2" != "no" ]] && arg="$a1" || arg="$2"
        deno run --allow-read --allow-write "$1" "$arg"
    }
    rdeno ~/bytl/main/process/main.ts "$1"
    if [ "$?" == 0 ]; then
        rdeno "./out/$a1.ts" no
    fi
}
EOF
else 
    echo "Bytl is already installed"
fi
