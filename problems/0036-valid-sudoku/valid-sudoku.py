class Solution:
    def isValidSudoku(self, board: list[list[str]]) -> bool:
        rows = [set() for _ in range(9)]
        cols = [set() for _ in range(9)]
        boxes = [set() for _ in range(9)] 

        for r, row in enumerate(board): 
            for c, value in enumerate(board[r]): 
                if value == ".": 
                    continue 
                box_id = (r // 3) * 3 + (c // 3)
                if value in rows[r] or value in cols[c] or value in boxes[box_id]:
                    return False
                rows[r].add(value) 
                cols[c].add(value)
                boxes[box_id].add(value)
        
        return True


