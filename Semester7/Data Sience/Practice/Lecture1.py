name = str(input("Pleae Enter Your Name:"))
age = str(input("Pleae Enter Your Age:"))
address = str(input("Pleae Enter Your address:"))
stage = str(input("Pleae Enter Your Stage:"))
className = ["data Science", "IoT"]
marks = [85, 87]
sum = 0
for m in marks:
    sum+=m
marksAvg = sum / m

print(marksAvg)

age = int(input("Enter Your Age: "))

if age >= 0 and age <= 9:
    print("Your Are A Child!")
elif age > 9 and age <= 18:
    print("Your Are and adolescent!")
elif age >18 and age <= 65:
    print("You Are ")
