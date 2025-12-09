package Compiler;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

public class WriteToFile{
public static void main(String[]args){
    
String fileName="temp.txt";
try{
    File file=new File(fileName);
    FileWriter FileWrite=new FileWriter(file);
    BufferedWriter BufferedWriter=new BufferedWriter(FileWrite);
    BufferedWriter.write("hello there,");
    BufferedWriter.newLine();
    BufferedWriter.write("here is some text.");
    BufferedWriter.close();
}
catch(Exception e) {

}
try{
    String line = null;
    FileReader fileReader=new FileReader(fileName);
    BufferedReader bufferReader=new BufferedReader(fileReader);
    while((line=bufferReader.readLine())!=null){
        System.out.println(line);
    }
    bufferReader.close();
}
catch (FileNotFoundException e){
    System.out.println("Unable to open file" + fileName + "");
}
catch (IOException e){
    System.out.println("Error reading file" + fileName );
}
}

}