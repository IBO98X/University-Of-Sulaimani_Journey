package Compiler;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.util.Scanner;
import java.util.StringTokenizer;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Test {
    public static void main(String[] args) {
        // Lecture 1

        // write a text to file

        // try {
        // String fileName = "C:\\Universty Projects\\Compiler\\temp.txt";
        // File file = new File(fileName);
        // FileWriter writer = new FileWriter(file);
        // BufferedWriter buffer = new BufferedWriter(writer);
        // buffer.write("Abdulazeez");
        // buffer.newLine();
        // buffer.write("Ibrahim");
        // buffer.newLine();
        // buffer.write("Mustafa");
        // buffer.close();
        // } catch (Exception ex) {
        // System.out.println("Error");
        // }

        // Read a text from file

        // try {
        // String line = null;
        // FileReader readFile = new FileReader("C:\\Universty
        // Projects\\Compiler\\temp.txt");
        // BufferedReader bufferRead = new BufferedReader(readFile);
        // while ((line = bufferRead.readLine()) != null) {
        // System.out.println(line);
        // }
        // bufferRead.close();
        // } catch (Exception ex) {
        // System.out.println("Error");
        // }

        // Lecture 2

        // example 1

        // String str2 = "This is split Example";
        // String []arrOfStr1 = str2.split(" ");
        // for (int i = 0; i < arrOfStr1.length; i++) {
        // System.out.println(arrOfStr1[i]);

        // }

        // example 2

        // String str3 = "This,is,split Example";
        // String []arrOfStr2 = str3.split(",", 3);
        // for (int i = 0; i < arrOfStr2.length; i++) {
        // System.out.println(arrOfStr2[i]);
        // }

        // Exercise in lecture 2 (Practical)

        // try {
        // FileReader fRead = new FileReader("C:\\Universty
        // Projects\\Compiler\\temp.txt");
        // BufferedReader bRead = new BufferedReader(fRead);
        // String line1 = null;
        // File file = new File("C:\\Universty Projects\\Compiler\\writer.txt");
        // FileWriter writer = new FileWriter(file);
        // BufferedWriter buffer = new BufferedWriter(writer);
        // while ((line1 = bRead.readLine()) != null) {
        // String words[] = line1.split(" ");
        // for (int i = 0; i < words.length; i++) {
        // String words1[] = words[i].split(",");
        // for (int j = 0; j < words1.length; j++) {
        // buffer.write(words1[j]);
        // buffer.newLine();
        // }
        // }
        // }
        // buffer.close();
        // bRead.close();
        // } catch (Exception ex) {
        // System.out.println(ex);
        // }

        // lecture 3 -regex-

        // Example 1

        String regex = "^a(a|b)*";
        String input = "ababb";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(input);
        System.out.println("Input String matches regex : " + matcher.matches());

        // Example 2

        // String usernamePattern = "^[a-zA-Z0-9_]{4,16}";
        // Pattern pattern = Pattern.compile(usernamePattern);
        // String username1 = "user_123";
        // String username2 = "user-name";
        // String username3 = "user123456789012345";
        // String username4 = "us";
        // Matcher matcher1 = pattern.matcher(username1);
        // Matcher matcher2 = pattern.matcher(username2);
        // Matcher matcher3 = pattern.matcher(username3);
        // Matcher matcher4 = pattern.matcher(username4);
        // System.out.println("Username 1 is valid: " + matcher1.matches());
        // System.out.println("Username 2 is valid: " + matcher2.matches());
        // System.out.println("Username 3 is valid: " + matcher3.matches());
        // System.out.println("Username 4 is valid: " + matcher4.matches());

        // Lecture 3 Exercises 1

        // String regex = "(1|0)*(101)(1|0)*";
        // Pattern p = Pattern.compile(regex);
        // Matcher m = p.matcher("101");
        // System.out.println(m.matches());

        // Lecture 3 Exercises 2

        // Pattern p = Pattern.compile("^(11)(1|0)*(10)$");
        // Matcher m = p.matcher("1111010");
        // System.out.println(m.matches());

        // Lecture 3 Exercises 3

        // Pattern p = Pattern.compile("(1(1|0)*0)|(0(1|0)*1)");
        // Matcher m = p.matcher("01111");
        // System.out.println(m.matches());

        // Extra examples

        // Example 1

        // Pattern p = Pattern.compile("^[a-zA-Z0-9!%^&*]{4,20}$");
        // Matcher m = p.matcher("AaBbcdefG123!234%^&*");
        // System.out.println(m.matches());

        // Example 2

        // Pattern p = Pattern.compile("^[0-9]+[a-zA-Z0-9]+");
        // Matcher m = p.matcher("2AaBbcd34");
        // System.out.println(m.matches());

        /*
         * Q\ Use regular expression to find student name which must start with capital
         * letter 'A'
         * then with small letter and digits are not allowed, and student password must
         * start with
         * number cannot start with letter but after first digit letter is allowed and
         * must ends with
         * a special character not more than 8 characters are allowed.
         */
        String name = "Ali";
        Pattern p = Pattern.compile("^(A)[^0-9]+");
        Matcher m = p.matcher(name);
        System.out.println(m.matches());

        // String passwrod = "1*";
        // Pattern p1 = Pattern.compile("^[0-9][a-zA-Z0-9]{0,6}[!@#$%^&*_]$");
        // Matcher m1 = p1.matcher(passwrod);
        // System.out.println(m1.matches());

        // Enter email and password by scanner then check it

        // Scanner scan = new Scanner(System.in);
        // System.out.println("Enter Email:");
        // String email = scan.next();
        // System.out.println("Enter Password:");
        // String passwrod = scan.next();
        // Pattern pEmail =
        // Pattern.compile("[a-zA-Z0-9_]+@[a-zA-Z]+.(com|org|net|edu)");
        // Matcher mEmail = pEmail.matcher(email);
        // System.out.println("Email is: " + mEmail.matches());
        // Pattern pPass = Pattern.compile("[a-zA-Z0-9_$#@%^&*!]{8,}");
        // Matcher mPass = pPass.matcher(passwrod);
        // System.out.println("Password is: " + mPass.matches());
    }
}
