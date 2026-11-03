class Solution:
    def strStr(self, haystack: str, needle: str) -> int:
        if not needle: return 0 
        lps = [0] * len(needle) 

        prevLPS, i = 0, 1 

        while i < len(needle): 
            if needle[prevLPS] == needle[i]: 
                prevLPS += 1
                lps[i] = prevLPS
                i += 1
            elif prevLPS == 0: 
                lps[i] = 0
                i += 1
            else: 
                prevLPS = lps[prevLPS - 1] 
        
        i, j = 0, 0

        while i < len(haystack): 
            if haystack[i] == needle[j]: 
                i, j = i + 1, j + 1
                if j == len(needle): 
                    return i - len(needle)
            elif j == 0: 
                i += 1
            else: 
                j = lps[j - 1]
        
        return -1
        
