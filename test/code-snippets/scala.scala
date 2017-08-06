object addressbook {

  case class Person(name: String, age: Int)

  /** An AddressBook takes a variable number of arguments
   *  which are accessed as a Sequence
   */
  class AddressBook(a: Person*) {
    private val people: List[Person] = a.toList

    /** Serialize to XHTML. Scala supports XML literals
     *  which may contain Scala expressions between braces,
     *  which are replaced by their evaluation
     */
    def toXHTML =
      <table cellpadding="2" cellspacing="0">
        <tr>
          <th>Name</th>
          <th>Age</th>
        </tr>
        { for (val p <- people) yield
            <tr>
              <td> { p.name } </td>
              <td> { p.age.toString() } </td>
            </tr> 
        }
      </table>;
  }

  /** We introduce CSS using raw strings (between triple
   *  quotes). Raw strings may contain newlines and special
   *  characters (like \) are not interpreted.
   */
  val header =
    <head>
      <title>
        { "My Address Book" }
      </title>
      <style type="text/css"> {
     """table { border-right: 1px solid #cccccc; }
        th { background-color: #cccccc; }
        td { border-left: 1px solid #acacac; }
        td { border-bottom: 1px solid #acacac;"""}
      </style>
    </head>;

  val people = new AddressBook(
    Person("Tom", 20),
    Person("Bob", 22),
    Person("James", 19));

  val page =
    <html>
      { header }
      <body>
       { people.toXHTML }
      </body>
    </html>;

  def main(args: Array[String]) {
    println(page)
  }
}

object callccInterpreter {

  type Answer = Value;

  /** 
   * A continuation monad. 
   */
  case class M[A](in: (A => Answer) => Answer) {
    def bind[B](k: A => M[B])          = M[B](c => in (a => k(a) in c))
    def map[B](f: A => B): M[B]        = bind(x => unitM(f(x)))
    def flatMap[B](f: A => M[B]): M[B] = bind(f)
  }

  def unitM[A](a: A) = M[A](c => c(a))

  def id[A] = (x: A) => x
  def showM(m: M[Value]): String = (m in id).toString()

  def callCC[A](h: (A => M[A]) => M[A]) =
    M[A](c => h(a => M[A](d => c(a))) in c)

  type Name = String

  trait Term
  case class Var(x: Name) extends Term
  case class Con(n: int) extends Term
  case class Add(l: Term, r: Term) extends Term
  case class Lam(x: Name, body: Term) extends Term
  case class App(fun: Term, arg: Term) extends Term
  case class Ccc(x: Name, t: Term) extends Term

  trait Value
  case object Wrong extends Value {
   override def toString() = "wrong"
  }
  case class Num(n: Int) extends Value {
    override def toString() = n.toString()
  }
  case class Fun(f: Value => M[Value]) extends Value {
    override def toString() = "<function>"
  }

  type Environment = List[Pair[Name, Value]];

  def lookup(x: Name, e: Environment): M[Value] = e match {
    case List() => unitM(Wrong)
    case Pair(y, b) :: e1 => if (x == y) unitM(b) else lookup(x, e1)
  }

  def add(a: Value, b: Value): M[Value] = Pair(a, b) match {
    case Pair(Num(m), Num(n)) => unitM(Num(m + n))
    case _ => unitM(Wrong)
  }

  def apply(a: Value, b: Value): M[Value] = a match {
    case Fun(k) => k(b)
    case _ => unitM(Wrong)
  }

  def interp(t: Term, e: Environment): M[Value] = t match {
    case Var(x) => lookup(x, e)
    case Con(n) => unitM(Num(n))
    case Add(l, r) => for (val a <- interp(l, e);
                        val b <- interp(r, e);
                        val c <- add(a, b))
                      yield c
    case Lam(x, t) => unitM(Fun(a => interp(t, Pair(x, a) :: e)))
    case App(f, t) => for (val a <- interp(f, e);
                        val b <- interp(t, e);
                        val c <- apply(a, b))
                      yield c
    case Ccc(x, t) => callCC(k => interp(t, Pair(x, Fun(k)) :: e))
  }

  def test(t: Term): String = showM(interp(t, List()))

  val term0 = App(Lam("x", Add(Var("x"), Var("x"))), Add(Con(10), Con(11)))
  val term1 = App(Con(1), Con(2))
  val term2 = Add(Con(1), Ccc("k", Add(Con(2), App(Var("k"), Con(4)))))

  def main(args: Array[String]) {
    println(test(term0))
    println(test(term1))
    println(test(term2))
  }
}

// Contributed by Daniel Gronau
import scala.annotation._

trait Func[T] {
    val zero: T
    def inc(t: T): T
    def dec(t: T): T
    def in: T
    def out(t: T): Unit
}

object ByteFunc extends Func[Byte] {
  override val zero: Byte = 0
  override def inc(t: Byte) = ((t + 1) & 0xFF).toByte
  override def dec(t: Byte) = ((t - 1) & 0xFF).toByte
  override def in: Byte = readByte
  override def out(t: Byte) { print(t.toChar) }
}

case class Tape[T](left: List[T], cell: T, right: List[T])(implicit func: Func[T]) {
  private def headOf(list:List[T]) = if (list.isEmpty) func.zero else list.head
  private def tailOf(list:List[T]) = if (list.isEmpty) Nil else list.tail
  def isZero = cell == func.zero
  def execute(ch: Char) = (ch: @switch) match {
   case '+' => copy(cell = func.inc(cell))
   case '-' => copy(cell = func.dec(cell))
   case '<' => Tape(tailOf(left), headOf(left), cell :: right)
   case '>' => Tape(cell :: left, headOf(right), tailOf(right))
   case '.' => func.out(cell); this
   case ',' => copy(cell = func.in)
   case '[' | ']' => this
   case _ => error("Unexpected token: " + ch)
  }
}

object Tape {
  def empty[T](func: Func[T]) = Tape(Nil, func.zero, Nil)(func)
}

class Brainfuck[T](func:Func[T]) {

  def execute(p: String) {
    val prog = p.replaceAll("[^\\+\\-\\[\\]\\.\\,\\>\\<]", "")

    @tailrec def braceMatcher(pos: Int, stack: List[Int], o2c: Map[Int, Int]): Map[Int,Int] =
      if(pos == prog.length) o2c else (prog(pos): @switch) match {
        case '[' => braceMatcher(pos + 1, pos :: stack, o2c)
        case ']' => braceMatcher(pos + 1, stack.tail, o2c + (stack.head -> pos))
        case _ => braceMatcher(pos + 1, stack, o2c)
      }

    val open2close = braceMatcher(0, Nil, Map())
    val close2open = open2close.map(_.swap)

    @tailrec def ex(pos:Int, tape:Tape[T]): Unit =
      if(pos < prog.length) ex((prog(pos): @switch) match {
          case '[' if tape.isZero => open2close(pos)
          case ']' if ! tape.isZero => close2open(pos)
          case _ => pos + 1
        }, tape.execute(prog(pos)))

    println("---running---")
    ex(0, Tape.empty(func))
    println("\n---done---")
  }
} 

/*
  Run with:
    val bf = new Brainfuck(ByteFunc)
    bf.execute(""">+++++++++[<++++++++>-]<.>+++++++[<++
                  ++>-]<+.+++++++..+++.[-]>++++++++[<++++>-]
                  <.#>+++++++++++[<+++++>-]<.>++++++++[<++
                  +>-]<.+++.------.--------.[-]>++++++++[<++++>
                  -]<+.[-]++++++++++.""")
*/

//symbol literals and chars
val aSymbol = 'aSymbol
val notASymbol = ' '
val aChar = 'a'
val aChar = '\u0041'
val rawString = """123"""
