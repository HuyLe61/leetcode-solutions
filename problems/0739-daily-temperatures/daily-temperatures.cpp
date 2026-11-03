class Solution {
public:
    vector<int> dailyTemperatures(vector<int>& temperatures) {
        // go from bottom to top with i, j
        vector<int> res(temperatures.size()); 
        for (int i = int(temperatures.size()) - 1; i >= 0; --i) {
            int j = i + 1; 
            while (j < temperatures.size() && temperatures[j] <= temperatures[i]) {
                if (res[j] > 0) {
                    j += res[j]; 
                }
                else {
                    j = temperatures.size(); 
                }
            }
            if (j < temperatures.size()) {
                res[i] = j - i; 
            }
        }
        return res; 
    }
};
