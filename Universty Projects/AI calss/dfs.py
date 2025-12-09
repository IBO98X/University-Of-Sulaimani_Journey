# DFS from given source s
def dfs(adj, s, visited):
    # Mark the current node as visited and print it
    visited[s] = True
    print(s, end=" ")

    # Recur for all the vertices adjacent to this vertex
    for x in adj[s]:
        if not visited[x]:
            dfs(adj, x, visited)

# Function to add an edge to the graph
def add_edge(adj, u, v):
    adj[u].append(v)
    adj[v].append(u)

# Example usage
if __name__ == "__main__":

    # Number of vertices in the tree
    V = 6

    # Adjacency list representation of the tree
    adj = [[] for _ in range(V)]

    # Add edges to the tree
    add_edge(adj, 0, 1)
    add_edge(adj, 0, 2)
    add_edge(adj, 0, 3)
    add_edge(adj, 1, 4)
    add_edge(adj, 1, 5)
    print(adj)
    # Perform DFS traversal starting from vertex 0
    visited = [False] * V
    print("DFS starting from 0: ")
    dfs(adj, 0, visited)
