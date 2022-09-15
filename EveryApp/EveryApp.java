import javax.swing.*;

public class EveryApp {

    static final int WIDTH = 700;
    static final int HEIGHT = 600;
    public static void main(String[] args) {
        JFrame UserInterface = new UserInterface();
        UserInterface.setSize(WIDTH, HEIGHT);
        UserInterface.setTitle("EveryApp");
        UserInterface.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        UserInterface.setVisible(true);
    }
}
