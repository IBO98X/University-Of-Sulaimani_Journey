def find_path(tree, start, goal):
    stack = [(start, [start])] 
    while stack:
        node, path = stack.pop()  
        if node == goal: 
            return path
        for child in tree.get(node, []):
            stack.append((child, path + [child]))
    return None  

tree = {
    'A': ['B', 'C', 'D'],
    'B': ['E', 'F'],
    'C': ['G', 'H'],
    'D': ['I', 'J'],
    'E': ['K', 'L'],
    'F': ['M'],
    'G': ['N'],
    'H': ['O', 'P'],
    'P': ['U'],
}

path = find_path(tree, 'A', 'U')
print("Path from A to U:", path if path else "No path found")
