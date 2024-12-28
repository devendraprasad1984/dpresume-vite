create table expenses
(
    id int auto_increment
        primary key,
    name varchar(255) null,
    date varchar(100) null,
    amount float null,
    remarks varchar(500) null,
    iploc varchar(500) null,
    `when` timestamp default CURRENT_TIMESTAMP null
);



