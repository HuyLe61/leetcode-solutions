class Solution:
    def minEatingSpeed(self, piles: list[int], h: int) -> int:
        # binary search 
        # try the largest and min as right and left 
        left_min, right_min = 1, max(piles) 
        while left_min < right_min: 
            count = 0 
            middle_min = (left_min + right_min) // 2
            for pile in piles:
                count += (pile + middle_min - 1) // middle_min
            if count <= h: 
                right_min = middle_min
            else:
                left_min = middle_min + 1
        return left_min 
