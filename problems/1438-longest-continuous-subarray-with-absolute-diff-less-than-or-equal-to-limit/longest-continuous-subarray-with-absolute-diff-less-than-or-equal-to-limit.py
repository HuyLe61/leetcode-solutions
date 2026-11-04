import heapq
class Solution:
    def longestSubarray(self, nums: list[int], limit: int) -> int:
        # Use min_heap and max_heap
        min_heap, max_heap = [], [] 
        # store (value, index), (-value, index)
        max_length = 0 
        left = 0

        for right in range(len(nums)): 
            heapq.heappush(min_heap, (nums[right], right)) 
            heapq.heappush(max_heap, (-nums[right], right))
            
            while -max_heap[0][0] - min_heap[0][0] > limit: 
                left += 1 
                # Remove elements outside the current window 
                while max_heap and max_heap[0][1] < left:
                    heapq.heappop(max_heap) 
                while min_heap and min_heap[0][1] < left: 
                    heapq.heappop(min_heap) 
            
            # Update max length 
            max_length = max(max_length, right - left + 1) 
        
        return max_length
