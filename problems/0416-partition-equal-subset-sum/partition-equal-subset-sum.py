from functools import cache
class Solution:
    def canPartition(self, nums: list[int]) -> bool:
        # Dynamic programming 
        # Try exclue the num in nums 
        # Sum of each subset has to equal S/2 
        # O(n^2)
        # brute force traverse each element 
        total = sum(nums) 
        if total % 2 == 1: 
            return False 
        target = total // 2
        # DP: Excluding 1 number and see if there's any subset sum to target - num 
        # DP[i] = DP[target - i]
        dp = [False] * (target + 1)
        dp[0] = True

        for num in nums: 
            for s in range(target, num - 1, -1): 
                dp[s] = dp[s] or dp[s - num]
        return dp[target]
        
        

