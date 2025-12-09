import 'package:flutter/material.dart';
import 'package:first_homework/main.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color.fromARGB(255, 174, 60, 255),
        elevation: 0,
        title: const Text(
          'Account Profile',
          style: TextStyle(
            color: Colors.white,
            fontSize: 20,
            fontWeight: FontWeight.w500,
          ),
        ),

        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const LoginScreen()),
            );
          },
        ),
      ),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              TextField(
                readOnly: true,
                decoration: InputDecoration(
                  filled: true,
                  fillColor: Colors.white,
                  prefixIcon: Icon(Icons.person, color: Colors.grey[700]),
                  labelText: 'Full Name',
                  labelStyle: TextStyle(color: Colors.grey[600], fontSize: 12),

                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 15,
                    vertical: 15,
                  ),
                ),
                controller: TextEditingController(text: 'Ibrahim Qahtan'),
              ),
              const SizedBox(height: 15),

              TextField(
                readOnly: true,
                decoration: InputDecoration(
                  filled: true,
                  fillColor: Colors.white,
                  prefixIcon: Icon(Icons.email, color: Colors.grey[700]),
                  labelText: 'Email',
                  labelStyle: TextStyle(color: Colors.grey[600], fontSize: 12),

                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 15,
                    vertical: 15,
                  ),
                ),
                controller: TextEditingController(
                  text: 'ibrahim.232412@univsul.edu.iq',
                ),
              ),
              const SizedBox(height: 15),

              TextField(
                readOnly: true,
                decoration: InputDecoration(
                  prefixIcon: Icon(Icons.phone, color: Colors.grey[700]),
                  labelText: 'Phone Number',
                  labelStyle: TextStyle(color: Colors.grey[600], fontSize: 12),
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 15,
                    vertical: 15,
                  ),
                ),
                controller: TextEditingController(text: '+964 780 496 5337'),
              ),
              const SizedBox(height: 15),

              TextField(
                readOnly: true,
                decoration: InputDecoration(
                  prefixIcon: Icon(Icons.school, color: Colors.grey[700]),
                  labelText: 'My Stage',
                  labelStyle: TextStyle(color: Colors.grey[600], fontSize: 12),
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 15,
                    vertical: 15,
                  ),
                ),
                controller: TextEditingController(text: '4th Stage'),
              ),
              const SizedBox(height: 15),

              TextField(
                readOnly: true,
                decoration: InputDecoration(
                  prefixIcon: Icon(Icons.book, color: Colors.grey[700]),
                  labelText: 'Class Name',
                  labelStyle: TextStyle(color: Colors.grey[600], fontSize: 12),
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 15,
                    vertical: 15,
                  ),
                ),
                controller: TextEditingController(
                  text: 'Mobile Application Development',
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
