REM http://en.wikipedia.org/wiki/Batch_file#Advanced_batch_example_-_conditional_shutdown
@echo off
color 3
title Conditional Shutdown
set /p name=enter a name:
:start
cls
echo Hi, %name%
echo.
echo 1.Shutdown
echo 2.Quit
:invalid_choice
set /p choice=enter your choice 1,2:
if %choice%==1 goto shutdown
if %choice%==2 exit
echo invalid choice: %choice%
goto invalid_choice

:shutdown
cls
set /p sec=enter the number of seconds that you wish the computer to shutdown in:
set /p message=enter the shutdown message you wish to display:
shutdown -s -f -t %sec% -c "%message%"
echo shutdown initiated at %time%
set /p cancel=type cancel to stop shutdown
if %cancel%==cancel shutdown -a
if %cancel%==cancel goto start

:: http://en.wikipedia.org/wiki/Batch_file#Text_output_with_stripped_CR.2FLF
set foo=Line 1
echo y | set /p tmp="%foo%"
echo Line 2
echo Line 3

REM http://en.wikipedia.org/wiki/Batch_file#Sleep_.2F_Scripted_Delay
for /f "tokens=1-3 delims=:.," %%a in ("%time%") do set /a h=%%a, m=1%%b%%100, s=1%%c%%100, end=(h*60+m)*60+s+%1
:wait
for /f "tokens=1-3 delims=:.," %%a in ("%time%") do set /a h=%%a, m=1%%b%%100, s=1%%c%%100, current=(h*60+m)*60+s
if %current% lss %end% goto wait
