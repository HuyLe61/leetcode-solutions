
class Solution:
    def canFinish(self, numCourses: int, prerequisites: list[list[int]]) -> bool:
        graph = [[] for _ in range(numCourses)]

        for course, prereq in prerequisites:
            graph[prereq].append(course)

        state = [0] * numCourses

        def dfs(node):
            if state[node] == 1:
                return False
            if state[node] == 2:
                return True 
            state[node] = 1
            for neighbor in graph[node]:
                if not dfs(neighbor): 
                    return False
            state[node] = 2 

            return True

        # TODO: Start DFS from every course
        for _, prereq in prerequisites: 
            if not dfs(prereq):
                return False 

        return True
       
