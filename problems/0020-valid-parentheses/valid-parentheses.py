class Solution:
    def isValid(self, s: str) -> bool:
        stack = []
        pair = {")" : "(", "]" : "[", "}" : "{"}

        for c in s: 
            if c in pair: 
                if stack and stack[-1] == pair[c]: 
                    stack.pop()
                else: 
                    return False 
            else: 
                stack.append(c) 
        
        return True if not stack else False
