// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.
import * as util from "../util";
import type { ScopeType } from "../languages";
export const name = "bash";
export const keywords = [// looping
"while", "for", "in", "do", "done", "until", "if", "fi", "then", "else", "case", "esac", "break", "continue", "select"];
export const customTokens = {
  command: {
    values: ["return", "source", "ac", "adduser", "agetty", "agrep", "arch", "ar", "at", "autoload", "awk", "badblocks", "banner", "basename", "batch", "bc", "bg", "bind", "bison", "builtin", "bzgrep", "bzip2", "caller", "cal", "cat", "cd", "chattr", "chfn", "chgrp", "chkconfig", "chmod", "chown", "chroot", "cksum", "clear", "clock", "cmp", "colrm", "column", "col", "command", "comm", "compgen", "complete", "compress", "coproc", "cpio", "cp", "cron", "crypt", "csplit", "cut", "cu", "date", "dc", "dd", "debugfs", "declare", "depmod", "df", "dialog", "diff3", "diffstat", "diff", "dig", "dirname", "dirs", "disown", "dmesg", "doexec", "dos2unix", "dump", "dumpe2fs", "du", "e2fsck", "echo", "egrep", "enable", "enscript", "env", "eqn", "eval", "exec", "exit", "expand", "export", "expr", "factor", "false", "fdformat", "fdisk", "fgrep", "fg", "file", "find", "finger", "flex", "flock", "fmt", "fold", "free", "fsck", "ftp", "fuser", "getfacl", "getopts", "getopt", "gettext", "getty", "gnome-mount", "grep", "groff", "groupmod", "groups", "gs", "gzip", "halt", "hash", "hdparm", "head", "help", "hexdump", "hostid", "hostname", "host", "hwclock", "iconv", "id", "ifconfig", "infocmp", "info", "init", "insmod", "install", "ipcalc", "ip", "iwconfig", "jobs", "join", "jot", "killall", "kill", "lastcomm", "lastlog", "last", "ldd", "less", "let", "lex", "lid", "ln", "locate", "lockfile", "logger", "logname", "logout", "logrotate", "look", "losetup", "lp", "lsdev", "lsmod", "lsof", "lspci", "lsusb", "ls", "ltrace", "lynx", "lzcat", "lzma", "m4", "mailstats", "mailto", "mail", "makedev", "make", "man", "mapfile", "mcookie", "md5sum", "merge", "mesg", "mimencode", "mkbootdisk", "mkdir", "mke2fs", "mkfifo", "mkisofs", "mknod", "mkswap", "mktemp", "mmencode", "modinfo", "modprobe", "more", "mount", "msgfmt", "mv", "nc", "netconfig", "netstat", "newgrp", "nice", "nl", "nmap", "nm", "nohup", "nslookup", "objdump", "od", "openssl", "passwd", "paste", "patch", "diff", "pathchk", "pax", "pgrep", "pidof", "ping", "pkill", "popd", "pr", "printenv", "printf", "procinfo", "pstree", "ps", "ptx", "pushd", "pwd", "quota", "rcp", "rdev", "rdist", "readelf", "readlink", "readonly", "read", "reboot", "recode", "renice", "reset", "resize", "restore", "rev", "rlogin", "rmdir", "rmmod", "rm", "route", "rpm2cpio", "rpm", "rsh", "rsync", "runlevel", "run-parts", "rx", "rz", "sar", "scp", "script", "sdiff", "sed", "seq", "service", "setfacl", "setquota", "setserial", "setterm", "set", "sha1sum", "shar", "shopt", "shred", "shutdown", "size", "skill", "sleep", "slocate", "snice", "sort", "source", "sox", "split", "sq", "ssh", "stat", "strace", "strings", "strip", "stty", "sudo", "sum", "suspend", "su", "swapoff", "swapon", "sx", "sync", "sz", "tac", "tail", "tar", "tbl", "tcpdump", "tee", "telinit", "telnet", "tex", "texexec", "time", "times", "tmpwatch", "top", "touch", "tput", "traceroute", "true", "tr", "tset", "tsort", "tty", "tune2fs", "typeset", "type", "ulimit", "umask", "umount", "uname", "unarc", "unarj", "uncompress", "unexpand", "uniq", "units", "unlzma", "unrar", "unset", "unsq", "unzip", "uptime", "usbmodules", "useradd", "userdel", "usermod", "users", "usleep", "uucp", "uudecode", "uuencode", "uux", "vacation", "vdir", "vmstat", "vrfy", "wait", "wall", "watch", "wc", "wget", "whatis", "whereis", "which", "whoami", "whois", "who", "write", "w", "xargs", "yacc", "yes", "zcat", "zdiff", "zdump", "zegrep", "zfgrep", "zgrep", "zip"],
    boundary: "\\b"
  },
  specialVariable: {
    values: ["$$", "$?", "$#"],
    boundary: ""
  }
};
export const scopes: Record<string, ScopeType[]> = {
  string: [['"', '"', util.escapeSequences.concat(['\\"']), false], ["'", "'", ["'", "\\\\"], false]],
  hashBang: [["#!", "\n", [], true]],
  comment: [["#", "\n", [], true]],
  verbatimCommand: [["`", "`", ["\\`", "\\\\"], false]],
  variable: [["$", {
    length: 1,
    regex: /[\W]/
  }, [], true]]
};
export const identFirstLetter = /[A-Za-z_]/;
export const identAfterFirstLetter = /\w/;
export const namedIdentRules = {
  // function
  precedes: [[util.whitespace, {
    token: "punctuation",
    values: ["("]
  }, util.whitespace, {
    token: "punctuation",
    values: [")"]
  }, util.whitespace, {
    token: "punctuation",
    values: ["{"]
  }]]
};
export const operators = [// arithmetic
"++", "--", "=", "/", "+", "*", "-", "!=", // other stuff
".", "|", ":", ",", "!", "?", ">>", ">", "<", ";;", ";"];