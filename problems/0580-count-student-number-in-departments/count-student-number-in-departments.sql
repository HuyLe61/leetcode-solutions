# Write your MySQL query statement below
select d.dept_name, count(s.dept_id) as student_number  
from Department d left join Student s on d.dept_id = s.dept_id 
group by d.dept_name 
order by student_number desc, dept_name asc 
