#!/usr/bin/perl
use strict;
use warnings;
use IO::Handle;
use feature ":5.10";

print "Hello \"world\\\"";
print 'Hello \'world\\\'s best';
print 42;

my $animal = "camel";

my $content = '';
open my $fh, "<", "foo" or die $!;
{
    local $/;
    $content = <$fh>;
}
close $fh;

sub handler { # 1st argument is signal name
    my($sig) = @_;
    print "Caught a SIG$sig--shutting down\n";
    close(LOG);
    exit(0);
}
$SIG{'INT'} = \&referenceOrSomethingIGuess;

local $SIG{__WARN__} = sub { die $_[0] };
eval $proggie;

my @mixed = ("camel", 42, 101.23);
print $mixed[$#mixed]; #how do perl programmers remember all this stuff?
@animals[1..$#animals]

my %fruit_color = (
    apple => "red",
    banana => "yellow",
);
my @fruits = keys %fruit_colors;
my @colors = values %fruit_colors;

given($foo) {
    when (undef) {
        say '$foo is undefined';
    }
    when ("foo") {
        say '$foo is the string "foo"';
    }
    when ([1,3,5,7,9]) {
        say '$foo is an odd digit';
        continue; # Fall through
    }
    when ($_ < 100) {
        say '$foo is numerically less than 100';
    }
    when (\&complicated_check) {
        say 'a complicated check for $foo is true';
    }
    default {
        die q(I don't know what to do (with) $foo);
    }
}

if (1) {
    #do stuff
} elsif (0) {
    #do other stuff
} else {
    until (1) {
        foreach my $key (keys %hash) {
            print "The value of $key is $hash{$key}\n";
        }
    }
}

#regex literal mayhem

while (<>) {
    if (?^$?) {
        # blank line between header and body
    }
} continue {
    reset if eof; # clear ?? status for next file
}

$re = qr/$pattern/;
$string =~ /foo${re}bar/;
$string =~ //;
$string =~ ??;
$string =~ /$re/;
$count = ($paragraph =~ s/Mister\b/Mr./g);
$ARGV[1] =~ tr/A-Z/a-z/;    # canonicalize to lower case
tr [\200-\377]
    [\000-\177];

y/i/hate/perl; #seriously

$cnt = tr/0-9//; # count the digits in $_

#remove C-like comments I can't believe I got this pile of sewage to parse correctly
$program =~ s {
    /\* # Match the opening delimiter.
    .*? # Match a minimal number of characters.
    \*/ # Match the closing delimiter.
} []gsx;

#friggin' heredocs...
print <<HEREDOC;
Default heredoc body
HEREDOC

print <<"QUOTEDHEREDOC";
Quoted heredoc body
QUOTEDHEREDOC

print <<`BACKQUOTEDHEREDOC`;
echo back quoted heredoc body
BACKQUOTEDHEREDOC

print <<'SINGLEQUOTEDHEREDOC';
single quoted heredoc body
SINGLEQUOTEDHEREDOC

print <<"stacked1", <<"stacked2";
stacked heredoc #1
stacked1
stacked heredoc #2
stacked2

($quote = <<'FINIS') =~ s/^\s+//gm;
    The Road goes ever on and on,
    down from the door where it began.
FINIS

#doc comments
=pod
=head1 Heading Text
=cut this should not be parsed
sub { say "yay!"; }
