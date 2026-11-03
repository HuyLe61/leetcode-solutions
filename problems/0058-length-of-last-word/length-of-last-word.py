class Solution:
    def lengthOfLastWord(self, s: str) -> int:
        s = s.strip()
        list = s.split(" ")
        return len(list[-1])
