class Solution:
    def successfulPairs(self, spells: list[int], potions: list[int], success: int) -> list[int]:
        # Brute force
        # Another way is sort the potions 
        # Then do binary search to find the leftmost potion that is success 
        # Then the number of success for that spell is len(potions) - index 
        res = [0] * len(spells) 
        potions.sort() # O(m log m)

        # Binary search 
        for i in range(len(spells)): 
            left, right = 0, len(potions)
            while left < right: 
                mid = (left + right) // 2
                if spells[i] * potions[mid] < success: 
                    left = mid + 1
                else:
                    right = mid
            res[i] += len(potions) - left 

        return res

            


        
        return res
