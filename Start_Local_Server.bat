@echo off
title Yash Industries - Local Web Server
echo ========================================================
echo    Starting Local Web Server for Yash Industries...
echo ========================================================
echo.
echo Running at http://localhost:8080/
echo Opening browser...
echo Press Ctrl+C to stop the server.
echo.
start http://localhost:8080/
powershell -NoProfile -ExecutionPolicy Bypass -Command "$s = [System.Net.HttpListener]::new(); $s.Prefixes.Add('http://localhost:8080/'); $s.Start(); while ($s.IsListening) { $c = $s.GetContext(); $p = '.' + $c.Request.RawUrl.Split('?')[0]; if ($p -eq './') { $p = './index.html' }; if (Test-Path $p) { $b = [System.IO.File]::ReadAllBytes($p); $e = [System.IO.Path]::GetExtension($p); $t = switch ($e) { '.html' { 'text/html' } '.css' { 'text/css' } '.js' { 'application/javascript' } '.pdf' { 'application/pdf' } default { 'application/octet-stream' } }; $c.Response.ContentType = $t; $c.Response.OutputStream.Write($b, 0, $b.Length) } else { $c.Response.StatusCode = 404 }; $c.Response.Close() }"
