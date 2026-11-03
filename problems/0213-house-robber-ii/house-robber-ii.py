class Solution:
    def rob(self, nums: list[int]) -> int:
        # Dynamic Programming 
        # The constraint now is house 1 is adjacent with the last house 
        # DP[0] = DP[2] + nums[0] - nums[-1] 
        # DP[n] = nums[n] + DP[n + 2] 
        if len(nums) == 1: 
            return nums[0]

        def rob_linear(arr): 
            # assume that len(arr) > 1 
            # dp[i] = max(dp[i + 2] + arr[i], dp[i + 1]) 
            # left, right is pointing to 2 last indexes 
            left, right = 0, 0
            for num in reversed(arr): 
                left, right = max(right + num, left), left 
            return left

        return max(rob_linear(nums[:-1]), rob_linear(nums[1:]))
            
