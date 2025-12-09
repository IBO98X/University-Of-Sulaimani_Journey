package Compiler;
import java.io.File;
import java.io.IOException;

public class FileCreator {
    public static void main(String[] args) {
        String fileName = generateUniqueFileName("temp", ".txt");
        createFile(fileName);
    }
    public static String generateUniqueFileName(String baseName, String extension) {
        int counter = 1;
        File file = new File(baseName + extension);

        while (file.exists()) {
            file = new File(baseName + "_" + counter + extension);
            counter++;
        }
        return file.getName();
    }
    public static void createFile(String fileName) {
        File file = new File(fileName);
        try {
            if (file.createNewFile()) {
                System.out.println("File created: " + file.getName());
            } else {
                System.out.println("Failed to create the file.");
            }
        } catch (IOException e) {
            System.out.println("An error occurred while creating the file.");
            e.printStackTrace();
        }
    }
}
