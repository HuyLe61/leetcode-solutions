class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        nums3 = nums1 + nums2 
        l = len(nums3)
        nums3.sort()
        if l % 2 == 0: 
            return (nums3[(l // 2) - 1] + nums3[(l // 2)]) / 2
        return nums3[l // 2]
