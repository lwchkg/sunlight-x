--comment 1
select * from db.my_table where myTable.id > 10;

/* multi
line comment */

select "escaped\\\"";
select 'escaped\\\'';

#comment 2
SELECT
    f.foo `foo`,
    f.bar,
    f.name AS `foo.name`,
    b.baz
FROM foo f
INNER JOIN bar b
    ON b.id = f.bar_id
LEFT OUTER JOIN baz
    ON baz.id = f.foo
    AND baz.id IS NOT NULL
GROUP BY f.name
HAVING COUNT(f.name) < 10
WHERE LENGTH(f.foo) < 5
AND LEFT(f.foo) = 'f'

START TRANSACTION;
SELECT @A:=SUM(salary) FROM table1 WHERE type=1;
UPDATE table2 SET summary=@A WHERE type=1;
COMMIT;

DELIMITER $$

BEGIN 
DECLARE foo = 'bar';
END $$
DELIMITER ;
