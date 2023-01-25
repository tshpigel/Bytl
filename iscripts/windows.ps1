If ((-Not (where deno)) | out-null) {
    irm https://deno.land/install.ps1 | iex
}

If (-Not ([System.IO.File]::Exists($env:PROGRAMFILES\.bytl.ps1))) {
    Move-item $env:USERPROFILE\Downloads\Bytl-main $env:PROGRAMFILES
    New-item $env:PROGRAMFILES\.bytl.ps1 -type file
    $text = @'
      Function bytl {
      Param (`$file) 
      Function Rdeno {
        Param (`$tsfile, `$opt)
        `$arg = If(`$opt -eq `$null -and `$opt -ne 'no') {`$file} Else {`$opt}
        deno run --allow-read --allow-write `$tsfile `$arg
      }
      Rdeno `$env:PROGRAMFILES\Bytl-main\main\compiler\process\main.ts `$file
      If(`$?) {
        Rdeno './out\`$file.ts' no
      }
    }
'@
    Add-content $env:PROGRAMFILES\.bytl.ps1 $text
    md $env:PROGRAMFILES\.bytl
    New-item $env:PROGRAMFILES\.bytl\localize.bytl -type file
    New-item $env:PROGRAMFILES\.bytl\init.bytl -type file
    "Bytl was successfully setup"
} Else {
    "Bytl is already setup"
}
. $env:PROGRAMFILES\.bytl.ps1
