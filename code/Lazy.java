import java.util.function.Supplier;

public class Lazy {
    public static int compute(int arg) {
        return arg + 1;
    }
    public static void main(String [] args) {
        int v1 = compute(42); // eager
        System.out.println(v1);
        Supplier<Integer> v2 = () -> compute(42); // lazy
        System.out.println(v2);
        System.out.println(v2.get());
    }
}