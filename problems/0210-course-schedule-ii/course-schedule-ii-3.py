class Solution:
    def findOrder(self, numCourses: int, prerequisites: list[list[int]]) -> list[int]:
        graph = [[] for _ in range(numCourses)] 
        for u, v in prerequisites: 
            graph[u].append(v) 
        
        state = [0] * numCourses
        order = [] 

        # This is for cycle detecting
        def dfs(node): 
            # If visited
            if state[node] == 2: 
                return True
            elif state[node] == 1: 
                return False
            elif state[node] == 0: 
                state[node] = 1
                for neighbor in graph[node]: 
                    if not dfs(neighbor):
                        return False 
                
            state[node] = 2 
            order.append(node) 

            return True 
        
        for course in range(numCourses): 
            if not dfs(course):
                return []
        
        return order
            

