create table rwa_config
(
    `key` varchar(30) null,
    value varchar(250) null,
    isactive int default 1 null
);

create table rwa_admin
(
    id int auto_increment
        primary key,
    username varchar(20) null,
    password varchar(30) null,
    type varchar(10) null,
    `when` timestamp default CURRENT_TIMESTAMP null,
    signin int default 0 null
);

create table rwa_members
(
    id int auto_increment
        primary key,
    memkey varchar(50) null,
    name varchar(255) null,
    address varchar(500) null,
    pic varchar(500) null,
    `when` timestamp default CURRENT_TIMESTAMP null,
    type varchar(10) default 'member' null,
    isactive int default 1 null,
    constraint memkey_uniq
        unique (memkey)
);

create table rwa_expenses
(
    id int auto_increment
        primary key,
    memid int null,
    date varchar(100) null,
    amount float null,
    remarks varchar(500) null,
    iploc varchar(500) null,
    `when` timestamp default CURRENT_TIMESTAMP null,
    constraint expenses_members_id_fk
        foreign key (memid) references rwa_members (id)
            on update cascade on delete cascade
);


alter table rwa_admin add column signin int default 0;
alter table rwa_members add column isactive int default 1;


insert into rwa_members(memkey, name, address, type)
values ('admin', 'admin', 'admin', 'admin');



alter table rwa_members add column address_number_sort float;
alter table rwa_members modify column type varchar(100);


INSERT INTO rwa_config (`key`, value) VALUES ('member_type', 'member');
INSERT INTO rwa_config (`key`, value) VALUES ('member_type', 'coordinator');
INSERT INTO rwa_config (`key`, value) VALUES ('member_type', 'president');
INSERT INTO rwa_config (`key`, value) VALUES ('member_type', 'exec committee');
INSERT INTO rwa_config (`key`, value) VALUES ('member_type', 'gen secretary');
INSERT INTO rwa_config (`key`, value) VALUES ('member_type', 'secretary');
INSERT INTO rwa_config (`key`, value) VALUES ('member_type', 'treasurer');
INSERT INTO rwa_config (`key`, value) VALUES ('member_type', 'vice president');