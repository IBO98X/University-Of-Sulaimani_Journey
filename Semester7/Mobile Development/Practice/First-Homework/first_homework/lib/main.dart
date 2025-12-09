import 'package:flutter/material.dart';
import 'package:first_homework/account.dart';
import 'package:first_homework/profile.dart';

void main() {
  runApp(const MainApp());
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      debugShowCheckedModeBanner: false,
      home: LoginScreen(),
    );
  }
}

class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              Column(
                children: [
                  Icon(
                    Icons.person,
                    size: 100,
                    color: Color.fromARGB(255, 174, 60, 255),
                  ),
                  const SizedBox(height: 30),

                  TextField(
                    decoration: InputDecoration(
                      prefixIcon: const Icon(Icons.email),
                      prefixIconColor: Color.fromARGB(255, 174, 60, 255),
                      border: InputBorder.none,
                      hintText: 'Email',
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 15,
                        vertical: 13,
                      ),
                      labelStyle: const TextStyle(color: Colors.black54),
                      label: const Text('Please Enter Your Email'),
                      filled: true,
                      fillColor: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 20),

                  TextField(
                    decoration: InputDecoration(
                      prefixIcon: const Icon(Icons.lock),
                      prefixIconColor: Color.fromARGB(255, 174, 60, 255),
                      border: InputBorder.none,
                      hintText: 'Password',
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 15,
                        vertical: 13,
                      ),
                      labelStyle: const TextStyle(color: Colors.black54),
                      label: const Text('Please Enter Your Password'),
                      filled: true,
                      fillColor: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 30),

                  ElevatedButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const ProfileScreen(),
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      elevation: 5,
                      backgroundColor: Color.fromARGB(255, 174, 60, 255),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 150,
                        vertical: 20,
                      ),
                      textStyle: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: const Text("Login"),
                  ),
                  const SizedBox(height: 30),
                ],
              ),

              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Don't have an account?",
                        style: TextStyle(color: Colors.grey[600], fontSize: 14),
                      ),
                      SizedBox(height: 10),
                      TextButton(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const CreateAccount(),
                            ),
                          );
                        },
                        child: const Text(
                          "Sign Up",
                          style: TextStyle(
                            color: Color.fromARGB(255, 174, 60, 255),
                            fontWeight: FontWeight.bold,
                            fontSize: 14,
                          ),
                        ),
                      ),
                    ],
                  ),
                  Text(
                    "Forgot Password?",
                    style: TextStyle(
                      color: Colors.red,
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
