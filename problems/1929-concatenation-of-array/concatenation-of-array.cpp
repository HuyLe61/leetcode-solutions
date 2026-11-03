class Solution {
public:
    vector<int> getConcatenation(vector<int>& nums) {
        vector<int> ans = vector<int>(nums.size() * 2); 
        size_t n = nums.size();
        for (size_t i = 0; i < n * 2; ++i) {
            if (i >= nums.size()) {
                ans[i] = nums[i - n]; 
            }
            else {
                ans[i] = nums[i]; 
            }
        }
        return ans; 
    }
};
