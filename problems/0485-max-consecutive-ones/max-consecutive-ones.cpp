class Solution {
public:
    int findMaxConsecutiveOnes(vector<int>& nums) {
        auto ptr1 = nums.begin(); 
        int max_one = 0; 
        while (ptr1 != nums.end()) {
            if (*ptr1 != 1) {
                ++ptr1; 
            }
            else {
                auto ptr2 = next(ptr1, 1); 
                int curr_one = 1; 
                while (ptr2 != nums.end() && *ptr2 == 1) {
                    ++curr_one; 
                    ++ptr2;
                }
                if (curr_one > max_one) {
                    max_one = curr_one; 
                }
                ptr1 = ptr2; 
            }
        }

        return max_one; 
    }
};
