class Solution:
    def coinChange(self, coins: list[int], amount: int) -> int:
        # DP programming problem 
        # Every element we consider to add or remove them 
        # DP[i] = (amount // nums[i]) 
        # or maybe build up DP as the amount and return output for each amount up to the current amount
        # DP[n] = min(n // coins[i] + dp[n % coins[i]] for every i in coins)
        # return DP[amount]
        dp = [float("inf")] * (amount + 1) 
        dp[0] = 0 

        for n in range(amount + 1): 
            for coin in coins: 
                if coin <= n: 
                    dp[n] = min(1 + dp[n - coin], dp[n]) 
        
        if dp[amount] == float("inf"): 
            return - 1
        return dp[amount]


        
