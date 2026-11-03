# Write your MySQL query statement below
# Have two weather table W1 and W2 join on 
Select w2.id 
from Weather w2 
join Weather w1 on w2.recordDate = DATE_ADD(w1.recordDate, INTERVAL 1 DAY)
where w2.temperature > w1.temperature 
