#!/usr/bin/ruby

#single line comment
puts 'Hello world!'
puts "Hello world!"

=begin This is a "comment" that begins with
=begin and apparently doesn't end until
you get to a line that starts with =end
=end this is also ignored by the interpreter
def factorial(n)
  if n == 0
    1
  else
    n * factorial(n-1)
  end
end

`ls -l`

foo %= not(a && b)
print defined? foo || foo.eql?(10) || foo.equal?(10.0)

"stringToChomp1".chomp!()
"stringToChomp2".chomp()

foo = %q(raw string 1)
foo = %Q[raw string 2]
foo = %{raw string 3}
foo = %!raw string\\\! 4!

#regex stuff
print /regextest1/ =~ 'regextest'
print /regextest2/i =~ 'regextest'
print 5 /regextest3/i #not a regex
print %r[regextest4]xm =~ 'regextest' #dear god why does ruby have so many different syntaxes for the same thing?
print %r|regextest5| =~ 'regextest'
print /\/\\/ #escape test

StaticVariableAccess::Bar

case $age
    when 0 .. 2
      "baby"
    when 3 .. 6
      "little child"
    when 7 .. 12
      "child"
    when 12 .. 18
      # Note: 12 already matched by "child"
      "youth"
    else
      "adult"
    end

[1,2,3].each do |i| print i*2, "\n" end

begin
  do_something
rescue
  recover
ensure
  must_to_do
end

BEGIN {
    #oh god, the colons!
    not_true = false
    foo = false ? :symbol1 :not_a_symbol1
    foo = false ? (true ? :symbol2 : :symbol3) :not_a_symbol2
}

END {
    #do stuff
}

class Person
  attr_reader :name, :age
  def initialize(name, age)
    @name, @age = name, age
  end
  def <=>(person) # Comparison operator for sorting
    @age <=> person.age
  end
  def to_s
    "#@name (#@age)"
  end
end

class ParseError < ExtendedException
  def initialize input, line, pos
    super "Could not parse '#{input}' at line #{line}, position #{pos}"
  end
end
 
raise IdentBeforeNew.new("Foo", 3, 9)

#friggin' heredocs...
#http://ruby-doc.org/docs/ruby-doc-bundle/Manual/man-1.4/syntax.html#here_doc
print <<HEREDOC
Default heredoc body
HEREDOC

print <<"QUOTEDHEREDOC";
Quoted heredoc body
QUOTEDHEREDOC

print <<`BACKQUOTEDHEREDOC`
echo back quoted heredoc body
BACKQUOTEDHEREDOC

print <<'SINGLEQUOTEDHEREDOC'
single quoted heredoc body
SINGLEQUOTEDHEREDOC

print <<"stacked1", <<"stacked2"
stacked heredoc #1
stacked1
stacked heredoc #2
stacked2

if need_define_foo
    eval <<-INDENTED  # delimiters can be indented
        def foo
            print "foo\n"
        end
    INDENTED
end

print <<-'THERE'
    This is single quoted.
    The above used #{a + 1}
    THERE
    
File::open("grocery-list", "w") do |f|
  f << <<GROCERY_LIST
Grocery list
------------
1. Salad mix.
2. Strawberries.*
3. Cereal.
4. Milk.*
 
* Organic
GROCERY_LIST
end

#<< operator should not be interpreted as heredoc
self << a[0]

def foo(s)
    puts s
end

foo <<afterIdent
lol
afterIdent

foo = <<1_a2
lol
1_a2

print "we're still good"
