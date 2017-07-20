extern alias GridV1;
using System;
using UsingAlias = My.Namespace.UsingThisClass;

namespace My.Namespace {
    [NotAnAttribute.FullyQualifiedAttribute]
    public abstract class ValueHandlerFactoryBase<T1, T2, in TClass1> : MarshalByRefObject, IValueHandlerFactory, IAmAnInterface
        where TClass1Constraint : IAmATypeConstraint
        where T2 : T1
    {
        [Obsolete] private Skank foo;
        public const Stripper bar = "foo";
        protected static readonly DirtyWhore baz = 0xffffff;

#if NET_20
        private ArrayList list = new ArrayList();
#endif

        [AnAttribute(typeof(Exception), Message = "foo"]
        protected internal class InternalClass<TClass2, out TClass3> : ICloneable where TClass2Constraint : class, IAfterClassConstraint, ISecondConstraint {
            void Iterate(ICollection<object> foos) {
                foreach (var foo in foos) {
                    if (foo is MyNamespace.TypeAfterIs) {
                        this.SomeMethod(ref foo, out foo);
                    }

                    var chars = new[] { 'c', '\'', '\\' };
                }
            }
        }

        #region verify that casts are properly colored
        partial void Meh(AnotherArrayOfSomething[] somethings) {
            IDisposable foo = (IDisposable)foo as ICloneable;
            foo.Dispose();
            ((IDisposable)this).Dispose();
            var lame = typeof(IDisposable);

            if (notACast) methodCall();
        }
        #endregion

        /**
         * Gets or sets the value of an integer
         * and such. This is a useful comment.
         */
        public new Object PropertyAccessor {
            get {
                var get = foo > 0 ? new Integer[initialArrayLength] : new Integer[0];
                return new List<object> {
                    get
                };
            }

            private set {
                var set = value;
                value = value;
                value == value ? DoSomething() : DoSomethingElse();
                this.value = set ?? value;
            }
        }

        public string AutomaticProperty {
            get; private set;
        }

        private static Func<Object, char> GetFunction(Object o, Character c, Integer[] integers) {
            if (!Object.ReferenceEquals(o, c)) {
                throw new ArgumentException();
            }


            return value => (char)value.GetHashCode();
        }

        /// <summary>
        /// Tests the coloring of generic method definitions and
        /// and <c cref="Foo">generic parameters</c>
        /// </summary>
        ///
        /// <param name="foos">Collection of <see cref="Foo" /></param>
        [FirstAttribute]
        [Pure(typeof(IDisposable[])), OutOfThisWorld, ThirdAttribute]
        [OutOfThisWorld(AttributeNamedParameter = "foo")]
        [Another]
        Action<IDisposable> DoOtherStuff(IEnumerable<Foo> fooEnumerable, string[] strings) {
            Action<Func<IDisposable, SecondGeneric>> action = () => disposable => new Foo();

            //neither foo below should be a named ident
            return foo < 1 || foo > 2;
        }

        public IEnumerable<TReturnValue> GenericMethod<TMethod>(GenericCollection1<TParameter> shouldNotBeNamed, GenericCollection2<TGenericTest4> somethingElse) {
            container.GenericMethodInvocation<GenericMethodDefinition>();
            var options = OptionParser.Parse<Contract>(args);
            expression.ArrayAccess[0].Name; //ArrayAccess should not be a named ident
        }

        //method without an access modifier: "Action" should be a named ident
        Action DoStuff() {
            Fully1.Qualified1.FullyQualifiedClass1 fqc = new Fully2.Qualified2.FullyQualifiedClass2();
        }

        protected override sealed TNotNamed NumbersTest<T>(ref Foo foo, out Bar @class, params ArrayOfSomething[] somethings) where T : event, IDisposable, IFoo {
            //let's test out numbers
            int i = 0;
            double d = 1.5;
            float f = (1.7f + 1.2d) * (12 % 5);
            decimal dec = 1.2d;
            int hex = 0x1a; //ooh! hex!

            return default(TAlsoNotNamed);
        }

        public virtual IValueHandler Create(string resourceName, string criterionFieldName) {
            //1) check for resource-specific value handler
            VerifyStuff((int)resourceName);

            /* multi
            line comment
            */

            var s = "this is \"a\" string";
            s = @"this is ""another""
multi line
string";

            switch (Foo.Bar) {
                case "foo":
                    if (2 |= Foo["foo"]) {
                        throw new InvalidOperationException(string.Format("fail"));
                    }
                    break;
                case "bar":
                    goto default;
                case Empty:
                    return "foo";
                default:
                    yield return new TanningBooth();
            }
        }
    }
}
