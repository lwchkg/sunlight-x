package com.sunlightjs.awesome;

import java.text.*;
import java.io.BufferedStreamReader;
import java.lang.annotation.*;
import java.lang.StackTraceElement;

public class MyClass extends ExtendedClass implements Interfacable1, Interfacable2, Interfacable3 {
    private int foo;

    public MyClass(int parameter1) {
        super();
        
        this.foo = (CastingTest1)foo;
        this.foo = ((CastingTest2)this).doStuff();
        if (notACast) methodCall();
        if (this.foo instanceof java.lang.CharSequence) {
            throw new Exception();
        }
    }
    
    /**
     * How about an inner class?
     */
    private class InnerEvenIterator {
        //start stepping through the array from the beginning
        private int next = 0;
        
        public boolean hasNext() {
            //check if a current element is the last in the array
            return (next <= SIZE - 1);
        }
        
        public int getNext() {
            //record a value of an even index of the array
            int retValue = arrayOfInts[next];
            //get the next even element
            next += 2;
            return retValue;
        }
    }
    
    private void anonymousInnerClassTest() throws CheckedException1, CheckedException2, CheckedException3 {
        new Thread(new Runnable() {
          public void run() {
            try {
              while (true) {
                sleep(1000); System.out.print(".");
              }
            }
            catch(InterruptedException ex) {}
          }
        }).start();
        
        //http://www.roseindia.net/javatutorials/anonymous_innerclassestutorial.shtml
        Vector myVector = new Vector(3) {{
            add("Heinz"); add("John"); add("Anton");
        }};
    }
    
    /*
    multi line
    comment
    */
    protected abstract void abstractMethod(Kissable lips, char c, ArrayParameter[] arrayParameter);
    
    /**
     * Stolen mostly from http://download.oracle.com/javase/tutorial/java/generics/bounded.html
     * because I haven't written Java since I was an idiot in college
     */
    @Documented @AnnotationWithArguments(name = "this \"is\" a string\\")
    @Override public static <T extends GenericExtended & GenericImplemented<? super T>> T genericMethod(GenericParam<? extends T> genericParam) {
        //wait, so Java seriously uses the ampersand for interfaces in generics?
        
        MyCustomMap1<char, AnotherGeneric> map = new MyCustomMap2<FirstGeneric, SecondGeneric>();
        fully1.qualified1.ClassName1 fqc = new fully2.qualified2.ClassName2();
        
        int length = 2;
        ArrayTest1[] arrayOStuff = length > 0 ? new ArrayTest2[length] : new ArrayTest3[12];
        
        return true ? false : null;
    }
}

//enum test: http://download.oracle.com/javase/1.5.0/docs/guide/language/enums.html
public enum Planet {
    MERCURY (3.303e+23, 2.4397e6),
    VENUS   (4.869e+24, 6.0518e6),
    EARTH   (5.976e+24, 6.37814e6),
    MARS    (6.421e+23, 3.3972e6),
    JUPITER (1.9e+27,   7.1492e7),
    SATURN  (5.688e+26, 6.0268e7),
    URANUS  (8.686e+25, 2.5559e7),
    NEPTUNE (1.024e+26, 2.4746e7),
    PLUTO   (1.27e+22,  1.137e6);

    private final double mass;   // in kilograms
    private final double radius; // in meters
    Planet(double mass, double radius) {
        this.mass = mass;
        this.radius = radius;
    }
    public double mass()   { return mass; }
    public double radius() { return radius; }

    // universal gravitational constant  (m3 kg-1 s-2)
    public static final double G = 6.67300E-11;

    public double surfaceGravity() {
        return G * mass / (radius * radius);
    }
    public double surfaceWeight(double otherMass) {
        return otherMass * surfaceGravity();
    }
}
