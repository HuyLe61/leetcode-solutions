class Solution:
    from collections import defaultdict
    def maxStarSum(self, vals: list[int], edges: list[list[int]], k: int) -> int:
        # within each node that has degree, compute the max value by adding all the positive integer greedily not exceeding k numbers
        # for each node, sort the neighbor nodes desc and choose the top k positive integer 
        # make a dictionary where key is the index of the node and value is the adjacent values 
        graph = defaultdict(list)
        for u, v in edges:
            graph[u].append(vals[v]) 
            graph[v].append(vals[u])

        max_sum = vals.copy()

        for node, neighbors in graph.items(): 
            neighbors = sorted(neighbors, reverse=True) 
            for i in range(k): 
                if i >= len(neighbors) or neighbors[i] < 0: 
                    break 
                max_sum[node] += neighbors[i]
        
        return max(max_sum)

