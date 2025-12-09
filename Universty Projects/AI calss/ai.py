from collections import deque

def bfs(adj, s):
    q = deque()
    visited = [False] * len(adj)
    # print(visited)
    visited[s] = True
    # print(visited[s])
    # print(visited)
    q.append(s)
    # print(q)

    while q:
        curr = q.popleft()
        print(curr, end=" ")

        for x in adj[curr]:
            if not visited[x]:
                visited[x] = True
                q.append(x)

def add_edge(adj,u,v):
    adj[u].append(v)
    adj[v].append(u)

if __name__ == "__main__":

    v = 5
    adj = [[] for _ in range(v)]
    add_edge(adj,0,1)
    add_edge(adj,0,2)
    add_edge(adj,1,3)
    add_edge(adj,1,4)
    add_edge(adj,2,4)
    print("BFS starting from 2:")
    bfs(adj,2)
    