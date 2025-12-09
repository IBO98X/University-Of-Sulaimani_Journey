import random

g = 2
p = 33

a = random.randint(5, 2 * p)
b = random.randint(5, 2 * p)

A = pow(g, a, p)
B = pow(g, b, p)

secret_a = pow(B, a, p)
secret_b = pow(A, b, p)

print(f"Private key a: {a}")
print(f"Private key b: {b}")
print(f"Public key A (g^a mod p): {A}")
print(f"Public key B (g^b mod p): {B}")
print(f"Shared secret (A side): {secret_a}")
print(f"Shared secret (B side): {secret_b}")
