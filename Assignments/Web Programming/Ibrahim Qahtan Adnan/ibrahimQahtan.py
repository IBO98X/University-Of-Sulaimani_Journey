def caesar_decrypt(ciphertext, shift):
    decrypted_text = ""
    for char in ciphertext:
        if char.isalpha():
            start = ord('A') if char.isupper() else ord('a')
            decrypted_text += chr((ord(char) - start - shift) % 26 + start)
        else:
            decrypted_text += char
    return decrypted_text

ciphertext = "Wkh Fdhvdu Flihu Phvvdjh."
shift = 3
print("Decrypted text:", caesar_decrypt(ciphertext, shift))