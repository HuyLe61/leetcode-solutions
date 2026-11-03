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
        @cache 
        def dp(i, remaining): 
            if remaining == 0:
                return True 
            if remaining < 0 or i == len(nums): 
                return False
            return dp(i + 1, remaining) or dp(i + 1, remaining - nums[i])
        return dp(0, target)
        
        

