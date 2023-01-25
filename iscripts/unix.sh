#!/bin/sh
if ! which deno >/dev/null; then
    curl -fsSL https://deno.land/x/install/install.sh | sh
    echo 'DENO_INSTALL="~/.deno"' >> ~/.bashrc
    echo 'PATH="$DENO_INSTALL/bin:$PATH' >> ~/.bashrc
    if ! test -f ~/.zshrc; then
        touch ~/.zshrc
        echo 'DENO_INSTALL="~/.deno"' >> ~/.zshrc
        echo 'PATH="$DENO_INSTALL/bin:$PATH' >> ~/.zshrc
    fi
    export DENO_INSTALL="~/.deno"
    export PATH="$DENO_INSTALL/bin:$PATH"
fi
if ! test -f ~/.bytl.sh; then
mv ~/Downloads/Bytl-main ~
touch ~/.bytl.sh
mkdir ~/.bytl
touch ~/.bytl/localize.bytl
touch ~/.bytl/init.bytl
cat > ~/.bytl.sh << "EOF"
#!/bin/sh
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
echo "Bytl was successfully setup"
else 
    echo "Bytl is already properly setup"
fi

source ~/.bytl.sh
