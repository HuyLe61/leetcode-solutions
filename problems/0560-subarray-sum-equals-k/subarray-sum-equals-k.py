class Solution:
    def subarraySum(self, nums: List[int], k: int) -> int:
        # Brute force 
        # let i be the iterator
        # If nums[i] > k, i -> i + 1 
        # If i = k, add 1 in res, reset k and continue 
        # If i < k, make k - i the new target, i -> i + 1 
        freq = {0: 1} 
        curr_sum = 0
        res = 0
        for num in nums: 
            curr_sum += num 
            target = curr_sum - k 
            res += freq.get(target, 0)
            if curr_sum in freq: 
                freq[curr_sum] += 1
            else: 
                freq[curr_sum] = 1
        return res

