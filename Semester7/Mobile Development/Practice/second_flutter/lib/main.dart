import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Lab Quiz',
      theme: ThemeData(primarySwatch: Colors.red),
      home: const MyHomePage(),
    );
  }
}

class MyHomePage extends StatelessWidget {
  const MyHomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(),

      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: const <Widget>[
            DrawerHeader(
              decoration: BoxDecoration(color: Color.fromARGB(255, 242, 9, 5)),
              child: Text(
                'List',
                style: TextStyle(color: Colors.white, fontSize: 20),
              ),
            ),
            ListTile(leading: Icon(Icons.home), title: Text('HOME')),
            ListTile(leading: Icon(Icons.arrow_back), title: Text('BACK')),
          ],
        ),
      ),

      body: Center(
        child: Container(
          padding: const EdgeInsets.all(30.0),
          decoration: BoxDecoration(
            color: Colors.teal.shade50,
            borderRadius: BorderRadius.circular(15.0),
            boxShadow: const [
              BoxShadow(
                color: Colors.black12,
                blurRadius: 10.0,
                offset: Offset(0, 5),
              ),
            ],
          ),
          child: const Text(
            'Ibrahim Qahtan',
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.w600,
              color: Colors.teal,
            ),
          ),
        ),
      ),
    );
  }
}
