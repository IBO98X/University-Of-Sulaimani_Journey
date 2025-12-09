import 'package:flutter/material.dart';

// The main entry point for the Flutter application.
void main() {
  runApp(const MyApp());
}

// MyApp is the root widget of the application.
// It's a StatelessWidget because its state doesn't change.
class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      // Title of the app (used by the OS switcher).
      title: 'Flutter Login Demo',
      // Set the theme for the application.
      theme: ThemeData(
        primarySwatch: Colors.blue,
        // Use Material 3 design.
        useMaterial3: true,
      ),
      // The home property sets the default route (the first screen shown).
      home: const LoginPage(),
      // Hide the debug banner in the top-right corner.
      debugShowCheckedModeBanner: false,
    );
  }
}

// LoginPage is a StatefulWidget because it manages the state
// of the form fields and their content.
class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

// _LoginPageState holds the mutable state for the LoginPage widget.
class _LoginPageState extends State<LoginPage> {
  // A GlobalKey to uniquely identify the Form widget.
  // This allows us to validate the form.
  final _formKey = GlobalKey<FormState>();

  // Controllers to manage the text being entered into the fields.
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  // A boolean to toggle password visibility.
  bool _isPasswordVisible = false;

  @override
  void dispose() {
    // Clean up the controllers when the widget is removed from the
    // widget tree to free up resources.
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  // This function is called when the login button is pressed.
  void _login() {
    // Validate the form using the _formKey.
    // If currentState is not null and validate() returns true, the form is valid.
    if (_formKey.currentState?.validate() ?? false) {
      // If the form is valid, retrieve the data.
      String email = _emailController.text;
      String password = _passwordController.text;

      // --- TODO: Implement your actual login logic here ---
      // For this demo, we'll just print to the console and show a SnackBar.
      print('Login attempt with Email: $email, Password: $password');
      // --- End of login logic ---

      // Show a confirmation message to the user.
      // We use ScaffoldMessenger to show a SnackBar at the bottom of the screen.
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Login Successful! Welcome, $email'),
          backgroundColor: Colors.green,
        ),
      );
    } else {
      // If the form is invalid, show an error message.
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please correct the errors in the form.'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    // Scaffold provides the basic app structure (app bar, body, etc.).
    return Scaffold(
      appBar: AppBar(
        title: const Text('Login Page'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      // Use a Padding widget to add space around the form.
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        // The Form widget acts as a container for the form fields.
        child: Form(
          key: _formKey, // Assign the key to the form.
          // Center the form vertically and horizontally.
          child: Center(
            // Use a SingleChildScrollView to prevent overflow
            // when the keyboard appears.
            child: SingleChildScrollView(
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 400),
                child: Column(
                  // Center the children vertically on the screen.
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget>[
                    // Email/Username Text Field
                    TextFormField(
                      controller: _emailController,
                      decoration: const InputDecoration(
                        labelText: 'Email',
                        hintText: 'Enter your email address',
                        prefixIcon: Icon(Icons.email),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.all(Radius.circular(12.0)),
                        ),
                      ),
                      keyboardType: TextInputType.emailAddress,
                      // Validator checks if the field is empty.
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter your email';
                        }
                        // A simple regex for basic email validation.
                        if (!RegExp(r'\S+@\S+\.\S+').hasMatch(value)) {
                          return 'Please enter a valid email address';
                        }
                        return null; // Return null if the input is valid.
                      },
                    ),
                    
                    // Adds vertical space between the fields.
                    const SizedBox(height: 100.0),
                    
                    // Password Text Field
                    TextFormField(
                      controller: _passwordController,
                      // obscureText hides the password characters.
                      obscureText: !_isPasswordVisible,
                      decoration: InputDecoration(
                        labelText: 'Password',
                        hintText: 'Enter your password',
                        prefixIcon: const Icon(Icons.lock),
                        border: const OutlineInputBorder(
                          borderRadius: BorderRadius.all(Radius.circular(12.0)),
                        ),
                        // Suffix icon to toggle password visibility.
                        suffixIcon: IconButton(
                          icon: Icon(
                            _isPasswordVisible
                                ? Icons.visibility
                                : Icons.visibility_off,
                          ),
                          onPressed: () {
                            // Update the state to toggle visibility.
                            setState(() {
                              _isPasswordVisible = !_isPasswordVisible;
                            });
                          },
                        ),
                      ),
                      // Validator checks if the password is empty or too short.
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter your password';
                        }
                        if (value.length < 6) {
                          return 'Password must be at least 6 characters long';
                        }
                        return null; // Return null if the input is valid.
                      },
                    ),
                    
                    // Adds vertical space before the button.
                    const SizedBox(height: 24.0),
                    
                    // Login Button
                    ElevatedButton(
                      // Set the button's style.
                      style: ElevatedButton.styleFrom(
                        minimumSize: const Size(double.infinity, 50), // Make button wide
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12.0),
                        ),
                        padding: const EdgeInsets.symmetric(vertical: 16.0),
                      ),
                      // Call the _login function when pressed.
                      onPressed: _login,
                      child: const Text(
                        'Login',
                        style: TextStyle(fontSize: 18),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
