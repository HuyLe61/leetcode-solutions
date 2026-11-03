class Solution {
public:
    bool searchMatrix(vector<vector<int>>& matrix, int target) {
        // linear search O(m + n)
        int numRows = matrix.size(); 
        if (numRows == 0) return false; 
        int numCols = matrix[0].size(); 
        int currRow = 0; 
        int currCol = numCols - 1; 
        while (currRow < numRows && currCol >= 0) {
            if (matrix[currRow][currCol] == target) {
                return true; 
            }
            else if (matrix[currRow][currCol] > target) {
                --currCol; 
            }
            else ++currRow; 
        }
        return false; 
    }
};
