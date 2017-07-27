#!/bin/bash

echo "Starting the script, yo"
#this is a comment

DIR=/var/log
cd $DIR

my_function () {
    rm -rf "$1"
    return 0
}

for planet in Mercury Venus Earth Mars Jupiter Saturn Uranus Neptune Pluto
do
  echo $planet  # Each planet on a separate line.
done

my_function $DIR

if [ $# -ne 2 ]
then
  echo "Usage: `basename $0` search_string filename"
  exit 65
fi

while [ "$var1" != "end" ]     # while test "$var1" != "end"
do
  echo "Input variable #1 (end to exit) "
  read var1                    # Not 'read $var1' (why?).
  echo "variable #1 = $var1"   # Need quotes because of "#" . . .
  # If input is 'end', echoes it here.
  # Does not test for termination condition until top of loop.
  echo
done

count=1
let "count += 1"

case "$Keypress" in
  [[:lower:]]   ) echo "Lowercase letter";;
  [[:upper:]]   ) echo "Uppercase letter";;
  [0-9]         ) echo "Digit";;
  *             ) echo "Punctuation, whitespace, or other";;
esac

echo $?
echo `echo running a command`
exit 0 #exit
