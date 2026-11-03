class Solution:
    def rob(self, nums: list[int]) -> int:
        # We can try dynamic approach 
        # dp[i] = dp[i + 2] + nums[i]
        # dp[n] = nums[n]
        # dp[n - 1] = max(nums[n], nums[n - 1]) 
        # how do we program this
        n = len(nums) - 1
        dp = [0] * (n + 1)
        dp[n] = nums[n] 
        if n >= 1: 
            dp[n - 1] = max(nums[n], nums[n - 1]) 
        
        i = n - 2
        while i >= 0: 
            dp[i] = max(dp[i + 2] + nums[i], dp[i + 1]) 
            i -= 1
        
        return dp[0]
