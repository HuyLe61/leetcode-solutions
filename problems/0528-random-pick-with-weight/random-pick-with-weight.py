import random 
from bisect import bisect_left
class Solution:

    def __init__(self, w: list[int]):
        self.prefix = []
        total = 0
        for weight in w: 
            total += weight
            self.prefix.append(total)

    def pickIndex(self) -> int:
        if len(self.prefix) == 1: 
            return 0
        target = random.randint(1, self.prefix[-1]) 
        return bisect_left(self.prefix, target)


# Your Solution object will be instantiated and called as such:
# obj = Solution(w)
# param_1 = obj.pickIndex()
