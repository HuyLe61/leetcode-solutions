class Solution {
public:
    vector<int> twoSum(vector<int> &nums, int target) {
        unordered_map<int, int> map; 
        for (int i = 0; i < nums.size(); i++) {
            int sub = target - nums[i];
            if (map.find(sub) != map.end()) {
                return {map[sub], i};
            }
            map[nums[i]] = i;
        }
        return {};
    }
};
