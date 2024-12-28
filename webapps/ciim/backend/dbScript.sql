create schema ibdn collate utf8mb4_general_ci;

create table users
(
	id int auto_increment
		primary key,
	name varchar(50) null,
	email varchar(100) null,
	password varchar(255) null,
	createdOn datetime null,
	role varchar(20) default 'user' null,
	isapproved tinyint(1) default 0 null,
	guid text null
);

create table xposts
(
	comment_id int auto_increment
		primary key,
	parent_comment_id int null,
	comment varchar(200) not null,
	userid int not null,
	date timestamp default current_timestamp() not null,
	constraint xposts_users_id_fk
		foreign key (userid) references users (id)
			on update cascade on delete cascade
)
charset=utf8;

