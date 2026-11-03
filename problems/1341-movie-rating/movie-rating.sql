# Write your MySQL query statement below
# Create a rank table (key: user_id), rank by number of ratings, lexicographically asc 
with t1 as ( 
    select u.name 
    from MovieRating mv
    join Users u on u.user_id = mv.user_id
    group by mv.user_id, u.name 
    order by count(*) desc, u.name asc 
    limit 1
), 

t2 as ( 
    select m.title
    from Movies m
    join MovieRating mv on mv.movie_id = m.movie_id 
    WHERE mv.created_at >= '2020-02-01' AND mv.created_at < '2020-03-01'
    group by mv.movie_id 
    order by avg(mv.rating) desc, m.title asc 
    limit 1
)

(SELECT name as results FROM t1)
UNION ALL
(SELECT title as results FROM t2);

