class Solution:
    def minimumSteps(self, s: str) -> int:
        # 1 is black, 0 is white 
        # group all 1s to the right, 0s to the left 
        # we only need 1 iteration 
        # Every time realize a 1
        # 110001001001
        # Everytime see a 1, num_1 += 1
        # l = 1, r = 4, value += (r - l) * num_1 
        # 2 pointers left and right, left will point to the last 1 in the window, right is pointing to the last 0 in the window 
        # Everytime we meet a 0, add in (r - l) * num_1
        # left, right = right + 1
        # Loop until left = last index 
        res = 0
        nums_1 = 0 
        for char in s: 
            if char == "1": 
                nums_1 += 1 
            else: 
                res += nums_1

        return res
