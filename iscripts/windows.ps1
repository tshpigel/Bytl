If (! where deno | out-null ) {
    irm https://deno.land/install.ps1 | iex
}

If ([System.IO.File]::Exists($env:PROGRAMFILES\.bytl.ps1)) {
    Move-item $env:USERPROFILE\Downloads\Bytl-main $env:PROGRAMFILES
    New-item $env:PROGRAMFILES\.bytl.ps1 -type file
@"
    Function bytl(`$file) { 
        Function Rdeno(`$tsfile `$opt) {
            `$arg = If(`$opt -eq `$null -and `$opt -ne 'no') {`$file} Else {`$opt}
            deno run --allow-read --allow-write `$tsfile `$arg
        }
        Rdeno `$env:PROGRAMFILES\Bytl-main\main\compiler\process\main.ts `$file
        If(`$? -eq 0) {
            Rdeno './out\`$file.ts' no
        }
    }
"@
"Bytl was successfully setup"
} Else {
    "Bytl is already setup"
}
. $env:PROGRAMFILES\.bytl.bash
