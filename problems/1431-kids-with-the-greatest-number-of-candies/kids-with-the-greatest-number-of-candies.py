class Solution:
    def kidsWithCandies(self, candies: List[int], extraCandies: int) -> List[bool]:
        ans = [True] * len(candies)
        max_candies = max(candies) 
        for i in range(len(candies)): 
            if candies[i] < max_candies - extraCandies: 
                ans[i] = False 
        return ans

   
