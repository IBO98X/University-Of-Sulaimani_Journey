import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  List employee = [
    {"name": "ibrahim", "age": "21", "lastName": "qahtan"},
    {"name": "ali", "age": "19", "lastName": "mustafa"},
    {"name": "mohammed", "age": "25", "lastName": "ahmed"},
    {"name": "omar", "age": "25", "lastName": "hussien"},
    {"name": "taha", "age": "25", "lastName": "qahtan"},
    {"name": "azeez", "age": "25", "lastName": "rfaat"},
    {"name": "azeez", "age": "25", "lastName": "qusay"},
  ];

  MyApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: Text("Title")),
        // body: Container(
        //   decoration: BoxDecoration(
        //     color: Colors.red,
        //     borderRadius: BorderRadius.all(Radius.circular(20)),
        //     border: Border.all(
        //       color: Colors.blue,
        //       width: 3,
        //       style: BorderStyle.solid,
        //       strokeAlign: BorderSide.strokeAlignOutside,
        //     ),
        //     boxShadow: [
        //       BoxShadow(
        //         color: Colors.black,
        //         offset: Offset(1, 1),
        //         spreadRadius: 10,
        //         blurRadius: 20,
        //       ),
        //     ],
        //   ),
        //   width: 500,
        //   height: 400,
        //   padding: EdgeInsets.all(20),
        //   margin: EdgeInsets.all(20),
        //   alignment: Alignment.center,
        //   // child: Text(
        //   //   "Ibrahim Qahtan",
        //   //   style: TextStyle(
        //   //     color: const Color.fromARGB(255, 0, 0, 0),
        //   //     fontSize: 40,
        //   //     fontWeight: FontWeight.w800,
        //   //     backgroundColor: Colors.blue,
        //   //   ),
        //   // ),
        //   child: Image.asset(
        //     "images/One.jpg",
        //     width: 400,
        //     height: 400,
        //     fit: BoxFit.cover,
        //   ),
        // ),
        // body: Container(
        //   width: 500,
        //   child: Column(
        //     mainAxisAlignment: MainAxisAlignment.center,
        //     crossAxisAlignment: CrossAxisAlignment.center,
        //     children: [
        //       Text("Ibrahim Qahtan"),
        //       Container(width: 100, height: 100, color: Colors.red),
        //       Image.asset("images/One.jpg", width: 300, height: 300),
        //     ],
        //   ),
        // ),
        // body: Container(
        //   width: 1000,
        //   height: 600,
        //   color: Colors.yellow,
        //   child: Row(
        //     mainAxisAlignment: MainAxisAlignment.center,
        //     crossAxisAlignment: CrossAxisAlignment.center,
        //     children: [
        //       Text("Ibrahim Qahtan"),
        //       Container(width: 100, height: 100, color: Colors.red),
        //       Image.asset("images/One.jpg", width: 300, height: 300),
        //     ],
        //   ),
        // ),
        // body: SingleChildScrollView(
        //   scrollDirection: Axis.vertical,
        //   // child: Row(
        //   //   children: [
        //   //     Container(height: 100, width: 100, color: Colors.red),
        //   //     Container(height: 100, width: 100, color: Colors.blue),
        //   //     Container(height: 100, width: 100, color: Colors.yellow),
        //   //     Container(height: 100, width: 100, color: Colors.green),
        //   //     Container(height: 100, width: 100, color: Colors.black),
        //   //     Container(height: 100, width: 100, color: Colors.grey),
        //   //     Container(height: 100, width: 100, color: Colors.indigo),
        //   //     Container(height: 100, width: 100, color: Colors.greenAccent),
        //   //     Container(
        //   //       height: 100,
        //   //       width: 100,
        //   //       color: Colors.deepPurpleAccent,
        //   //     ),
        //   //     Container(height: 100, width: 100, color: Colors.pink),
        //   //   ],
        //   // ),
        //   child: Column(
        //     children: [
        //       Container(height: 100, width: 100, color: Colors.red),
        //       Container(height: 100, width: 100, color: Colors.blue),
        //       Container(height: 100, width: 100, color: Colors.yellow),
        //       Container(height: 100, width: 100, color: Colors.green),
        //       Container(height: 100, width: 100, color: Colors.black),
        //       Container(height: 100, width: 100, color: Colors.grey),
        //       Container(height: 100, width: 100, color: Colors.indigo),
        //       Container(height: 100, width: 100, color: Colors.greenAccent),
        //       Container(
        //         height: 100,
        //         width: 100,
        //         color: Colors.deepPurpleAccent,
        //       ),
        //       Container(height: 100, width: 100, color: Colors.pink),
        //     ],
        //   ),
        // ),
        // body: Container(
        //   height: 1000,
        //   child: ListView(
        //     scrollDirection: Axis.vertical,
        //     children: [
        //       Image.asset("images/One.jpg"),
        //       Text("Ibrhaim Qahtan"),
        //       Container(color: Colors.red, height: 200, width: 300),
        //       Container(color: Colors.green, height: 200, width: 300),
        //       Container(color: Colors.yellow, height: 200, width: 300),
        //       Container(color: Colors.blue, height: 200, width: 300),
        //       Container(child: Text(employee[1]["name"])),
        //     ],
        //   ),
        // ),
        body: SizedBox(
          height: 1000,
          // child: GridView.builder(
          //   gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
          //     crossAxisCount: 3,
          //     mainAxisSpacing: 10,
          //     childAspectRatio: 0.7,
          //     crossAxisSpacing: 10,
          //   ),
          //   itemCount: employee.length,
          //   itemBuilder: (context, i) {
          //     return Container(
          //       height: 100,
          //       color: i.isEven ? Colors.red : Colors.green,
          //       child: Text(
          //         employee[i]["name"],
          //         textAlign: TextAlign.center,
          //         style: TextStyle(fontSize: 15, color: Colors.white),
          //       ),
          //     );
          //   },
          // ),
          child: ListView(
            children: [
              Card(
                child: ListTile(
                  leading: Text("Ibrahim Qahtan"),
                  onTap: () {
                    print("On Tap");
                  },
                  title: Text("Title"),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
