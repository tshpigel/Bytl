If (!(deno --version)) {
    irm https://deno.land/install.ps1 | iex
}

If ([System.IO.File]::Exists(C:\Users\.bytl.bash)) {
    Move-item %homepath%%homedrive%\Downloads\Bytl-main %homepath%%homedrive%
    New-item %homepath%%homedrive%\.bytl.bash -type file
@"
    Function bytl(`$file) { 
        Function Rdeno(`$tsfile `$opt) {
            `$arg = If(`$opt -eq `$null -and `$opt -ne 'no') {`$file} Else {`$opt}
            deno run --allow-read --allow-write `$tsfile `$arg
        }
        Rdeno %homepath%%homedrive%\Bytl-main\main\compiler\process\main.ts `$file
        If(`$? -eq 0) {
            Rdeno './out\`$file.ts' no
        }
    }
"@
} Else {
    echo "Bytl is already installed"
}
. %homepath%%homedrive%\.bytl.bash
