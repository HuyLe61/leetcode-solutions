from collections import deque
class Solution:
    def letterCombinations(self, digits: str) -> List[str]:
        if not digits:
            return

        numbers_mapping = {   
            "2" : ["a", "b", "c"], 
            "3" : ["d", "e", "f"], 
            "4" : ["g", "h", "i"], 
            "5" : ["j", "k", "l"], 
            "6" : ["m", "n", "o"], 
            "7" : ["p", "q", "r", "s"], 
            "8" : ["t", "u", "v"], 
            "9" : ["w", "x", "y", "z"] 
        }

        stack = deque()
        for dig in digits: 
            stack.appendleft(numbers_mapping[dig])
        
        while len(stack) > 1: 
            first_comb = stack.pop() 
            second_comb = stack.pop()
            combo = [a + b for a in first_comb for b in second_comb]
            stack.append(combo) 
        
        return stack[0]

        
