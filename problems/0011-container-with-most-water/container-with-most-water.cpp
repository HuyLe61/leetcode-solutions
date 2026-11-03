class Solution {
public:
    int maxArea(vector<int>& height) {
        int l = 0;
        int r = height.size() - 1; 
        // 2 pointers, index a, b
        int maxA = 0; 
        while (l < r) {
            int currArea = (r - l) * min(height[l], height[r]); 
            maxA = max(maxA, currArea); 

            if (height[l] < height[r]) {
                ++l;
            }
            else {
                --r; 
            }
        }
        return maxA; 
    }
};
