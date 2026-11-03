class Solution {
public:
    bool canPlaceFlowers(vector<int>& flowerbed, int n) {
        int count = 0; 
        for (size_t i = 0; i < flowerbed.size(); ++i) {
            if (flowerbed[i] == 0) {    
                bool right_empty = (i == 0) || (flowerbed[i - 1] == 0);
                bool left_empty = (i == flowerbed.size() - 1) || (flowerbed[i + 1] == 0); 
                if (right_empty && left_empty) {
                    flowerbed[i] = 1; 
                    ++count; 
                    if (count >= n) {
                        return true; 
                    }
                }
            }
        }
        return count >= n; 
    }
};
