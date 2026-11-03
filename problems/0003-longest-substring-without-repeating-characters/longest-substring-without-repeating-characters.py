class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        count = 0
        right = left = 0 
        
        visited = [False] * 256 
        while right < len(s): 
            
            while visited[ord(s[right])]: 
                visited[ord(s[left])] = False
                left += 1
                
            visited[ord(s[right])] = True 

            count = max(count, right - left + 1) 
            right += 1
        return count 



        
