from collections import deque
class Solution:
    def longestSubarray(self, nums: list[int], limit: int) -> int:
        # Use min_heap and max_heap
        # OPTIMIZE: can use 2 monotonic deque instead of min and max heap 
        min_q = deque()
        max_q = deque() 
        # store (value, index), (-value, index)
        max_length = 0 
        left = 0

        for right, num in enumerate(nums): 
            # Update min_q, we need increasing order 
            while min_q and nums[min_q[-1]] > num: 
                min_q.pop() 
            min_q.append(right)

            while max_q and nums[max_q[-1]] < num: 
                max_q.pop()
            max_q.append(right)
            
            while nums[max_q[0]] - nums[min_q[0]] > limit: 
                left += 1 
                # Remove elements outside the current window 
                while max_q and max_q[0] < left:
                    max_q.popleft()
                while min_q and min_q[0] < left: 
                    min_q.popleft()
            
            # Update max length 
            max_length = max(max_length, right - left + 1) 
        
        return max_length
