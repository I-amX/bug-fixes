import 'package:flutter/material.dart';

class BuggyScreen extends StatelessWidget {
  const BuggyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('User Profile'),
      ),
      body: Row(
        children: [
          Container(
            width: 250,
            height: 200,
            color: Colors.blue,
            child: const Center(
              child: Text(
                'User Profile Information',
                style: TextStyle(color: Colors.white),
              ),
            ),
          ),
          Container(
            width: 250,
            height: 200,
            color: Colors.green,
            child: const Center(
              child: Text(
                'Additional Information',
                style: TextStyle(color: Colors.white),
              ),
            ),
          ),
        ],
      ),
    );
  }
}