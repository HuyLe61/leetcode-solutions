class Solution {
public:
    vector<int> shuffle(vector<int>& nums, int n) {
        vector<int> ans = vector<int>(nums.size()); 
        auto pt1 = nums.begin(); 
        auto pt2 = next(nums.begin(), n); 
        for (auto it = ans.begin(); it != ans.end(); ++it) {
            *it = *pt1; 
            ++pt1; 
            ++it; 
            *it = *pt2; 
            ++pt2; 
        }
        return ans; 
    }
};
