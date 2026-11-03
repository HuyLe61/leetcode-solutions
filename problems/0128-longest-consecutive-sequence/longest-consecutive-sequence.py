class Solution:
    def longestConsecutive(self, nums: list[int]) -> int:
        # Make a hash set
        # Then count the longest length of consecutive key 
        counting_set = set(nums) 
        res = 0
        for num in counting_set: 
            if num - 1 in counting_set: 
                continue 
            length = 0 

            while num + length in counting_set: 
                length += 1 
            
            res = max(res, length) 
        
        return res


            
                
        
