class StudentRecord:
    def __init__(self, name, age, address, stage, classes, marks):
        """Initializes a StudentRecord instance."""
        self.name = name
        self.age = age
        self.address = address
        self.stage = stage
        self.classes = classes
        self.marks = marks

    def calculate_average(self):

        if not self.marks:
            return 0.0
        return sum(self.marks) / len(self.marks)

    def __str__(self):

        return (
            f"\n--- Student: {self.name} ---\n"
            f"  Age:     {self.age}\n"
            f"  Address: {self.address}\n"
            f"  Stage:   {self.stage}\n"
            f"  Classes: {', '.join(self.classes)}\n"
            f"  Marks:   {', '.join(map(str, self.marks))}\n"
            f"  Average: {self.calculate_average():.2f}\n"
            f"--------------------------"
        )


def get_integer_input(prompt):
    
    while True:
        try:
            value = int(input(prompt))
            return value
        except ValueError:
            print("Invalid input. Please enter a whole number.")


def add_new_student(students_list):

    print("\n--- Enter New Student Details ---")
    name = input("Enter name: ").strip()
    age = get_integer_input("Enter age: ")
    address = input("Enter address: ").strip()
    stage = get_integer_input("Enter stage (e.g., 1, 2, 3): ")

    # Get class names
    class_input = input("Enter class names (comma-separated, e.g., Data Science, IoT): ")
    classes = [c.strip() for c in class_input.split(',')]

    # Get marks for each class
    marks = []
    print("Enter the marks for each class:")
    for course in classes:
        mark = get_integer_input(f"  - Mark for {course}: ")
        marks.append(mark)

    # Create and store the new student record
    new_student = StudentRecord(name, age, address, stage, classes, marks)
    students_list.append(new_student)
    print(f"\nSuccessfully added student: {name}")


def view_all_students(students_list):
    if not students_list:
        print("\nNo student records found.")
        return

    print("\n--- All Student Records ---")
    for student in students_list:
        print(student)


def view_students_by_stage(students_list):

    if not students_list:
        print("\nNo student records found to filter.")
        return

    stage_to_view = get_integer_input("\nEnter the stage you want to view: ")
    
    # Find students matching the stage
    found_students = [s for s in students_list if s.stage == stage_to_view]

    if not found_students:
        print(f"\nNo students found in stage {stage_to_view}.")
        return

    print(f"\n--- Students in Stage {stage_to_view} ---")
    for student in found_students:
        # A more compact view for filtering
        print(f"  - Name: {student.name}, Average Mark: {student.calculate_average():.2f}")


def main():
    # A list to act as our simple in-memory database
    students = []

    while True:
        print("\n===== Student Record System =====")
        print("1. Add New Student")
        print("2. View All Students")
        print("3. View Students by Stage")
        print("4. Exit")
        choice = input("Enter your choice (1-4): ")

        if choice == '1':
            add_new_student(students)
        elif choice == '2':
            view_all_students(students)
        elif choice == '3':
            view_students_by_stage(students)
        elif choice == '4':
            print("Exiting program. Goodbye!")
            break
        else:
            print("Invalid choice. Please enter a number between 1 and 4.")


# Run the main program
if __name__ == "__main__":
    main()





