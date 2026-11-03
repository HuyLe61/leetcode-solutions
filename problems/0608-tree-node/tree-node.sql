# Write your MySQL query statement below
# Root node: null parent 
# Inner node: has parent node, has child node 
# Leaf node: has parent node, child node null 

select id, 
        case 
            when p_id is null then 'Root' 
            when id in (select p_id from tree where p_id is not null) then 'Inner' 
            else 'Leaf'
        END AS type 
from tree; 
