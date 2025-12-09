from collections import defaultdict

# Recursive DFS function
def dfs_util(v, visited, adj):
    # Mark the current node as visited and print it
    visited[v] = True
    print(v, end=" ")

    # Recur for all the vertices adjacent to this vertex
    for x in adj[v]:
        if not visited[x]:
            dfs_util(x, visited, adj)

# DFS traversal starting from a given source vertex s
def dfs(adj, s):
    # Initially mark all the vertices as not visited
    visited = [False] * len(adj)

    # Call the recursive helper function to perform DFS
    dfs_util(s, visited, adj)

# Function to add an edge to the graph
def add_edge(adj, u, v):
    adj[u].append(v)
    adj[v].append(u)

# Example usage
if __name__ == "__main__":
    # Number of vertices in the graph
    V = 5

    # Adjacency list representation of the graph
    adj = [[] for _ in range(V)]

    # Add edges to the graph
    add_edge(adj, 0, 1)
    add_edge(adj, 0, 2)
    add_edge(adj, 1, 3)
    add_edge(adj, 1, 4)
    add_edge(adj, 2, 4)

    # Perform DFS traversal starting from vertex 0
    print("DFS starting from 2: ")
    dfs(adj, 2)
