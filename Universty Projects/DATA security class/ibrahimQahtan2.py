import hashlib
import random
import string

def generate_random_words(count, length=8):
    words = []
    for _ in range(count):
        word = ''.join(random.choices(string.ascii_lowercase, k=length))
        words.append(word)
    return words

def encrypt_sha256(words):
    encrypted_dict = {}
    for word in words:
        hashed_word = hashlib.sha256(word.encode()).hexdigest()
        encrypted_dict[word] = hashed_word
    return encrypted_dict

random_words = generate_random_words(1000)

encrypted_dict = encrypt_sha256(random_words)

for word, hashed in list(encrypted_dict.items())[:10]:
    print(f"{word}: {hashed}")