#!/bin/bash
if deno --version; then
    curl -fsSL https://deno.land/x/install/install.sh | sh
fi
if test -f ~/.bytl.bash; then
mv 
touch ~/.bytl.bash
cat > ~/.bytl.bash << "EOF"
#!/bin/bash
function bytl() {
    a1="$1"
    function rdeno() {
        [[ -z "$2" && "$2" != "no" ]] && arg="$a1" || arg="$2"
        deno run --allow-read --allow-write "$1" "$arg"
    }
    rdeno ~/Bytl-main/main/compiler/process/main.ts "$1"
    if [ "$?" == 0 ]; then
        rdeno "./out/$a1.ts" no
    fi
}
EOF
else 
    echo "Bytl is already installed"
fi