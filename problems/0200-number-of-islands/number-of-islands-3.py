from collections import deque
class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        # Easy BFS, DFS 
        # Make a graph for all 1s nodes. There's an edge if theres a connection between 1s 
        # Traverse BFS, if the adjacent 1 is already (visited = true) -> continue 
        # If it's new, then add it to the current island 
        # If we found a new 1 but all its surrounding is new, we know that it's a start of a new island
        # and start a new search 
        # After all, the number of island is the number of search 

        directions = [
            (0,1), # up
            (1,0), # right 
            (0,-1), # down
            (-1,0) # left 
        ]

        m, n = len(grid), len(grid[0]) 
        islands = 0

        def bfs(r, c): 
            queue = deque([(r,c)])
            grid[r][c] = "0"

            while queue: 
                node = queue.pop()

                for dr, dc in directions: 
                    nr = node[0] + dr
                    nc = node[1] + dc 

                    if not ((0 <= nr < m) and (0 <= nc < n)): 
                        continue 
                    if grid[nr][nc] == "1":
                        queue.append((nr, nc)) 
                        grid[nr][nc] = "0"
        
        for r in range(m): 
            for c in range(n): 
                if grid[r][c] == "1":
                    bfs(r,c) 
                    islands += 1
        
        return islands





        
