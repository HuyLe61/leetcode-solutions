class Solution:
    def isPalindrome(self, x: int) -> bool:
        if x < 0: 
            return False 
        rx = str(x)[::-1] 
        if rx == str(x): 
            return True 
        return False
 
        
