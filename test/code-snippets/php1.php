<?php

    namespace My\Namespace;
    
    use UseThisClass;
    use AlsoUseThis, AndUseThis;
    use My\Favorite\UseMePlease;
    use Other\Namespace\UseMe, Other\Namespace\NoUseMe;
    
    interface Kissable extends Countable {
        function kiss(array $foo = null);
    }
    
    abstract class HenryKissable extends ExtendedClass implements ImplementedInterface1, ImplementedInterface2, ImplementedInterface3 {
        const KISS = 'kiss';
        private $myPrivateVar;
        public $publicVar;
        
        #Perl-style comments are stupid
        public function __construct($foo, Iterator $bar = null, array $kiss = array()) {
            parent::__construct();
            $this->myPrivateVar = $foo;
            $this->publicVar = $bar ?: new self();
            
            foreach ($kiss as $key => $value) {
                //unset stuff
                unset($this[$key]);
                if ($value instanceof \My\Namespace\InstanceOfClassName1):
                    $value = $value instanceof InstanceOfClassName2;
                endif;
                $this[$key] = is_int($value) ? (int)$value : (string)$value;
            }
        }
        
        protected final function invokeStatic() {
            StaticClass::invoke("this is a \"string\"");
            static::doSomething();
            
            switch (KISS) {
                case 5:
                case 0x1a:
                    if (KISS === 'foo') {
                        return null;
                    } elseif (KISS === 'bar') {
                        return false;
                    } else {
                        return true;
                    }
                case 1e3:
                    break;
                default:
                    throw new OutOfBoundsException();
            }
        }
        
        function noModifier() {
            $fqc = new Fully1\Qualified1\FullyQualifiedClassName1();
            $fqc = new \Fully2\Qualified2\FullyQualifiedClassName2();
            $notFullyQualified = new NotFullyQualified();
            
            $closure = function($foo, array $bar) use (Fully3\Qualified3\ClassName3 $fqc) {
                return $fqc;
            };
        }
        
        public abstract function(TypeHinted $var);
        
        /**
         * This does something
         */
        private static function doSomething() {
            $heredoc = "this one is my \"favorite\"";
            $heredoc .= <<<LOL
oh 'look'
a heredoc!
LOL;

            $nowdoc = <<<'LULZ'
oh look
a nowdoc!
LULZ;
        }
        
    }
?>

<? 
    //short tags 
?>

<?= 'lol' ?>
