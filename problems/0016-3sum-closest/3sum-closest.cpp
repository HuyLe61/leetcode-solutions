class Solution {
public:
    int threeSumClosest(vector<int>& nums, int target) {
        sort(nums.begin(), nums.end()); 
        int res = nums[0] + nums[1] + nums[2];

        for (int i = 0; i < nums.size() - 2; ++i) {
            int left = i + 1; 
            int right = nums.size() - 1; 

            while (left < right) {
                int sum = nums[left] + nums[i] + nums[right];
                if (abs(sum - target) < abs(res - target)) {
                    res = sum; 
                }

                if (sum == target) return sum; 

                if (sum < target) {
                    ++left;
                }

                else {
                    --right; 
                }
            }
        }
        
        return res; 
    }
};
