import numpy as np 
class Solution:
    def eraseOverlapIntervals(self, intervals: list[list[int]]) -> int:
        # Easy answer 
        # The trick is to short the interval by endpoint 
        # For every interval, check if any starting point of other intervals are in that interval excluding the endpoint, then that's the number of interval we need to remove. 
        intervals.sort(key=lambda x: x[1])  # Sort by endpoint
        endpoint = -np.inf
        count_remove = 0
        for interval in intervals:  
            if interval[0] >= endpoint: 
                endpoint = interval[1] 
            else: 
                count_remove += 1 
        return count_remove



        
