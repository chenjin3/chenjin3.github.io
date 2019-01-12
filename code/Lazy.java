import java.util.function.Supplier;

public class Lazy {

    public static void main(String [] args) {
        Integer v1 = 42; // eager
        Supplier<Integer> v2 = () -> 42; // lazy
        System.out.println(v2.get());
    }
}