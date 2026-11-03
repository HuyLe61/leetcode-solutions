class Solution:
    def maxOperations(self, s: str) -> int:
        # Greedy approach 
        # In order to get the maximum number of operations, we will always choose to move the left most 1 first if possible (must be the last index of substring 1s)
        # Prove? Because if we move the right 1 first, then when choosing the left index would lose at least 1 operation 

        count = 0 
        res = 0
        for i in range(len(s) - 1): 
            if s[i] == "1": 
                count += 1 
                if s[i + 1] == "0": 
                    res += count 
        
        return res
                    
