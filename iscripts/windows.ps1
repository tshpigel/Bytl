If (!(deno --version)) {
    irm https://deno.land/install.ps1 | iex
}

If ([System.IO.File]::Exists($env:USERPROFILE\.bytl.bash)) {
    Move-item $env:USERPROFILE\Downloads\Bytl-main %homepath%%homedrive%
    New-item $env:USERPROFILE\.bytl.bash -type file
@"
    Function bytl(`$file) { 
        Function Rdeno(`$tsfile `$opt) {
            `$arg = If(`$opt -eq `$null -and `$opt -ne 'no') {`$file} Else {`$opt}
            deno run --allow-read --allow-write `$tsfile `$arg
        }
        Rdeno `$env:USERPROFILE\Bytl-main\main\compiler\process\main.ts `$file
        If(`$? -eq 0) {
            Rdeno './out\`$file.ts' no
        }
    }
"@
} Else {
    echo "Bytl is already installed"
}
. $env:USERPROFILE\.bytl.bash
