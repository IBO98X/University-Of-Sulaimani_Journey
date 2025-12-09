import 'package:flutter/material.dart';
import 'package:first_homework/main.dart';

class CreateAccount extends StatelessWidget {
  const CreateAccount({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        backgroundColor: Colors.grey[50],
        elevation: 0,
        leading: IconButton(
          icon: const Icon(
            Icons.arrow_back,
            color: Color.fromARGB(255, 174, 60, 255),
          ),
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const LoginScreen()),
            );
          },
        ),
        title: const Text(
          'Create Account',
          style: TextStyle(
            color: Color.fromARGB(255, 174, 60, 255),
            fontSize: 20,
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            const SizedBox(height: 20),

            Icon(
              Icons.person,
              size: 100,
              color: Color.fromARGB(255, 174, 60, 255),
            ),

            const Text(
              'Create Your Account',
              style: TextStyle(
                color: Color.fromARGB(255, 174, 60, 255),
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),

            const SizedBox(height: 10),

            Text(
              'Fill in your details to get started',
              style: TextStyle(color: Colors.grey, fontSize: 14),
            ),

            const SizedBox(height: 40),

            TextField(
              decoration: InputDecoration(
                prefixIcon: const Icon(
                  Icons.person,
                  color: Color.fromARGB(255, 174, 60, 255),
                ),
                hintText: 'Full Name',
                labelText: 'Full Name',
                labelStyle: TextStyle(color: Colors.grey[600]),
                hintStyle: TextStyle(color: Colors.grey[400]),
                filled: true,
                fillColor: Colors.white,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 18,
                ),
              ),
            ),

            const SizedBox(height: 20),


              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {},
                style: ElevatedButton.styleFrom(
                  backgroundColor: Color.fromARGB(255, 174, 60, 255),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 18),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  elevation: 0,
                ),
                child: const Text(
                  'Sign Up',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
