class Solution:
    def removeElement(self, nums: List[int], val: int) -> int:
        if not nums: 
            return 0

        index = 0 

        for i in range(len(nums)): 
            if nums[i] != val: 
                nums[index] = nums[i]
                index += 1 

        return index 

